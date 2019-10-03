
const util = require('util');
// const {execFileSync,execFile, execSync, exec} = require('child_process');
const exec = util.promisify(require('child_process').exec);

const { getNowDatetime, parseStampToFormat } = require('../common/utils/datetime');
const branchModel = require('../models/branch');
const { respCode } = require('../codes/branch');
const PWD = require('../../conf/pwd');
const projectService = require('../services/project');
const { random } = require('../common/utils/utils');

const modalConvertToResp = (data) => {
    return {
        id: data.id,
        branch: data.branch,
        projectKey: data.project_key,
        projectName: data.project_name,
        planPublishTime: data.plan_publish_time,
        createTime: data.create_time,
        yufa: data.yufa,
        published: data.published,
        publishedTime: data.published_time,
        mergedMaster: data.merged_master,
    }
}
const formDataConvertToModal = (data) => {
    return {
        branch: data.branch,
        project_key: data.projectKey,
        project_name: data.projectName,
        plan_publish_time: data.planPublishTime,
        create_time: data.createTime,
        yufa: data.yufa,
        published: data.published,
        published_time: data.publishedTime,
        merged_master: data.mergedMaster,
    }
}

const returns = {
    status: false,
    code: '',
    returnData: null,
}

const branch = {

    /**
     * 创建用户
     * @param {string} formData 表单数据
     * @return {object}     创建结果 
     */
    async create(formData) {
        let result = { ...returns };
        const { projectKey, planPublishTime } = formData;

        // 1. 获取对应 应用信息
        let project = null;
        let projectResult = await projectService.getProjectByProjectKey(projectKey);
        if (!projectResult.status) {
            result.code = respCode.PROJECT_NOT_FIND_BY_KEY;
            return result;
        }
        project = projectResult.returnData;
        if (!project) {
            result.code = respCode.ERROR_SYS;
            return result;
        }

        let branch = `branch_${parseStampToFormat(new Date().getTime(), 'yyyyMMddhhmmss')}_${random(5)}`
        // 2.分支号是否存在
        let exitOne = await this.getExistOne(branch, projectKey);
        if (exitOne) {
            result.code = respCode.SAME_BRANCH;
            result.returnData = exitOne;
            return result;
        }

        // 3. 执行脚本
        // let project = PWD.testProject;
        const { stdout, stderr } = await exec(`./create_branch.sh  ${branch}`, {
            // cwd: project.SOURCE,
            cwd: project.sourcePath,
        }).catch(error => {
            console.error(`执行的错误: ${error}`);
            result.code = respCode.ERROR_IN_SHELL;
            return result;
        });



        // 4. 更新数据库插入分支号
        let branchResult = await branchModel.create({
            branch,
            project_name: project.projectName,
            project_key: project.projectKey,
            create_time: getNowDatetime(),
            plan_publish_time: planPublishTime,
        })
        if (branchResult && branchResult.insertId * 1 > 0) {
            result.status = true;
            result.code = respCode.CREATE_SUCCESS;
            result.returnData = await this.getBranchByBranchAndProjectKey(branch, projectKey);
        } else {
            result.code = respCode.ERROR_SYS;
        }

        return result;
    },

    /**
     * 通过分支号查看分支是否存在
     * @param  {string} branch 分支号
     * @param  {string} projectKey 应用key
     * @return {object}      mysql执行结果
     */
    async getExistOne(branch, projectKey = '') {

        let resultData = projectKey ?
            await branchModel.getBranchByBranchAndProjectKey(branch, projectKey) :
            await branchModel.getBranchByBranch(branch);
        let branchInfo = resultData ? modalConvertToResp(resultData) : null;
        return branchInfo;
    },

    /**
     * 通过分支号查找分支信息
     * @param  {object} formData 登录表单信息
     * @return {object}      mysql执行结果
     */
    async getBranchByBranch(branch) {
        let resultData = await branchModel.getBranchByBranch(branch)
        let branchInfo = resultData ? modalConvertToResp(resultData) : null;
        return branchInfo;
    },

    /**
     * 通过分支号和应用标识符key查找分支信息
     * @param  {object} formData 登录表单信息
     * @return {object}      mysql执行结果
     */
    async getBranchByBranchAndProjectKey(branch, projectKey) {
        let resultData = await branchModel.getBranchByBranchAndProjectKey(branch, projectKey)
        let branchInfo = resultData ? modalConvertToResp(resultData) : null;
        return branchInfo;
    },

    /**
     * 查找所有分支列表
     * @return {Array}      查找结果
     */
    async getList(params) {
        let result = { ...returns };
        let resultData = await branchModel.getList(params);
        if (Array.isArray(resultData.list) && resultData.list.length > 0) {
            result.code = respCode.SUCCESS;
        }
        resultData.list.forEach(item => {
            let status = 0;
            if (item.mergedMaster) {
                status = 2;
            } else if (item.yufa && !item.mergedMaster) {
                status = 1;
            }
            item.status = status;
        })
        result.returnData = resultData;
        result.status = true;
        return result;
    },

    /**
     * 获取所有已发布记录
     * @param  {object}  
     * @return {Array}      mysql执行结果
     */
    async getPublishedList(params) {
        let result = { ...returns };
        let resultData = await branchModel.getPublishedList(params);
        if (Array.isArray(resultData.list) && resultData.list.length > 0) {
            result.code = respCode.SUCCESS;
        }
        resultData.list.forEach(item => {
            let status = 0;
            if (item.mergedMaster) {
                status = 2;
            } else if (item.yufa && !item.mergedMaster) {
                status = 1;
            }
            item.status = status;
        })
        result.returnData = resultData;
        result.status = true;
        return result;
    },

    /**
     * 通过分支号查找当前发布计划
     * @param  {object} formData 登录表单信息
     * @return {object}      mysql执行结果
     */
    async getPublished() {
        let resultData = await branchModel.isQueeHasOne();
        let branchInfo = resultData ? modalConvertToResp(resultData) : null;
        return branchInfo;
    },

    /**
     * 查看发布队列中是否还有任务
     * @return {object}      mysql执行结果
     */
    async isQueeHasTask() {
        let resultData = await branchModel.isQueeHasTask();
        let branchInfo = resultData ? modalConvertToResp(resultData) : null;
        return branchInfo;
    },

    /**
     * 根据分支号预发布
     * @param  {String} options 参数
     * @return {object}      mysql执行结果
     */
    async handleYufaByBranch(options) {
        let result = { ...returns };
        // 1.获取当前分支信息
        let branchInfo = await this.getBranchByBranch(options.branch);
        // 2.1 分支是否存在
        if (!branchInfo) {
            result.code = respCode.EMPTY_BRANCH;
            return result;
        }
        // 2.2 判断分支状态是否可以预发布
        if (branchInfo.yufa) {
            result.code = respCode.HAS_YUFA;
            return result;
        }
        // 2.3 当前队列中的是否还有未完成的任务
        let otherTask = await this.isQueeHasTask();
        if (otherTask) {
            result.code = respCode.OTHER_TASK;
            return result;
        }
        // 3. 执行脚本
        // const {stdout, stderr} = await 
        const project = PWD.testProject;
        exec(`./bin.sh  ${options.branch}`, {
            cwd: project.YUFA,
        }).then((stdout, stderr) => {
            console.log(`stdout1: ${stdout}`);
            console.error(`stderr1: ${stderr}`);
            // 预发完成，状态为2
            branchModel.handleYufaByBranch(options.branch, 2);
        })
            .catch(error => {
                console.error(`执行的错误: ${error}`);
                result.code = respCode.ERROR_SYS;
                // 预发布出错
                branchModel.handleYufaByBranch(options.branch, 0);
            });


        // 4. 更新数据库
        let yufaResult = await branchModel.handleYufaByBranch(options.branch, 1);
        if (yufaResult && yufaResult.changedRows * 1 > 0) {
            result.status = true;
            result.code = respCode.SUCCESS;
            result.returnData = await this.getBranchByBranch(branch);
        } else {
            result.code = respCode.ERROR_SYS;
        }
        return result;
    },

    /**
     * 根据分支号 正式发布
     * @param  {object} options 分支号
     * @return {object}      mysql执行结果
     */
    async handlePublishByBranch(options) {

        let result = { ...returns };
        let branch = options.branch;

        // 1.获取当前分支信息
        let branchInfo = await this.getBranchByBranch(options.branch);
        // 2.1 分支是否存在
        if (!branchInfo) {
            result.code = respCode.EMPTY_BRANCH;
            return result;
        }
        // 2.2 判断分支状态是否可以发布
        if (branchInfo.yufa && branchInfo.published) {
            result.code = respCode.HAS_PUBLISHED;
            return result;
        }
        // 2.3 当前队列中的发布任务是否匹配
        let nowTask = await this.isQueeHasTask();
        if (!nowTask && (nowTask.branch === options.branch)) {
            result.code = respCode.PUBLISH_PLAN_NOT_EQ;
            return result;
        }
        // 3. 执行脚本
        const project = PWD.testProject;
        exec(`./bin.sh`, {
            cwd: project.ONLINE,
        }).then((stdout, stderr) => {
            console.log(`stdout1: ${stdout}`);
            console.error(`stderr1: ${stderr}`);
            // 正式发布完成，状态为2
            branchModel.handlePublishedByBranch({
                branch,
                publishedTime: getNowDatetime(),
                status: 2,
            });
        })
            .catch(error => {
                console.error(`执行的错误: ${error}`);
                result.code = respCode.ERROR_SYS;
                // 正式发布出错 状态0
                branchModel.handlePublishedByBranch({
                    branch,
                    publishedTime: getNowDatetime(),
                    status: 0,
                });
            });

        // 4. 更新数据库
        let publishResult = await branchModel.handlePublishedByBranch({
            branch,
            publishedTime: getNowDatetime(),
            status: 1,
        });
        if (publishResult && publishResult.changedRows * 1 > 0) {
            result.status = true;
            result.code = respCode.SUCCESS;
            result.returnData = await this.getBranchByBranch(branch);
        } else {
            result.code = respCode.ERROR_SYS;
        }
        return result;
    },

    /**
     * 根据分支号 合并主干
     * @param  {String} branch 分支号
     * @return {object}      mysql执行结果
     */
    async handleMergeMasterByBranch(branch) {
        let result = { ...returns };

        // 1.获取当前分支信息
        let branchInfo = await this.getBranchByBranch(branch);
        // 2.1 分支是否存在
        if (!branchInfo) {
            result.code = respCode.EMPTY_BRANCH;
            return result;
        }
        // 2.2 判断分支状态是否可以合并
        if (branchInfo.yufa && branchInfo.published && branchInfo.mergedMaster) {
            result.code = respCode.HAS_MERGED;
            return result;
        }
        // 2.3 当前队列中的发布任务是否匹配
        let nowTask = await this.isQueeHasTask();
        if (!nowTask && (nowTask.branch === branch)) {
            result.code = respCode.PUBLISH_PLAN_NOT_EQ;
            return result;
        }
        // 3. 执行脚本
        const project = PWD.testProject;
        const { stdout, stderr } = await exec(`./merge_master.sh  ${branch}`, {
            cwd: project.SOURCE,
        }).catch(error => {
            console.error(`执行的错误: ${error}`);
            result.code = respCode.ERROR_IN_SHELL;
            return result;
        });
        console.log(`stdout1: ${stdout}`);
        console.error(`stderr1: ${stderr}`);

        // 4. 更新数据库
        let mergeResult = await branchModel.handleMergeMasterByBranch({
            branch,
        });
        if (mergeResult && mergeResult.changedRows * 1 > 0) {
            result.status = true;
            result.code = respCode.SUCCESS;
            result.returnData = await this.getBranchByBranch(branch);
        } else {
            result.code = respCode.ERROR_SYS;
        }
        return result;
    },

    /**
     * 根据分支好获取发布队列
     * @param  {String} branch 
     * @return {Object}   
     */
    async handleBranchByBranch(branch) {
        let result = { ...returns };
        let resultData = await this.getBranchByBranch(branch);
        if (resultData.branch) {
            result.status = true;
            result.code = respCode.SUCCESS;
            result.returnData = resultData;
        } else {
            result.returnData = [];
        }
        result.status = true;
        return result;
    },

};

module.exports = branch;
