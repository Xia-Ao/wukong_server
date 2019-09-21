const router = require('koa-router')();
const projectController = require('../controllers/project');


router.prefix('/project');

router
  .post('/create_project', projectController.createProject)        // 创建应用
  .get('/project_list', projectController.handleAllList)          // 查询所有应用
  .get('/project_by_key', projectController.getProjectByKey)      // 根据标识符key查询应用
  .get('/project_by_name', projectController.getProjectByName)      // 根据应用名称查询应用




module.exports = router