import { Response } from 'ette'
import { IStoresEnv } from 'ide-lib-base-component';
import { IComponentListItem } from 'ide-component-list';
import { getValueByPath } from 'ide-lib-utils';

import {
    IStoresModel as ISchemaTreeStoresModel,
} from 'ide-tree';

import {
    IStoresModel as IContextMenuStoresModel,
} from 'ide-context-menu';

import { IStoresModel, ESubApps } from '../../schema/stores';
import { getSchemaByName} from '../../schema/comps-gourd'

import { RPATH } from '../../router/helper'
import { message } from 'antd';


/**
 * 根据在 list 中所选的 Item 创建新的子节点
 * @param env - 粘贴功能
 */
export const addChildNodeByItem = (env: IStoresEnv<IStoresModel>) => (item: IComponentListItem) => {
    const { stores, client } = env;
    // 根据是否是根节点，对菜单进行不同的设置

    const schemaTreeStore = stores[ESubApps.schemaTree] as ISchemaTreeStoresModel;
    const contextMenuStore = stores[ESubApps.contextMenu] as IContextMenuStoresModel;

    const clickedMenuKey = contextMenuStore.selectedKey; // 获取被点击的右键菜单 key 值

    console.log('当前选中的组件：', item, clickedMenuKey);
    client.put('/model', { name: 'listVisible', value: false }); // 关闭 list

    // 根据组件名，获取 schema 对象
    const schema = getSchemaByName(item.name); // 根据组件名获取组件 schema
    // console.log('生成的 schema 对象', schema);

    const selectedNodeId = schemaTreeStore.model.selectedId;

    // 根据所选菜单项，进行不同位置的插入
    const insertType = clickedMenuKey === 'createSub' ? 'children' : 'sibling';
    const reqApi = `${RPATH.schemaTree}/nodes/${selectedNodeId}/${insertType}`;
    const reqData = insertType === 'children' ? { schema } : { schema, offset: clickedMenuKey === 'createUp' ? '0' : '1'};

    if (!!selectedNodeId) {
        client.post(reqApi, reqData).then((res: Response) => {
            const newId = getValueByPath(res, 'body.data.node.id');
            // 如果插入的组件带有 children 属性，比如 'Row'、‘FormItem' 组件
            // 需要同时生成指定的额外 child
            (item.children || []).forEach((child: any) => {
                client.post(`${RPATH.schemaTree}/nodes/${newId}/children`, { schema: getSchemaByName(child.name) });
            });
        });
    } else {
        message.info('因没有选中任何节点，添加失败')
    }


}