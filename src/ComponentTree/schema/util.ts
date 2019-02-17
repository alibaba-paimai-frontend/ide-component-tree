import { map, NodeOrLikedOrNull} from 'ss-tree';

/**
 * 将葫芦系统的 schema 转换成新版的 schema
 * @param schema - 旧版 schema 
 */
export function jsonConverter(schema: any) {
    return map(schema, function(node: any) {
        const newNode = Object.assign({}, node);
        newNode.name = node.name || node.component;
        newNode.screenId = node.screenId || node.id;
        return newNode;
    }, true);
}
