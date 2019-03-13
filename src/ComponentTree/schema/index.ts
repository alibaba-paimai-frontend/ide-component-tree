import {
  cast,
  types,
  Instance,
  IAnyModelType,
  applySnapshot,
  SnapshotOrInstance
} from 'mobx-state-tree';

import { pick } from 'ide-lib-utils';
import { BaseModel, TBaseControlledKeys, BASE_CONTROLLED_KEYS, stringLiterals, ElementType } from 'ide-lib-base-component';

import { debugModel } from '../../lib/debug';
import { updateModelAttribute } from './util';

// export enum ECodeLanguage {
//   JSON = 'json',
//   JS = 'javascript',
//   TS = 'typescript'
// }
// export const CODE_LANGUAGES = Object.values(ECodeLanguage);

const SELF_CONTROLLED_KEYS = stringLiterals('listVisible');
export const CONTROLLED_KEYS = BASE_CONTROLLED_KEYS.concat(SELF_CONTROLLED_KEYS);

// 获取被 store 控制的 model key 的列表，
// note: 由于 使用 BaseModel 继承获得，用 awesome-typescript-load 解析不出来，只能自己定义了
export type TComponentTreeControlledKeys = ElementType<typeof SELF_CONTROLLED_KEYS> | TBaseControlledKeys;


/**
 * ComponentTree 对应的模型
 */
export const ComponentTreeModel: IAnyModelType = BaseModel
  .named('ComponentTreeModel')
  .props({
    listVisible: types.optional(types.boolean, false),
    // language: types.optional(
    //   types.enumeration('Type', CODE_LANGUAGES),
    //   ECodeLanguage.JS
    // ),
    // children: types.array(types.late((): IAnyModelType => SchemaModel)) // 在 mst v3 中， `types.array` 默认值就是 `[]`
    // options: types.map(types.union(types.boolean, types.string))
    // 在 mst v3 中， `types.map` 默认值就是 `{}`
    //  ide 的 Options 可选值参考： https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html
  })
  .views(self => {
    return {
      /**
       * 只返回当前模型的属性，可以通过 filter 字符串进行属性项过滤
       */
      allAttibuteWithFilter(filterArray: string | string[] = CONTROLLED_KEYS) {
        const filters = [].concat(filterArray || []);
        return pick(self, filters);
      }
    };
  })
  .actions(self => {
    return {
      setListVisible(v: boolean | string) {
        self.listVisible = v === true || v === 'true'
      }
    };
  })
  .actions(self => {
    return {
      updateAttribute(name: string, value: any) {
        return updateModelAttribute(self as IComponentTreeModel, name, value);
      }
    };
  });

export interface IComponentTreeModel extends Instance < typeof ComponentTreeModel > {}

/**
 * 函数模型，借此绑定该组件的多种函数
 */
const Func:IAnyModelType = types
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
