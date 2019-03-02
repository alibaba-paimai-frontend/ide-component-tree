import { SchemaTreeNodeMouseEvent } from 'ide-tree';
import { IStoresEnv, hasEtteException } from 'ide-lib-base-component';
import { getValueByPath } from 'ide-lib-utils';

import { IStoresModel } from '../../schema/stores';
import { RPATH } from '../../router/helper'

const maybeDisableItem = ['createSub', 'createUp', 'createDown', 'delete'];

/**
 * 用于显示右键菜单
 * @param env - IStoresEnv
 */
export const showContextMenu = (env: IStoresEnv<IStoresModel>) => (options: SchemaTreeNodeMouseEvent) => {
    const { client } = env;
    const { node, event } = options;
    // 根据是否是根节点，对菜单进行不同的设置
    const isRoot = !node.parentId;

    // 自动选中该节点
    client.put(`${RPATH.schemaTree}/selection/${node.id}`);

    // 如果缓冲区内没有节点，则不能进行粘贴操作
    client.get(`${RPATH.schemaTree}/buffers/clone`).then((res: Response)=>{
        if (!hasEtteException(res, ['schemaTree', 'buffer', 'clone'])) {
            const bufferNode = getValueByPath(res, 'body.data.node');
            client.put(`${RPATH.contextMenu}/items/paste`, { name: 'disabled', value: !bufferNode });
        }
    });

    // 如果是根节点，需要 disabled 指定的元素
    maybeDisableItem.forEach((mid) => {
        client.put(`${RPATH.contextMenu}/items/${mid}`, { name: 'disabled', value: isRoot });
    });

    // 根据事件位置，自动展现右键菜单
    client.put('/menu/autoposition', {
        x: event.clientX,
        y: event.clientY
    }); // 根据点击事件更新位置
}