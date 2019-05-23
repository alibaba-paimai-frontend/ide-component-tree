import { IComponentListGroup } from 'ide-component-list';

import { invariant } from 'ide-lib-utils';
import { debugMini } from '../../lib/debug';

declare const GOURD_WIDGET: {
  list: IComponentListGroup;
  schema: any;
};

// 公共组件列表
invariant(!!GOURD_WIDGET.list, '不存在变量名为 GOURD_WIDGET 的公共组件列表');
interface IComponentInfo {
  name?: string;
  icon?: string;
  desc?: string;
  children?: IComponentInfo[];
  props?: object;
  defaults?: object;
}

export const COMP_LIST = GOURD_WIDGET.list;
export const SCHEMA_LIST = GOURD_WIDGET.schema;

/**
 * 根据 list 对象生成组件字典，方便通过组件名快速检索组件信息；
 * 比如根据 'Row' 快速获取该组件的信息
 * @param compList - 组件列表
 */
function genCompListMap(compList: any) {
  let list: IComponentInfo[] = [];
  let result: { [propName: string]: IComponentInfo } = {};
  for (var type in compList) {
    list = list.concat(COMP_LIST[type].list); // 将各个类别下的组件扁平化
  }

  list.forEach(comp => {
    const compName = comp.name;
    result[compName] = comp;

    // 新增默认值集合
    result[compName].defaults = {};

    // 如果还有子节点，需要进一步替换
    if (result[compName].children && result[compName].children.length) {
      result[compName].children = result[compName].children.map((o: any) => {
        o.name = o.component;
        return o;
      });
    }

    // 因为比较耗时，所以异步操作
    setTimeout(() => {
      // 同时通过 schema 列表中获取默认值
      if (SCHEMA_LIST[compName]) {
        const schema = SCHEMA_LIST[compName];
        if (schema.properties) {
          // 遍历 base、dataSource、event 等类型属性
          for (let typeName in schema.properties) {
            const type = schema.properties[typeName];
            if (type.properties) {
              for (let attrName in type.properties) {
                const attr = type.properties[attrName];
                if (attr.default) {
                  (result[compName].defaults as any)[attrName] = attr.default;
                }
              }
            }
          }
        }
      }
    }, 0);
  });

  return result;
}
// 索性映射，方便后续快速通过名字检索到组件定义
export const COMP_LIST_MAP = genCompListMap(COMP_LIST);
console.log('888', COMP_LIST_MAP);

/**
 * 根据组件名获取组件的 schema，
 * 比如传入 'Form' 就能生成一个标准的 Form 的 schema
 *
 * @export
 * @param {string} name - 组件名
 */
export function getSchemaByName(name: string) {
  invariant(!!name, '[getSchemaByName] 目标 schema 的 name 不能为空');

  const schema: Record<string, any> = {
    name: name
  };
  // 拷贝 props 属性
  // 如果有默认属性，需要整合进去
  const compFromList = COMP_LIST_MAP[name];
  if (compFromList) {
    if (compFromList.props || compFromList.defaults) {
      schema.props = Object.assign(
        {},
        compFromList.props,
        compFromList.defaults
      );
    }
  }
  debugMini(`[getSchemaByName] 根据 name 生成的 schema 对象: %o`, schema);
  return schema;
}
