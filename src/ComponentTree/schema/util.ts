import { map } from 'ss-tree';
import { invariant } from 'ide-lib-utils';
import { createSchemaModel } from 'ide-tree';
import { updateInScope, BASE_CONTROLLED_KEYS } from 'ide-lib-base-component';
import { debugModel } from '../../lib/debug';
import {
  IComponentTreeProps,
  IComponentTreeModel,
  ComponentTreeModel,
  IStoresModel,
  DEFAULT_PROPS
} from '../../index';

/**
 * 将葫芦系统的 schema 转换成新版的 schema
 * @param schema - 旧版 schema
 */
export function jsonConverter(schema: any): any {
  return map(
    schema,
    function(node: any) {
      const newNode = Object.assign({}, node);
      newNode.name = node.name || node.component;
      newNode.screenId = node.screenId || node.id;
      return newNode;
    },
    true
  );
}

// 默认节点转换函数
export const DEFAULT_CONVERTER = function(node: any) {
  const newNode = Object.assign({}, node);
  newNode.name = node.name || (node.component && node.component.name);
  newNode.screenId = node.screenId || node.id;
  return newNode;
};

/**
 * 将葫芦系统的 schema 转换成新版的 schema
 * @param schema - schema 对象
 */
export enum ESchemaOrigin {
  // 第1代葫芦系统
  GOURD_V1 = 'GOURD_V1',

  // 第2代葫芦系统
  GOURD_V2 = 'GOURD_V2'
}

// 新版 schema 转换
export function schemaConverter(
  schema: any,
  origin: ESchemaOrigin = ESchemaOrigin.GOURD_V2,
  converter = DEFAULT_CONVERTER
): any {
  let newSchema = {};
  switch (origin) {
    // v1 葫芦系统直接可转换
    case ESchemaOrigin.GOURD_V1:
      newSchema = schema;
      break;

    // v2 葫芦 schema 需要自己添加 root 元素
    case ESchemaOrigin.GOURD_V2:
      newSchema = {
        name: 'div',
        screenId: '$root',
        id: '$root_div',
        children: schema
      };
      break;

    default:
      invariant(false, '[schemaConverter] 无法转换 schema 对象，请联系管理员');
      break;
  }
  return map(
    newSchema,
    converter,
    true
  );
}

/**
 * 将普通对象转换成 Model
 * @param modelObject - 普通的对象
 */
export function createModel(
  modelObject: IComponentTreeProps = DEFAULT_PROPS
): IComponentTreeModel {
  const mergedProps = Object.assign({}, DEFAULT_PROPS, modelObject);
  const { listVisible, theme, styles } = mergedProps;

  const model = ComponentTreeModel.create({
    listVisible
  });
  model.setStyles(styles || {});
  model.setTheme(theme);

  return model;
}

/**
 * 创建新的空白
 */
export function createEmptyModel() {
  return createModel({});
}

/* ----------------------------------------------------
    更新指定 enum 中的属性
----------------------------------------------------- */
// 定义 menu 可更新信息的属性
const EDITABLE_ATTRIBUTE = BASE_CONTROLLED_KEYS.concat(['listVisible']);

export const updateModelAttribute = updateInScope(EDITABLE_ATTRIBUTE);
