const branchService = require('../services/branch');
const {respMessage} = require('../codes/branch');

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
    async handleYufa(ctx) {
        let formData = ctx.request.body;
        let branch = formData.branch;
        let result = {...resultModel};
        if (!branch) {
            result.message = respMessage.EMPTY_BRANCH;
            ctx.body = result;
            return;
        }
        try {
            let yufaResult = await branchService.handleYufaByBranch({
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
    async handlePublish(ctx) {
        let formData = ctx.request.body;
        let branch = formData.branch;
        let result = {...resultModel};
        if (!branch) {
            result.message = respMessage.EMPTY_BRANCH;
            ctx.body = result;
            return;
        }
        try {
            let publishResult = await branchService.handlePublishByBranch({
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
    async handleMergeMaster(ctx) {
        let formData = ctx.request.body;
        let branch = formData.branch;
        let result = {...resultModel};
        if (!branch) {
            result.message = respMessage.EMPTY_BRANCH;
            ctx.body = result;
            return;
        }
        try {
            let mergedResult = await branchService.handleMergeMasterByBranch(branch);
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
     * 获取发布历史
     * @param {object} ctx 
     */
    async handlePublishedList(ctx) {
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
    },
    
    /**
     * 获取所有分支
     * @param {object} ctx 
     */
    async handleList(ctx) {
        let result = {...resultModel};
        try {
            let listResult = await branchService.getList();
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