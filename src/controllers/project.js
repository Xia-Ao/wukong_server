// const uuidv1 = require('uuid/v1');
const projectService = require('../services/project');
const { respMessage } = require('../codes/project');

let resultModel = {
    success: false,
    message: '',
    data: null,
}

const controller = {


    /**
     * 创建新应用
     * @param {*} ctx 
     */
    async createProject(ctx) {
        let result = { ...resultModel };
        let formData = ctx.request.body;

        // 1 校验数据
        let validateResult = projectService.validatorFormData(formData);
        if (!validateResult.status) {
            result.message = respMessage[validateResult.code];
            ctx.body = result;
            return;
        }

        // 2 创建分支
        try {
            let projectResult = await projectService.create(formData)
            if (projectResult.status) {
                result.success = true;
            }
            result.message = respMessage[projectResult.code];
            result.data = projectResult.returnData;
        } catch (e) {
            console.warn(e);
            result.message = respMessage.ERROR_SYS;
        }

        ctx.body = result;

    },


    /**
     * 获取所有应用
     * @param {object} ctx 
     */
    async handleAllList(ctx) {
        let result = { ...resultModel };
        try {
            let listResult = await projectService.getAllList();
            if (listResult.status) {
                result.success = true;
            }
            result.message = respMessage[listResult.code];
            result.data = listResult.returnData;
        } catch (e) {
            result.message = respMessage.ERROR_SYS;
        }

        ctx.body = result;
    },

    /**
     * 根据应用名称查询应用
     * @param {object} ctx 
     */
    async getProjectByName(ctx) {
        let result = { ...resultModel };
        let formData = ctx.request.query;
        let { project_name: projectName = '' } = formData;
        try {
            let projectResult = await projectService.getProjectByProjectName(projectName);
            if (projectResult.status) {
                result.success = true;
            }
            result.message = respMessage[projectResult.code];
            result.data = projectResult.returnData;
        } catch (e) {
            result.message = respMessage.ERROR_SYS;
        }

        ctx.body = result;
    },


    /**
     * 根据应用标识符key查询应用
     * @param {object} ctx 
     */
    async getProjectByKey(ctx) {
        let result = { ...resultModel };
        let formData = ctx.request.query;
        let { project_key: projectKey = '' } = formData;
        try {
            let projectResult = await projectService.getProjectByProjectKey(projectKey);
            if (projectResult.status) {
                result.success = true;
            }
            result.message = respMessage[projectResult.code];
            result.data = projectResult.returnData;
        } catch (e) {
            result.message = respMessage.ERROR_SYS;
        }

        ctx.body = result;
    },

}

module.exports = controller;