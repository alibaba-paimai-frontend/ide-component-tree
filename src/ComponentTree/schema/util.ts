import { map} from 'ss-tree';
import { invariant } from 'ide-lib-utils';
import { createSchemaModel } from 'ide-tree';
import { updateInScope, BASE_CONTROLLED_KEYS } from 'ide-lib-base-component'
import { debugModel } from '../../lib/debug';
import { IComponentTreeProps, IComponentTreeModel, ComponentTreeModel, IStoresModel, DEFAULT_PROPS } from '../../index';


/**
 * 将葫芦系统的 schema 转换成新版的 schema
 * @param schema - 旧版 schema 
 */
export function jsonConverter(schema: any): any {
    return map(schema, function(node: any) {
        const newNode = Object.assign({}, node);
        newNode.name = node.name || node.component;
        newNode.screenId = node.screenId || node.id;
        return newNode;
    }, true);
}


/**
 * 将普通对象转换成 Model
 * @param modelObject - 普通的对象
 */
export function createModel(modelObject: IComponentTreeProps = DEFAULT_PROPS): IComponentTreeModel {
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
const EDITABLE_ATTRIBUTE = BASE_CONTROLLED_KEYS.concat([
    'listVisible'
]);

export const updateModelAttribute = updateInScope(EDITABLE_ATTRIBUTE);
