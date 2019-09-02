
const validator = require('validator');
const util = require('util');
// const {execFileSync,execFile, execSync, exec} = require('child_process');
const exec = util.promisify(require('child_process').exec);

const branchModel = require('../models/branch');
const {respCode} = require('../codes/branch');
const pwd = require('../../conf/pwd');
const {getNowDatetime} = require('../common/utils/datetime');

const dataConvertToRes = (data) => {
    return {
        branch: data.branch,
        createTime: data.create_time,
        yufa: data.yufa,
        published: data.published,
        publishedTime: data.published_time,
        mergedMaster: data.merged_master,
    }
}

const returns = {
    status: false,
    meassage: '',
    returnData: null,
}

const branch = {

    /**
     * 创建用户
     * @return {object}     创建结果 
     */
    async create() {
        let result = {...returns};

        // 1. 执行脚本
        const {stdout, stderr} = await exec('./create_branch.sh', {
            cwd: pwd.DEV,
        }).catch(error => {
            console.error(`执行的错误: ${error}`);
            result.code = respCode.ERROR_SYS;
        });

        console.log(`stdout1: ${stdout}`);
        console.error(`stderr1: ${stderr}`);
        let reg = /new_branch_name=@(.+)@/igm;
        let matchArr = stdout.match(reg);
        if (matchArr.lenght <= 0) {
            result.code = respCode.ERROR_IN_SHELL;
            return result;
        }
        let branch = matchArr[0].replace(reg, '$1');
        if (!branch) {
            result.code = respCode.ERROR_IN_SHELL;
            return result;
        }

        // 2.分支号是否存在
        let exitOne = await this.getExistOne(branch);
        if (exitOne) {
            result.code = respCode.SAME_BRANCH;
            result.returnData = exitOne;
            return result;
        }
        // 3. 更新数据库插入分支号
        let branchResult = await branchModel.create({
            branch,
            create_time: getNowDatetime(),
        })
        if (branchResult && branchResult.insertId * 1 > 0) {
            result.status = true;
            result.code = respCode.CREATE_SUCCESS;
            result.returnData = await this.getBranchByBranch(branch);
        } else {
            result.code = respCode.ERROR_SYS;
        }

        return result;
    },

    /**
     * 通过分支号查看分支是否存在
     * @param  {object} formData 登录表单信息
     * @return {object}      mysql执行结果
     */
    async getExistOne(branch) {
        let resultData = await branchModel.getBranchByBranch(branch)
        let branchInfo = null;
        if (resultData) {
            branchInfo = {
                branch: resultData.branch,
                createTime: resultData.create_time,
            };
        }
        return branchInfo;
    },

    /**
     * 通过分支号查找分支信息
     * @param  {object} formData 登录表单信息
     * @return {object}      mysql执行结果
     */
    async getBranchByBranch(branch) {
        let resultData = await branchModel.getBranchByBranch(branch)
        let branchInfo = resultData ? dataConvertToRes(resultData) : null;
        return branchInfo;
    },

    /**
     * 查找所有分支列表
     * @return {Array}      查找结果
     */
    async getAllBranch() {
        let result = await branchModel.getAllBranch()
        return result;
    },

    /**
     * 获取所有已发布记录
     * @param  {object} formData 登录表单信息
     * @return {Array}      mysql执行结果
     */
    async getAllPublished() {
        let resultData = await branchModel.getAllPublishedBranch()
        return resultData;
    },

    /**
     * 通过分支号查找当前发布计划
     * @param  {object} formData 登录表单信息
     * @return {object}      mysql执行结果
     */
    async getPublished() {
        let resultData = await branchModel.isQueeHasOne();
        let branchInfo = resultData ? dataConvertToRes(resultData) : null;
        return branchInfo;
    },

    /**
     * 查看发布队列中是否还有任务
     * @return {object}      mysql执行结果
     */
    async isQueeHasTask() {
        let resultData = await branchModel.isQueeHasTask();
        let branchInfo = resultData ? dataConvertToRes(resultData) : null;
        return branchInfo;
    },

    /**
     * 根据分支号预发布
     * @param  {String} options 参数
     * @return {object}      mysql执行结果
     */
    async handelYufaByBranch(options) {
        let result = {...returns};
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
        exec(`./bin.sh  ${options.branch}`, {
            cwd: pwd.YUFA_DEV,
        }).then((stdout, stderr) => {
            console.log(`stdout1: ${stdout}`);
            console.error(`stderr1: ${stderr}`);
            // 预发完成，状态为2
            branchModel.handelYufaByBranch(options.branch, 2);
        })
            .catch(error => {
                console.error(`执行的错误: ${error}`);
                result.code = respCode.ERROR_SYS;
                // 预发布出错
                branchModel.handelYufaByBranch(options.branch, 0);
            });


        // 4. 更新数据库
        let yufaResult = await branchModel.handelYufaByBranch(options.branch, 1);
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
    async handelPublishByBranch(options) {

        let result = {...returns};
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
        exec(`./bin.sh`, {
            cwd: pwd.ONLINE_DEV,
        }).then((stdout, stderr) => {
            console.log(`stdout1: ${stdout}`);
            console.error(`stderr1: ${stderr}`);
            // 正式发布完成，状态为2
            branchModel.handelPublishedByBranch({
                branch,
                publishedTime: getNowDatetime(),
                status: 2,
            });
        })
            .catch(error => {
                console.error(`执行的错误: ${error}`);
                result.code = respCode.ERROR_SYS;
                // 正式发布出错 状态0
                branchModel.handelPublishedByBranch({
                    branch,
                    publishedTime: getNowDatetime(),
                    status: 0,
                });
            });

        // 4. 更新数据库
        let publishResult = await branchModel.handelPublishedByBranch({
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
    async handelMergeMasterByBranch(branch) {
        let result = {...returns};

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
        const {stdout, stderr} = await exec(`./merge_master.sh  ${branch}`, {
            cwd: pwd.DEV,
        }).catch(error => {
            console.error(`执行的错误: ${error}`);
            result.code = respCode.ERROR_IN_SHELL;
            return result;
        });
        console.log(`stdout1: ${stdout}`);
        console.error(`stderr1: ${stderr}`);

        // 4. 更新数据库
        let mergeResult = await branchModel.handelMergeMasterByBranch({
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



};

module.exports = branch;
