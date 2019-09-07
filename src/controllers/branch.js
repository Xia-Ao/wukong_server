// const uuidv1 = require('uuid/v1');
const branchService = require('../services/branch');
const {respMessage} = require('../codes/branch');
const {getNowDatetime} = require('../common/utils/datetime');

let resultModel = {
    success: false,
    message: '',
    data: null,
}

const controller = {


    /**
     * 创建新分支
     * @param {*} ctx 
     */
    async createBranch(ctx) {
        let result = {...resultModel}
        // 创建分支
        try {
            let branchResult = await branchService.create()
            if (branchResult.status) {
                result.success = true;
            }
            result.message = respMessage[branchResult.code];
            result.data = branchResult.returnData;
        } catch (e) {
            console.warn(e);
            result.message = respMessage.ERROR_SYS;
        }
       
        ctx.body = result;

    },

    /**
     * 执行预发布
     * @param {object} ctx 
     */
    async handelYufa(ctx) {
        let formData = ctx.request.body;
        let branch = formData.branch;
        let result = {...resultModel};
        if (!branch) {
            result.message = respMessage.EMPTY_BRANCH;
            ctx.body = result;
            return;
        }
        try {
            let yufaResult = await branchService.handelYufaByBranch({
                branch,
            });
            if (yufaResult.status) {
                result.success = true;
            }
            result.message = respMessage[yufaResult.code];
            result.data = yufaResult.returnData;
        } catch (e) {
            console.warn(e);
            result.message = respMessage.ERROR_SYS;
        }

        ctx.body = result;
    },

    /**
     * 执行 正式发布
     * @param {object} ctx 
     */
    async handelPublish(ctx) {
        let formData = ctx.request.body;
        let branch = formData.branch;
        let result = {...resultModel};
        if (!branch) {
            result.message = respMessage.EMPTY_BRANCH;
            ctx.body = result;
            return;
        }
        try {
            let publishResult = await branchService.handelPublishByBranch({
                branch,
            });
            if (publishResult.status) {
                result.success = true;
            }
            result.message = respMessage[publishResult.code];
            result.data = publishResult.returnData;
        } catch (e) {
            console.warn(e);
            result.message = respMessage.ERROR_SYS;
        }

        ctx.body = result;

    },

    /**
     * 执行 合并master
     * @param {object} ctx 
     */
    async handelMergeMaster(ctx) {
        let formData = ctx.request.body;
        let branch = formData.branch;
        let result = {...resultModel};
        if (!branch) {
            result.message = respMessage.EMPTY_BRANCH;
            ctx.body = result;
            return;
        }
        try {
            let mergedResult = await branchService.handelMergeMasterByBranch(branch);
            if (mergedResult.status) {
                result.success = true;
            }
            result.message = respMessage[mergedResult.code];
            result.data = mergedResult.returnData;
        } catch (e) {
            result.message = respMessage.ERROR_SYS;
        }
       
        ctx.body = result;
    },

    /**
     * 执行 合并master
     * @param {object} ctx 
     */
    async handelPublishedList(ctx) {
        let result = {...resultModel};
        try {
            let listResult = await branchService.getPublishedList();
            if (listResult.status) {
                result.success = true;
            }
            result.message = respMessage[listResult.code];
            result.data = listResult.returnData;
        } catch (e) {
            result.message = respMessage.ERROR_SYS;
        }
       
        ctx.body = result;
    }
}

module.exports = controller;