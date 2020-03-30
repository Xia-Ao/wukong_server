/**
 * 分支model层
 */
const dbUtils = require('../common/utils/db-util');
const SQL = require('./SQL/project');

const formDataConvertModel = (formData) => {
    return {
        project_key: formData.projectKey,
        project_name: formData.projectName,
        source_path: formData.sourcePath,
        yufa_path: formData.yufaPath,
        online_path: formData.onlinePath,
        create_time: formData.createTime,
        git_repository: formData.repository,
    }
};

const project = {

    /**
     * 查询是名称 或者key否存在
     * @param {*} formData      数据
     * @return {object|null}    查找结果
     */
    async getExitByFormData(formData) {
        let result = await dbUtils.query(SQL.findProjectByNameOrKey(formData.projectName, formData.projectKey));
        if (Array.isArray(result) && result.length > 0) {
            result = result[0]
        } else {
            result = null
        }
        return result
    },
    /**
    * 创建新应用
    * @param  {object} formData 数据
    * @return {object}       mysql执行结果
    */
    async create(formData) {
        let result = await dbUtils.insertData('project', formDataConvertModel(formData));
        return result;
    },

    /**
    * 更新应用
    * @param  {object} formData 数据
    * @return {object}       mysql执行结果
    */
    async update(formData) {
        let result = await dbUtils.updateData('project', formDataConvertModel(formData));
        return result;
    },

    /**
     * 根据key查询应用
     * @param  {String} key 应用key
     * @return {object|null}        查找结果
     */
    async getProjectByProjectKey(key) {
        let result = await dbUtils.query(SQL.getProjectByProjectKey(key));
        if (Array.isArray(result) && result.length > 0) {
            result = result[0]
        } else {
            result = null
        }
        return result
    },

    /**
     * 根据应用名称查询应用
     * @param  {String} name 应用name
     * @return {object|null}        查找结果
     */
    async getProjectByProjectName(name) {
        let result = await dbUtils.query(SQL.getProjectByProjectName(name));
        if (Array.isArray(result) && result.length > 0) {
            result = result[0]
        } else {
            result = null
        }
        return result
    },
    /**
     * 获取所有应用列表
     * @return {Array}      mysql执行结果
     */
    async getAllList() {
        let result = await dbUtils.query(SQL.getAllProjectList())
        if (Array.isArray(result) && result.length > 0) {
            return result;
        } else {
            return [];
        }
    },

};

module.exports = project;