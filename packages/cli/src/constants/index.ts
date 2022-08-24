// TODO: 生产项目开发以及打包支持
// TODO: 脚手架打包支持

export enum PROJECT_TYPE {
  /**
   * 类库
   */
  classLib = 'classLib',
  /**
   * 组件库
   */
  componentLib = 'componentLib'
}

export const PROJECT_TYPE_LABEL = {
  [PROJECT_TYPE.classLib]: '类库',
  [PROJECT_TYPE.componentLib]: '组件库'
};
