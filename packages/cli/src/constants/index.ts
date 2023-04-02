export enum PROJECT_TYPE {
  /**
   * 类库
   */
  classLib = 'classLib',
  /**
   * 组件库
   */
  componentLib = 'componentLib',
  /**
   * Node 类库
   */
  nodeClassLib = 'nodeClassLib',
  /**
   * 脚手架
   */
  cli = 'cli'
}

export const PROJECT_TYPE_LABEL = {
  [PROJECT_TYPE.classLib]: '类库',
  [PROJECT_TYPE.componentLib]: '组件库',
  [PROJECT_TYPE.nodeClassLib]: 'Node 类库',
  [PROJECT_TYPE.cli]: '脚手架'
};
