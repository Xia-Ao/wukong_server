/**
 * 分支model层
 */
const dbUtils = require('../common/utils/db-util');

const branch = {
    /**
    * 数据库创建新分支
    * @param  {object} model 分支数据模型
    * @return {object}       mysql执行结果
    */
    async create(model) {
        let result = await dbUtils.insertData('branch', model);
        return result;
    },

    /**
     * 根据分支号查询分支信息
     * @param  {String} branch 分支号
     * @return {object|null}        查找结果
     */
    async getBranchByBranch(branch) {
        let _sql = `
            SELECT * from branch
            where branch="${branch}"
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
     * 获取所有分支列表
     * @return {Array}      mysql执行结果
     */
    async getList() {
        let _sql = `
            SELECT * from branch
            `
        let result = await dbUtils.query(_sql)
        if (Array.isArray(result) && result.length > 0) {
            return result;
        } else {
            return [];
        }
    },

    /**
     * 获取所有已发布记录
     * @return {Array}      mysql执行结果
     */
    async getPublishedList() {
        let _sql = `
            SELECT * from branch 
            where published=2 and merged_master=1
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