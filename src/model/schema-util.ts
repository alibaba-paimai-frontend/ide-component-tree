import { Schema, TSchemaModel } from './schema';
import { invariant, uuid } from '../lib/util';
import { map, traverse, NodeLikeObject, TRAVERSE_TYPE } from 'ss-tree';

// 空 schema 模板
export const EMPTY_COMP_ID = '-1';
export const EMPTY_COMP: ISchemaObject = {
  name: '[init comp]',
  id: EMPTY_COMP_ID,
  parent: null
};

// 根节点标志
export const FLAG_ROOT = '@root';

// 列举 schema 中特殊的字段名
export enum SPECIAL_ATTRIBUTE_NAME {
  FUNCTIONS = 'functions', // 属性编辑器中辨识函数的字段
  IDS = 'ids' // 该值是辅助编辑器判断 id 是否重复
}

declare const GOURD_WIDGET: {
  list: any;
};

// 公共组件列表
invariant(
  GOURD_WIDGET && GOURD_WIDGET.list,
  '不存在变量名为 GOURD_WIDGET 的公共组件列表'
);

// === start ===
// TODO: 将 comp_list 抽离到单独的组件中，通过外部传递进来

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
 * @returns {ISchemaObject} - schema 对象
 */
export function getSchemaByName(name: string): ISchemaObject {
  invariant(!!name, 'schema 对象的 name 不能为空');
  let schema: ISchemaObject = {
    name: name,
    id: genCompIdByName(name),
    parent: null
  };

  // 如果有默认属性，新增上去
  let compFromList = COMP_LIST_MAP[name];
  if (compFromList && compFromList.props) {
    schema.props = compFromList.props;
  }
  return schema;
}

// === end ===

/**
 * 根据组件名生成 id
 *
 * @export
 * @param {string} [name='unknow'] - 组件名，如果不指定则为 'unknown'
 * @param {boolean} [isMasterApp=false] - 是否是母版环境，如果是的话，添加 'master_' 前缀
 * @returns
 */
export function genCompIdByName(
  name: string = 'unknown',
  isMasterApp: boolean = false
) {
  let uid = uuid();
  let prefix = isMasterApp ? 'master_' : '';
  return `\$${prefix}${name}_${uid}`;
}

// 忽略 children 的值，该属性做特殊处理
// 忽略 functions 的值，该值由专门的 Func 模型处理
// 忽略 ids 的值，该值是辅助编辑器判断 id 是否重复
function replacer(key: string, value: any) {
  if (
    [
      'children',
      SPECIAL_ATTRIBUTE_NAME.FUNCTIONS,
      SPECIAL_ATTRIBUTE_NAME.IDS
    ].indexOf(key) > -1
  ) {
    return undefined;
  }

  return value;
}

export interface ISchemaObject extends NodeLikeObject {
  id: string; // id
  name: string; // 组件名，比如 'Row'、'Col',
  parent: ISchemaObject | null; // 父节点对象
  props?: object; // 组件初始化的 props 对象
  children?: ISchemaObject[]; // 子节点对象
  functions?: string; // 函数字符串
  ids?: string[]; // 当前 schema 中的 ids 集合/子集合
}

/**
 * 将普通的 schema 对象转换成字符串形式
 * 转换过程中，将使用 replacer 函数将 schema 中的特殊属性 “剔除掉”
 * @export
 * @param {ISchemaObject} schema
 * @returns
 */
export function stringifyAttribute(schema: ISchemaObject) {
  return JSON.stringify(schema, replacer);
}

function isSchemaObject(object: any): object is ISchemaObject {
  return 'id' in object && 'name' in object;
}
//
/**
 * 将普通对象转换成 schema Model
 * 具体操作是：利用树遍历算法生成组件模型
 *
 * @export
 * @param {ISchemaObject} schema
 * @returns {TSchemaModel}
 */
export function createSchemaModel(schema: ISchemaObject): TSchemaModel {
  invariant(!!schema, 'schema 对象不能为空');
  invariant(isSchemaObject(schema), 'schema 对象不符合规范');
  // return comp;
  return map(
    schema,
    (node: any) => {
      // 设置属性
      const newSchema = Schema.create({
        id: node.id || genCompIdByName(node.name),
        name: node.name, // 组件名
        attrs: stringifyAttribute(node),
        parent: null,
        fns: {},
        children: []
      });
      return newSchema;
    },
    true,
    (parent: any, children: any[]) => {
      parent.setChildren(children); // 调用 comp.setChildren 方法
    }
  ) as TSchemaModel;
}

/**
 * 创建一个空白的 schema
 *
 * @export
 * @returns
 */
export function createEmptyModel() {
  return createSchemaModel(EMPTY_COMP);
}

/**
 * 根据名字创建对应的模型
 * 比如传入 'Form' 就能生成一个标准的 Form 模型
 *
 * @export
 * @param {string} name
 * @returns {TSchemaModel}
 */
export function createModelByName(name: string): TSchemaModel {
  const schema = getSchemaByName(name);
  return createSchemaModel(schema);
}

/**
 * 从当前的 schema 中提取出所有的 ids
 *
 * @export
 * @param {TSchemaModel | ISchemaObject} schema - 要提取 ids 的 schema/model 引用值
 * @returns {string[]}
 */
export function getAllIds(model: TSchemaModel | ISchemaObject): string[] {
  return traverse(
    model as ISchemaObject,
    (node: any, lastResult: string[] = []) => {
      lastResult.push(node.id);
    }
  );
}

/**
 * 根据节点 id 找到到子 Model 实例
 *
 * @export
 * @param {(TSchemaModel | ISchemaObject)} model - 根节点
 * @param {string} id - 想要查找的节点 id
 * @returns {(TSchemaModel | null)}
 */
export function findById(
  model: TSchemaModel | ISchemaObject,
  id: string
): TSchemaModel | ISchemaObject | null {
  if (!id) return null;

  let modelNode = null;

  traverse(
    model as ISchemaObject,
    (node: any) => {
      if (node.id === id) {
        modelNode = node;
        return true;
      }
      return false;
    },
    TRAVERSE_TYPE.BFS,
    true
  );

  return modelNode;
}
