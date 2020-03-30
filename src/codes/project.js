/**
 * 项目应用接口逻辑文案管理
 */

const code = {

  SUCCESS: 'SUCCESS',

  CREATE_SUCCESS: 'CREATE_SUCCESS',

  PROJECT_NAME_OR_KEY_EXIT: 'PROJECT_NAME_OR_KEY_EXIT',

  PROJECT_NAME_OR_KEY_NOT_EXIT: 'PROJECT_NAME_OR_KEY_NOT_EXIT',

  EMPTY_PROJECT_NAME: 'EMPTY_PROJECT_NAME',

  EMPTY_PROJECT_KEY: 'EMPTY_PROJECT_KEY',

  EMPTY_SOURCE_PATH: 'EMPTY_SOURCE_PATH',

  EMPTY_YUFA_PATH: 'EMPTY_YUFA_PATH',

  EMPTY_ONLINE_PATH: 'EMPTY_ONLINE_PATH',

  EMPTY_REPOSITORY: 'EMPTY_REPOSITORY',

  NOT_FIND_PROJECT: 'NOT_FIND_PROJECT',

  PROJECT_NOT_FIND_BY_KEY: 'PROJECT_NOT_FIND_BY_KEY',

}

const message = {

  SUCCESS: '操作成功',

  CREATE_SUCCESS: '创建应用成功',


  PROJECT_NAME_OR_KEY_EXIT: '应用名称或者应用key值已存在，请使用正确的名称或者key',

  PROJECT_NAME_OR_KEY_NOT_EXIT: '应用名称或者应用key值不存在，请使用正确的名称或者key',

  EMPTY_PROJECT_NAME: '应用名称为空',

  EMPTY_PROJECT_KEY: '应用标识符key为空',

  EMPTY_SOURCE_PATH: '源码路径为空',

  EMPTY_YUFA_PATH: '预发路径为空',

  EMPTY_ONLINE_PATH: '线上路径为空',

  EMPTY_REPOSITORY: '仓库地址为空',

  NOT_FIND_PROJECT: '没有数据',

  PROJECT_NOT_FIND_BY_KEY: '应用不存在',

}


module.exports = {
  respCode: code,
  respMessage: message,
}
