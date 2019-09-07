const router = require('koa-router')();
const branchController = require('../controllers/branch');


router.prefix('/branch');

router
  .post('/create_branch', branchController.createBranch)    // 创建分支
  .post('/yufa', branchController.handelYufa)               // 预发布
  .post('/publish', branchController.handelPublish)         // 正式发布
  .post('/merge_master', branchController.handelMergeMaster)//合并主干
  .get('/published_list', branchController.handelPublishedList)
//   .post('/login', branchController.signIn);



module.exports = router