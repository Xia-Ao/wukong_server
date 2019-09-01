const router = require('koa-router')();
const branchController = require('../controllers/branch');


router.prefix('/branch');

router
  .post('/create_branch', branchController.createBranch)
  .post('/yufa', branchController.handelYufa)
  .post('/publish', branchController.handelPublish)
  .post('/merge_master', branchController.handelMergeMaster)
//   .post('/login', branchController.signIn);



module.exports = router