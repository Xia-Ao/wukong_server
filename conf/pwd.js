
const process = require('process')

const PATH = {
    DEV: {
        testProject: {
            SOURCE: '/Users/xiaao/work/workspace/project/wukong/wukong_space/sourceCode',
            YUFA: '/Users/xiaao/work/workspace/project/wukong/wukong_space/yufa',
            ONLINE: '/Users/xiaao/work/workspace/project/wukong/wukong_space/online',
        },
        VueDemo: {
            SOURCE: '/Users/xiaao/work/workspace/project/wukong/wukong_space/sourceCode',
            YUFA: '/Users/xiaao/work/workspace/project/wukong/wukong_space/yufa',
            ONLINE: '/Users/xiaao/work/workspace/project/wukong/wukong_space/online',
        }

    },

    PRODECTION: {
        testProject: {
            SOURCE: '/root/workspace/wukong/projectFloder/testProject/sourceCode',
            YUFA: '/root/workspace/wukong/projectFloder/testProject/yufa',
            ONLINE: '/root/workspace/wukong/projectFloder/testProject/online',
        },
        VueDemo: {
            SOURCE: '/root/workspace/wukong/VueDemo/sourceCode',
            YUFA: '/root/workspace/wukong/VueDemo/yufa',
            ONLINE: '/root/workspace/wukong/VueDemo/online',
        }
    },
}
console.log('运行环境为', process.env.NODE_ENV);

const pwd = process.env.NODE_ENV === 'production' ? PATH.PRODECTION : PATH.DEV;


module.exports = pwd