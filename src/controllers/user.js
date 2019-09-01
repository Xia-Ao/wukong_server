// const uuidv1 = require('uuid/v1');
const userService = require('../services/user');
const userCode = require('../codes/user');
const {getNowDatetime} = require('../common/utils/datetime');

const controller = {

    /**
     * 用户登录
     */
    async signIn(ctx) {
        let formData = ctx.request.body;
        let result = {
            success: false,
            message: '',
            data: null,
            code: '',
        }
        let userResult = await userService.signIn(formData);
        console.log(userResult);
        // 判断用户是否存在
        if (userResult) {
            result.success = true;
        } else {
            let exitOne = await userService.getExitsOne(formData);
            if (exitOne.username === formData.userName) {
                result.code = 'FAIL_USER_NAME_OR_PASSWORD_ERROR';
                result.message = userCode.FAIL_USER_NAME_OR_PASSWORD_ERROR;
            } else {
                result.code = 'FAIL_USER_NO_EXIST';
                result.message = userCode.FAIL_USER_NO_EXIST;
            }
        }

        if (formData.source === 'form' && result.success === true) {
            let session = ctx.session;
            session.isLogin = true;
            session.userName = userResult.username;
            session.userId = userResult.id;

            // 登录成功重定向到首页
            // ctx.redirect('/branch');
        } else {
            ctx.body = result
        }
    },

    /**
     * 注册新用户
     * @param {*} ctx 
     */
    async register(ctx) {
        let formData = ctx.request.body;
        let result = {
            success: false,
            message: '',
            data: null,
        }
        let validateResult = userService.validatorSignUp(formData);
        if (!validateResult.success) {
            ctx.body = validateResult;
            return;
        }

        // 判断用户名和邮箱是否已经注册
        let exitOne = await userService.getExitsOne(formData);
        if (exitOne) {
            if (exitOne.username === formData.userName) {
                result.message = userCode.FAIL_USER_NAME_IS_EXIST;
                ctx.body = result;
                return;
            }
            if (exitOne.email === formData.email) {
                result.message = userCode.FAIL_EMAIL_IS_EXIST;
                ctx.body = result;
                return;
            }
        }

        let userResult = await userService.create({
            username: formData.userName,
            password: formData.password,
            email: formData.email,
            create_time: getNowDatetime(),
            modified_time: getNowDatetime(),
        })

        console.log('contro', userResult);
        if (userResult && userResult.insertId * 1 > 0) {
            result.success = true;
        } else {
            result.message = userCode.ERROR_SYS;
        }

        ctx.body = result;
    }
}

module.exports = controller;