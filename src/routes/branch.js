const router = require('koa-router')();
const branchController = require('../controllers/branch');


router.prefix('/branch');

router
  .post('/create_branch', branchController.createBranch)        // 创建分支
  .post('/yufa', branchController.handleYufa)                   // 预发布
  .post('/publish', branchController.handlePublish)             // 正式发布
  .post('/merge_master', branchController.handleMergeMaster)    // 合并主干
  .get('/published_list', branchController.handlePublishedList) // 获取发布历史
  .get('/list', branchController.handleList) // 获取所有分支



module.exports = router