import { SchemaTreeNodeMouseEvent } from 'ide-tree';
import { IStoresEnv } from 'ide-lib-base-component';
import { IStoresModel } from '../../schema/stores';

const maybeDisableItem = ['createSub', 'createUp', 'createDown'];

export const showContextMenu = (env: IStoresEnv<IStoresModel>) => (options: SchemaTreeNodeMouseEvent) => {
    const { client } = env;
    const { node, event } = options;
    // 根据是否是根节点，对菜单进行不同的设置
    const isRoot = !node.parentId;

    console.log(
        '点击节点 id：',
        node.id,
        `（isRoot: ${isRoot}）点击坐标 （${event.clientX}, ${event.clientY}）`
    );

    // 自动选中该节点
    client.put(`/clients/schemaTree/selection/${node.id}`);

    // 如果是根节点，需要 disabled 指定的元素
    maybeDisableItem.forEach((mid) => {
        client.put(`/clients/contextMenu/items/${mid}`, { name: 'disabled', value: isRoot });
    });

    // 根据事件位置，自动展现右键菜单
    client.put('/menu/autoposition', {
        x: event.clientX,
        y: event.clientY
    }); // 根据点击事件更新位置
}