
const process = require('process')

const PATH = {
    DEV: {
        testProject: {
            SOURCE: '/Users/xiaao/work/workspace/wukong/wukong_space/sourceCode',
            YUFA: '/Users/xiaao/work/workspace/wukong/wukong_space/yufa',
            ONLINE: '/Users/xiaao/work/workspace/wukong/wukong_space/online',
        },
        VueDemo: {
            SOURCE: '/Users/xiaao/work/workspace/wukong/wukong_space/sourceCode',
            YUFA: '/Users/xiaao/work/workspace/wukong/wukong_space/yufa',
            ONLINE: '/Users/xiaao/work/workspace/wukong/wukong_space/online',
        }

    },

    PRODECTION: {
        testProject: {
            SOURCE: '/root/workspace/wukongServer/projectFloder/testProject/sourceCode',
            YUFA: '/root/workspace/wukongServer/projectFloder/testProject/yufa',
            ONLINE: '/root/workspace/wukongServer/projectFloder/testProject/online',
        },
        VueDemo: {
            SOURCE: '/root/workspace/wukongServer/VueDemo/sourceCode',
            YUFA: '/root/workspace/wukongServer/VueDemo/yufa',
            ONLINE: '/root/workspace/wukongServer/VueDemo/online',
        }
    },
}

const pwd = process.env.NODE_ENV === 'production' ? PATH.PRODECTION : PATH.DEV


module.exports = pwd