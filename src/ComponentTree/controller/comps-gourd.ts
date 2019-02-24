import { IComponentListGroup } from 'ide-component-list';

import { invariant } from 'ide-lib-utils';
import {
  ISchemaProps,
  genCompIdByName,
  createSchemaModel
} from 'ide-tree';
// import { ISchemaModel } from 'ide-tree';


declare const GOURD_WIDGET: {
  list: IComponentListGroup;
  schema: any;
};

// 公共组件列表
invariant(
  !!GOURD_WIDGET.list,
  '不存在变量名为 GOURD_WIDGET 的公共组件列表'
);
interface IComponentInfo {
  name?: string;
  icon?: string;
  desc?: string;
  children?: IComponentInfo[];
  props?: object;
}

export const COMP_LIST = GOURD_WIDGET.list;
function genCompListMap(compList: any) {
  let list: IComponentInfo[] = [];
  let result: { [propName: string]: IComponentInfo } = {};
  for (var type in compList) {
    list = list.concat(COMP_LIST[type].list);
  }

  list.forEach(comp => {
    result[comp.name] = comp;
  });

  return result;
}
// 索性映射，方便后续快速通过名字检索到组件定义
export const COMP_LIST_MAP = genCompListMap(COMP_LIST);

/**
 * 根据组件名获取 schema 对象
 * 只根据一个名字初始化 model，比如传入 'Form' 就能生成一个标准的 Form 模型
 *
 * @export
 * @param {string} name - 组件名
 * @returns {ISchemaProps} - schema 对象
 */
// export function getSchemaByName(name: string): ISchemaProps {
//   invariant(!!name, 'schema 对象的 name 不能为空');
//   let schema: ISchemaProps = {
//     name: name,
//     id: genCompIdByName(name),
//     screenId: genCompIdByName(name)
//   };

//   // 如果有默认属性，新增上去
//   let compFromList = COMP_LIST_MAP[name];
//   if (compFromList && compFromList.props) {
//     schema.props = compFromList.props;
//   }
//   return schema;
// }