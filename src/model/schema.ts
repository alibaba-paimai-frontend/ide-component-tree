import {
  types,
  destroy,
  IAnyModelType,
  _NotCustomized,
  Instance
} from 'mobx-state-tree';
import { debugModel } from '../lib/debug';
import { invariant } from '../lib/util';
import { extractFunctionNamesFromAttr } from '../lib/repl';
import { ISchemaObject } from './schema-util';

import { map, traverse, NodeLikeObject } from 'ss-tree';

// 子模块类型
export enum ChildType {
  NORMAL = 'NORMAL',
  SPECIAL = 'SPECIAL'
}

/**
 * 函数模型，借此绑定该组件的多种函数
 */
const Func = types
  .model('FuncModel', {
    id: types.optional(types.string, ''),
    body: types.optional(types.string, '')
  })
  .views(self => ({
    definition() {
      // 获取函数定义
      return `window['${self.id}'] = ${self.body}`;
    }
  }));

export interface IFunctionModel extends Instance<typeof Func> {}

export interface IFunctionList {
  names: string[];
  id: string;
  model: ISchemaObject;
}

/**
 * 组件 schema 模型
 */
export const Schema = types
  .model('SchemaModel', {
    id: types.optional(types.string, ''),
    name: types.optional(types.string, ''),
    attrs: types.optional(types.string, '{}'), // 保存属性字符串,
    parentId: types.optional(types.string, ''), // 保存父节点
    functions: types.map(Func), // 在 mst v3 中， `types.map` 默认值就是 `{}`
    children: types.array(types.late((): IAnyModelType => Schema)) // 在 mst v3 中， `types.array` 默认值就是 `[]`
  })
  .views(self => {
    // 提高性能，需要用内存缓存函数列表
    // const functionList = [];

    // traverse(this, (node: NodeLikeObject, lastResult = []) => {});

    return {
      attrsJSON() {
        return JSON.parse(this.attrs);
      },
      schema() {
        // 重新塑造出 schema，使用 map 功能（非递归方式）
        // 第三个参数为 true 的话，不生成 parent 属性；
        return map(
          this,
          (node: NodeLikeObject) => {
            return Object.assign({}, (node as any).attrsJSON, {
              id: (node as any).id
            });
          },
          true
        );
      },
      /**
       * 获取当前模块下所有的函数注册表
       */
      functionList() {
        return traverse(
          self,
          (node: ISchemaObject, list: IFunctionList[] = []) => {
            let names = extractFunctionNamesFromAttr((node as any).attrs);

            // 只保存有回调函数的列表
            if (names.length) {
              list.push({
                id: (node as ISchemaObject).id,
                model: node,
                names
              });
            }
            return list;
          }
        );
      }
    };
  })
  // 用于缓存各种中间属性
  .volatile(self => ({
    functionList: new Map()
  }))
  .actions(self => {
    return {
      setParent(model: any) {
        invariant(model && model.id, `${model} 节点不能为空，且必须要有 id`);
        self.parentId = model.id;
      },
      setChildren(children: any) {
        // 设置子节点的时候需要绑定父节点
        // this.children = children || [];
        children.forEach((child: any) => {
          child.setParent(self); // 绑定父节点
        });
        self.children = children || [];
      }
    };
  });

export interface ISchemaModel extends Instance<typeof Schema> {}
