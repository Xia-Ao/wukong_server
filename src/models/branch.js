/**
 * 分支model层
 */
const dbUtils = require('../common/utils/db-util');
const SQL = require('./SQL/branch');

const modalConvertToResp = (data) => {
    return {
        branch: data.branch,
        projectKey: data.project_key,
        projectName: data.project_name,
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
        create_time: data.createTime,
        yufa: data.yufa,
        published: data.published,
        published_time: data.publishedTime,
        merged_master: data.mergedMaster,
    }
}

const branch = {
    /**
    * 数据库创建新分支
    * @param  {object} data 分支数据
    * @return {object}       mysql执行结果
    */
    async create(data) {
        let result = await dbUtils.insertData('branch', formDataConvertToModal(data));
        return result;
    },

    /**
     * 根据分支号查询分支信息
     * @param  {String} branch 分支号
     * @return {object|null}        查找结果
     */
    async getBranchByBranch(branch = '') {
        let result = await dbUtils.query(SQL.findBranchByBranch(branch))
        if (Array.isArray(result) && result.length > 0) {
            result = result[0]
        } else {
            result = null
        }
        return result
    },

    /**
     * 根据分支号和应用key查询分支信息
     * @param  {String} branch 分支号
     * @param  {String} projectKey 应用key
     * @return {object|null}        查找结果
     */
    async getBranchByBranchAndProjectKey(branch = '', projectKey = '') {
        let result = await dbUtils.query(SQL.findBranchByBranchAndProjectKey(branch, projectKey))
        if (Array.isArray(result) && result.length > 0) {
            result = result[0]
        } else {
            result = null
        }
        return result
    },
    
    /**
     * 获取所有分支列表
     * @return {Array}      mysql执行结果
     */
    async getList({page = 1, pageSize = 10} = {}) {
        var start = (page - 1) * pageSize;
        let result = await dbUtils.query(SQL.getAllList(start, pageSize));
        let total = result[0][0].total || 0;
        let list = result[1];
        if (Array.isArray(list) && list.length > 0) {
            list = list.map(item => modalConvertToResp(item));
        }
        return {
                total,
                page,
                pageSize,
                list,
            };
    },

    /**
     * 获取所有已发布记录
     * @return {Array}      mysql执行结果
     */
    async getPublishedList() {
        let _sql = `
            SELECT * from branch where published=2 and merged_master=1
            `
        let result = await dbUtils.query(_sql);
        if (Array.isArray(result) && result.length > 0) {
            console.log(result);
            return result;
        } else {
            return [];
        }
    },

    /**
     * 通过分支号查找当前发布计划
     * @param  {obejct} options 查找条件参数
     * @return {object|null}        查找结果
     */
    async getPublishPlanByBranch(options) {
        let _sql = `
        SELECT * from branch
        where branch="${options.branch}"
        limit 1`
        let result = await dbUtils.query(_sql)
        if (Array.isArray(result) && result.length > 0) {
            result = result[0]
        } else {
            result = null
        }
        return result
    },

    

    /**
     * 查看当前项目是否有发布计划
     * @return {object|null}        查找结果
     */
    async isQueeHasTask() {
        let _sql = `
        SELECT * from branch
        where yufa>0 and (published<=1 or merged_master<=0)
        limit 1`
        let result = await dbUtils.query(_sql)
        if (Array.isArray(result) && result.length > 0) {
            result = result[0]
        } else {
            result = null
        }
        return result
    },

    /**
     * 通过分支号 执行预发布
     * @param  {String} branch 分支号
     * @return {object|null}        查找结果
     */
    async handleYufaByBranch(branch, status) {
        let _sql = `
            UPDATE branch set yufa=${status}
            where branch="${branch}"
            limit 1`
        let result = await dbUtils.query(_sql);
        return result
    },

    /**
     * 通过分支号 执行正式发布
     * @param  {obejct} options 查找条件参数
     * @return {object|null}        查找结果
     */
    async handlePublishedByBranch(options) {
        let _sql = `
            UPDATE branch set 
                published=${options.status} , 
                published_time="${options.publishedTime}"
            where branch="${options.branch}"
            limit 1`
        let result = await dbUtils.query(_sql)
        return result
    },
    
    /**
     * 通过分支号 执行合并主干
     * @param  {obejct} options 查找条件参数
     * @return {object|null}        查找结果
     */
    async handleMergeMasterByBranch(options) {
        let _sql = `
            UPDATE branch set merged_master=1
            where branch="${options.branch}"
            limit 1`
        let result = await dbUtils.query(_sql)
        return result
    },
};

module.exports = branch;