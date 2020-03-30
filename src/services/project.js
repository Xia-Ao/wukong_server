/*
 * @Author: ao.xia 
 * @Date: 2019-09-21 15:23:17 
 * @Last Modified by: ao.xia
 * @Last Modified time: 2020-03-30 17:57:13
 */

const projectModel = require('../models/project');
const { respCode } = require('../codes/project');
const { getNowDatetime } = require('../common/utils/datetime');

const modalConvertToResp = (data) => {
    return {
        projectName: data.project_name,
        projectKey: data.project_key,
        sourcePath: data.source_path,
        yufaPath: data.yufa_path,
        onlinePath: data.online_path,
        repository: data.git_repository,
        createTime: data.create_time,
    }
}

const returns = {
    status: false,
    code: '',
    returnData: null,
}

const project = {

    /**
     * 创建用户
     * @return {object}     创建结果 
     */
    async create(formData) {
        let result = { ...returns };

        // 1. 检查当前name，key是否存在
        let exitOne = await this.getExitOne(formData);
        if (exitOne) {
            result.code = respCode.PROJECT_NAME_OR_KEY_EXIT;
            result.returnData = exitOne;
            return result;
        }
        // 2. 更新数据库插入分支号
        let projectResult = await projectModel.create(Object.assign(formData, {
            createTime: getNowDatetime(),
        }))
        if (projectResult && projectResult.affectedRows * 1 > 0) {
            result.status = true;
            result.code = respCode.CREATE_SUCCESS;
            result.returnData = await this.getProjectByProjectKey(formData.projectKey);
        } else {
            result.code = respCode.ERROR_SYS;
        }

        return result;
    },

    /**
     * 更新应用
     * @return {object}     更新应用结果 
     */
    async update(formData) {
        let result = { ...returns };

        // 1. 检查当前name，key是否存在
        let exitOne = await this.getExitOne(formData);
        if (!exitOne) {
            result.code = respCode.PROJECT_NAME_OR_KEY_NOT_EXIT;
            return result;
        }
        // 2. 更新数据库插入分支号
        let projectResult = await projectModel.create(Object.assign(formData, {
            createTime: getNowDatetime(),
        }))
        if (projectResult && projectResult.affectedRows * 1 > 0) {
            result.status = true;
            result.code = respCode.CREATE_SUCCESS;
            result.returnData = await this.getProjectByProjectKey(formData.projectKey);
        } else {
            result.code = respCode.ERROR_SYS;
        }

        return result;
    },

    /**
     * 检验创建应用字段
     * @param  {object} formData 数据
     * @return {object}          校验结果
     */
    validatorFormData(formData) {
        let result = { ...returns };

        if (!formData.projectName) {
            result.code = respCode.EMPTY_PROJECT_NAME;
            return result;
        }

        if (!formData.projectKey) {
            result.code = respCode.EMPTY_PROJECT_KEY;
            return result;
        }

        if (!formData.sourcePath) {
            result.code = respCode.EMPTY_SOURCE_PATH;
            return result;
        }

        if (!formData.yufaPath) {
            result.code = respCode.EMPTY_YUFA_PATH;
            return result;
        }

        if (!formData.onlinePath) {
            result.code = respCode.EMPTY_ONLINE_PATH;
            return result;
        }
        if (!formData.repository) {
            result.code = respCode.EMPTY_REPOSITORY;
            return result;
        }

        result.status = true
        return result
    },



    /**
     * 
     * @param {*} project 
     */
    async getExitOne(formData) {
        let result = await projectModel.getExitByFormData(formData);
        if (result) {
            return modalConvertToResp(result);
        }
        return null;
    },

    /**
     * 通过应用key值查找应用信息
     * @param  {String} key 应用key值
     * @return {object}      mysql执行结果
     */
    async getProjectByProjectKey(key) {
        let result = { ...returns };
        let resultData = await projectModel.getProjectByProjectKey(key)
        if (resultData) {
            result.status = true;
            result.code = respCode.SUCCESS;
            result.returnData = resultData ? modalConvertToResp(resultData) : null
        } else {
            result.returnData = {};
            result.code = respCode.NOT_FIND_PROJECT;
        }

        return result;
    },
    /**
     * 通过应用名称name值查找应用信息
     * @param  {String} name 应用名称
     * @return {object}      mysql执行结果
     */
    async getProjectByProjectName(name) {
        let result = { ...returns };
        let resultData = await projectModel.getProjectByProjectName(name);
        if (resultData) {
            result.status = true;
            result.code = respCode.SUCCESS;
            result.returnData = resultData ? modalConvertToResp(resultData) : null
        } else {
            result.returnData = {};
            result.code = respCode.NOT_FIND_PROJECT;
        }

        return result;
    },

    /**
     * 查找所有应用
     * @return {Array}      查找结果
     */
    async getAllList() {
        let result = { ...returns };
        let resultData = await projectModel.getAllList();
        if (Array.isArray(resultData) && resultData.length > 0) {
            result.code = respCode.SUCCESS;
            result.returnData = resultData.map((item) => modalConvertToResp(item))
        } else {
            result.returnData = [];
        }
        result.status = true;
        return result;
    },





};

module.exports = project;
