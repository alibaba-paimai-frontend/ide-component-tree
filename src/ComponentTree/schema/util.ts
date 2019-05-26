import { map } from 'ss-tree';
import { invariant } from 'ide-lib-utils';

/**
 * 将葫芦系统的 schema 转换成新版的 schema
 * @param schema - 旧版 schema
 */
export function jsonConverter(schema: any): any {
    return map(
        schema,
        function (node: any) {
            const newNode = Object.assign({}, node);
            newNode.name = node.name || node.component;
            newNode.screenId = node.screenId || node.id;
            return newNode;
        },
        true
    );
}

// 默认节点转换函数
export const DEFAULT_CONVERTER = function (node: any) {
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
                children: [].concat(schema)
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
