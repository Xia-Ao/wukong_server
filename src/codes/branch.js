/**
 * 逻辑文案管理
 */

const branchCode = {

  SUCCESS: 'SUCCESS',

  CREATE_SUCCESS: 'CREATE_SUCCESS',

  EMPTY_BRANCH: 'EMPTY_BRANCH',

  SAME_BRANCH: 'SAME_BRANCH',

  OTHER_TASK: 'OTHER_TASK',

  ERROR_SYS: 'error_sys',

  HAS_YUFA: 'HAS_YUFA',

  HAS_PUBLISHED: 'HAS_PUBLISHED',

  HAS_MERGED: 'HAS_MERGED',

  PUBLISH_PLAN_NOT_EQ: 'PUBLISH_PLAN_NOT_EQ',

  ERROR_IN_SHELL: 'ERROR_IN_SHELL',

  EMPTY_PEOJECT_KEY: 'EMPTY_PEOJECT_KEY',

  PROJECT_NOT_FIND_BY_KEY: 'PROJECT_NOT_FIND_BY_KEY',

}

const branchMessage = {

  SUCCESS: '操作成功',

  CREATE_SUCCESS: '创建成功',

  EMPTY_BRANCH: '分支号不能为空',

  SAME_BRANCH: '分支号已存在，请确认分支生成正确',

  OTHER_TASK: '当前项目中还有未完成的任务',

  error_sys: '系统错误',

  HAS_YUFA: '当前分支已经预发布过',

  HAS_PUBLISHED: '当前分支已经发布过',

  HAS_MERGED: '当前分支已经合并到主干',

  PUBLISH_PLAN_NOT_EQ: '队列中没有发布任务或与当前发布任务不匹配',
  
  ERROR_IN_SHELL: '脚本执行出错',

  EMPTY_PEOJECT_KEY: '项目标识符project_key为空',

  PROJECT_NOT_FIND_BY_KEY: '应用不存在',

}


module.exports = {
  respCode: branchCode,
  respMessage: branchMessage,
}
