import { types, destroy, IAnyModelType, Instance } from 'mobx-state-tree';
import { debugModel } from '../../lib/debug';
import { invariant, sortNumberDesc, pick } from '../../lib/util';
import { extractFunctionNamesFromAttr } from '../../lib/repl';
import {
  ISchemaObject,
  stringifyAttribute,
  findById,
  getAllNodes
} from './util';

import { map, traverse } from 'ss-tree';

// // 子模块类型
// export enum ChildType {
//   NORMAL = 'NORMAL',
//   SPECIAL = 'SPECIAL'
// }

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

/**
 * 组件 schema 模型
 */
export const Schema = types
  .model('SchemaModel', {
    id: types.optional(types.string, ''), // 创建之后固定，不能再更改
    screenId: types.optional(types.string, ''), // 这个是显示在页面上的 id，是可以被更改的，该 id 是用在回调函数等地方
    name: types.optional(types.string, ''),
    attrs: types.optional(types.string, '{}'), // 保存属性字符串,
    parentId: types.optional(types.string, ''), // 保存父节点
    functions: types.map(Func), // 在 mst v3 中， `types.map` 默认值就是 `{}`
    children: types.array(types.late((): IAnyModelType => Schema)) // 在 mst v3 中， `types.array` 默认值就是 `[]`
  })

  // 基于 mobx 的 computed 功能，默认会有缓存功能
  .views(self => {
    return {
      /**
       * 获取 JSON 格式的 attrs
       * 依赖属性：attrs
       */
      get attrsJSON() {
        return JSON.parse(self.attrs);
      },

      /**
       * 获取直系子类的 id 列表
       * 依赖属性：children
       */
      get childrenIds() {
        return (self.children || []).map((child: ISchemaModel) => child.id);
      },

      /**
       * 获取函数名 map 列表
       * 依赖属性：attrs
       */
      get functionsMap() {
        return traverse(self, (node: ISchemaObject, fnsMap = new Map()) => {
          // 抽离出所有的函数名
          const names = extractFunctionNamesFromAttr((node as any).attrs);
          // 只保存有回调函数的列表
          if (names.length) {
            // 反向索引，根据函数名能够查询获取节点信息
            names.forEach(name => {
              fnsMap.set(name, {
                model: node
              });
            });
          }
          return fnsMap;
        });
      },

      /**
       * 获取 schema json 格式数据
       * 依赖属性：attrs
       */
      get schemaJSON() {
        return map(
          self,
          (node: ISchemaObject) => {
            // updateFunctionsMap(node);
            return Object.assign({}, (node as any).attrsJSON, {
              id: node.id,
              screenId: node.screenId,
              name: node.name
            });
          },
          true
        );
      },

      /**
       * 生成函数模板，在输出到函数面板上的时候有用到
       * 依赖属性：functions
       */
      get functionDefinitions(): string {
        // 树的非递归遍历
        return traverse(self, (node: ISchemaModel, str: string = '') => {
          Array.from(node.functions.values()).map(value => {
            str += value.definition + '\n';
          });

          return str;
        });
      },

      /**
       * 返回包含所有节点的列表集合
       * 依赖属性：所有
       */
      get allNodes() {
        return getAllNodes(self as ISchemaModel);
      }
    };
  })
  .views(self => {
    return {
      /**
       * 根据 id 返回后代节点（不一定是直系子节点），如果有过滤条件，则返回符合过滤条件的节点
       */
      findNode(id: string, filterArray?: string | string[]) {
        return findById(self as any, id, filterArray);
      },
      /**
       * 根据 id 定位到直系子节点的索引值；
       * 即，返回子节点中指定 id 对应的节点位置
       */
      indexOfChildren(id: string) {
        if (!id) {
          return -1;
        }
        let ids = (this.children || []).map((child: ISchemaModel) => child.id);
        return ids.indexOf(id);
      },

      /**
       * 只返回所有的节点的属性子集合，其实该方法和 util 中的 `allNodesWithFilter` 有异曲同工之处
       * 依赖：allNodes
       */
      allNodesWithFilter(filterArray?: string | string[]) {
        if (!filterArray) return self.allNodes;
        const filters = [].concat(filterArray || []);
        return self.allNodes.map((node: any) => pick(node, filters));
      }
    };
  })
  .actions(self => {
    return {
      /**
       * 更新 parentId 属性
       * 影响属性：parentId
       */
      setParentId(model: any) {
        invariant(model && model.id, `${model} 节点不能为空，且必须要有 id`);
        self.parentId = model.id;
      },
      /**
       * 更新 children 属性
       * 影响属性：当前节点的 children 属性、children 的 parentId 属性
       */
      setChildren(children: any) {
        // 设置子节点的时候需要绑定父节点
        // this.children = children || [];
        children.forEach((child: any) => {
          child.setParentId(self); // 绑定父节点
        });
        self.children = children || [];
      },

      /**
       * 更新 id 属性
       * 影响属性：id
       */
      setId(id: string) {
        invariant(!!id, '将要更改的 id 为空');
        self.id = id;
      },

      /**
       * 更新 screenId 属性
       * 影响属性：screenId
       */
      setScreenId(id: string) {
        invariant(!!id, '将要更改的 screen id 为空');
        self.screenId = id;
      },

      /**
       * 更新 name 属性
       * 影响属性：name
       */
      setName(name: string) {
        invariant(!!name, '将要更改的 name 为空');
        self.name = name;
      },

      /**
       * 更新 attrs 属性
       * 影响属性：attrs
       */
      setAttrs(attrOrObject: string | object) {
        let attrObject = attrOrObject;
        // 如果
        if (typeof attrOrObject === 'string') {
          attrObject = JSON.parse(attrOrObject);
        }

        self.attrs = stringifyAttribute(attrObject as ISchemaObject);
      },
      /**
       * 更新 functions 属性
       * 影响属性：functions
       */
      setFunction(name: string, body = '') {
        invariant(!!name, '设置 function 时缺少 name 属性');
        self.functions.set(
          name,
          Func.create({
            name,
            body
          })
        );
      }
    };
  })
  .actions(self => {
    return {
      /**
       * 新增直系节点
       * 影响属性：children
       */
      addChildren: (nodeOrNodeArray: ISchemaModel | ISchemaModel[]) => {
        const nodes = [].concat(nodeOrNodeArray);
        nodes.forEach(node => {
          node.setParentId(self);
          self.children.push(node);
        });
      },
      /**
       * 根据 id 删除直系节点，如果想要整个重置 children，请使用 `setChildren` 方法
       * 影响属性：children
       */
      removeChildren: (idOrIdArray: string | string[]) => {
        const ids = [].concat(idOrIdArray);
        debugModel(
          `[comp] 删除前 children 长度: ${
            self.children.length
          }, 待删除的 ids: ${ids.join('、')}`
        );

        const originIds = [].concat(self.childrenIds);

        const targetIndexes = ids.map(id => {
          return originIds.indexOf(id);
        });

        // 降序排列
        targetIndexes.sort(sortNumberDesc);

        // 逆序删除子元素
        targetIndexes.forEach(index => {
          if (index !== -1) {
            let nodeToBeRemoved = self.children[index];
            destroy(nodeToBeRemoved);
          }
        });

        debugModel(
          `[comp] 删除后 children 长度: ${
            self.children.length
          }，ids: ${self.children.map(o => o.id).join('、')}`
        );
      }
    };
  });

export interface ISchemaModel extends Instance<typeof Schema> {}
