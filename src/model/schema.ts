import {
  types,
  destroy,
  IModelType,
  IOptionalIType,
  ISimpleType,
  IMapType,
  IArrayType,
  ModelPropertiesDeclarationToProperties,
  _NotCustomized
} from 'mobx-state-tree';
import { debugModel } from '../lib/debug';
import { invariant } from '../lib/util';

import { map, traverse, NodeLikeObject } from 'ss-tree';

// 子模块类型
export enum ChildType {
  NORMAL = 'NORMAL',
  SPECIAL = 'SPECIAL'
}

export type TFuncModel = IModelType<
  ModelPropertiesDeclarationToProperties<{
    id: IOptionalIType<ISimpleType<string>>;
    body: IOptionalIType<ISimpleType<string>>;
  }>,
  { definition(): string },
  _NotCustomized,
  _NotCustomized
>;
/**
 * 函数模型，借此绑定该组件的多种函数
 */
const Func: TFuncModel = types
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

export type TSchemaModel = IModelType<
  ModelPropertiesDeclarationToProperties<{
    id: IOptionalIType<ISimpleType<string>>;
    name: IOptionalIType<ISimpleType<string>>;
    attrs: IOptionalIType<ISimpleType<string>>;
    parent: IOptionalIType<TSchemaModel>;
    fns: IOptionalIType<IMapType<TFuncModel>>;
    children: IArrayType<TSchemaModel>;
  }>,
  {},
  _NotCustomized,
  _NotCustomized
>;

/**
 * 组件 schema 模型
 */
export const Schema: TSchemaModel = types
  .model('SchemaModel', {
    id: types.optional(types.string, ''),
    name: types.optional(types.string, ''),
    attrs: types.optional(types.string, ''), // 保存属性字符串,
    parent: types.optional(types.late(() => Schema), null), // 保存父节点
    fns: types.optional(types.map(Func), {}),
    children: types.optional(types.array(types.late(() => Schema)), [])
  })
  .views(self => {
    // 提高性能，需要用内存缓存函数列表

    const functionList = [];

    traverse(this, (node: NodeLikeObject, lastResult = []) => {});

    console.log('111111');

    return {
      attribute() {
        return JSON.parse(this.attrs);
      },
      get schema() {
        // 重新塑造出 schema，使用 map 功能（非递归方式）
        // 第三个参数为 true 的话，不生成 parent 属性；
        return map(
          this,
          (node: NodeLikeObject) => {
            return Object.assign({}, (node as any).attribute, {
              id: (node as any).id
            });
          },
          true
        );
      }
    };
  })
  .actions(self => {
    return {
      setParent(model: any) {
        invariant(model && model.id, `${model} 节点不能为空，且必须要有 id`);
        self.parent = model;
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
