import { types, destroy, IAnyModelType, Instance } from 'mobx-state-tree';
import { debugModel } from '../../lib/debug';
import { invariant, sortNumberDesc, pick } from '../../lib/util';
import { extractFunctionNamesFromAttr } from '../../lib/repl';

/**
 * 函数模型，借此绑定该组件的多种函数
 */
const Func = types
  .model('FuncModel', {
    name: types.optional(types.string, ''),
    body: types.optional(types.string, '')
  })
  .views(self => ({
    get definition() {
      // 获取函数定义
      return `window['${self.name}'] = ${self.body}`;
    }
  }));

export interface IFunctionModel extends Instance<typeof Func> {}
