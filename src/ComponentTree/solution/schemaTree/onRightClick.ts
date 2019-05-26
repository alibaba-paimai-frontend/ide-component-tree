import { SchemaTreeNodeMouseEvent } from 'ide-tree';
import { IStoresEnv, hasEtteException } from 'ide-lib-base-component';
import { getValueByPath } from 'ide-lib-utils';

import { IStoresModel } from 'ide-lib-engine';
// import { RPATH } from '../../subs' // 不能引用 'subs.ts' ，将存在循环引用，导致 solution 失败

import { ROUTER_MAP } from '../../router/helper';

const maybeDisableItem = ['createSub', 'createUp', 'createDown', 'delete'];


/**
 * 用于显示右键菜单
 * @param env - IStoresEnv
 */
export const showContextMenu = (env: IStoresEnv<IStoresModel>) => async (
  options: SchemaTreeNodeMouseEvent
) => {
  const { stores, client } = env;
  const { node, event } = options;
  // 根据是否是根节点，对菜单进行不同的设置
  const isRoot = !node.parentId;

  // 自动选中该节点
  client.put(`${ROUTER_MAP.schemaTree}/selection/${node.id}`);

  // 如果缓冲区内没有节点，则不能进行粘贴操作
  client.get(`${ROUTER_MAP.schemaTree}/buffers/clone`).then((res: Response) => {
    if (!hasEtteException(res, ['schemaTree', 'buffer', 'clone'])) {
      const bufferNode = getValueByPath(res, 'body.data.node');
      client.put(`${ROUTER_MAP.contextMenu}/items/paste`, {
        name: 'disabled',
        value: !bufferNode
      });
    }
  });

  // 如果是根节点，需要 disabled 指定的元素
  maybeDisableItem.forEach(mid => {
    client.put(`${ROUTER_MAP.contextMenu}/items/${mid}`, {
      name: 'disabled',
      value: isRoot
    });
  });

  // 根据事件位置，显示菜单
  client.put(`${ROUTER_MAP.contextMenu}/menu`, {
    name: 'visible',
    value: true
  });

  //   显示 modal 层
  stores.model.setMenuModalVisible(true);

  //   console.log(event.clientX, event.clientY);
  // 根据事件位置，自动展现右键菜单
  client.put(`${ROUTER_MAP.contextMenu}/menu/position`, {
    x: event.clientX,
    y: event.clientY
  });
};
