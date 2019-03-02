import { message } from 'antd';
import { getValueByPath } from 'ide-lib-utils';
import { IStoresEnv, hasEtteException } from 'ide-lib-base-component';

import { IStoresModel } from '../../schema/stores';
import { RPATH } from '../../router/helper'


const shouldViewList = ['createSub', 'createUp', 'createDown'];


/**
 * 显示 list 列表项
 * @param env - IStoresEnv
 */
export const showComponentList = (env: IStoresEnv<IStoresModel>) => async (key: string, keyPath: Array<string>, item: any)  => {
    const { stores, client } = env;

    // 根据是否是根节点，对菜单进行不同的设置
    if (!!~shouldViewList.indexOf(key)) {
        stores.model.setListVisible(true); // 让 list 可见
    }
}

/**
 * 根据点击的 item 项进行不同的操作
 * @param env - IStoresEnv
 */
export const actionByItem = (env: IStoresEnv<IStoresModel>) => async (key: string, keyPath: Array<string>, item: any)  => {
    const { client } = env;

    // 根据是否是根节点，对菜单进行不同的设置
    // 首先获取当前节点
    const resSelection = await client.get(`${RPATH.schemaTree}/selection`);
    const selectedNodeId = getValueByPath(resSelection, 'body.data.id');

    // 无法正常请求当前节点 id
    if (hasEtteException(resSelection, ['schemaTree', 'get', 'selection'])){
        return;
    }
    switch (key) {
        case 'copy':
            if (!!selectedNodeId) {
                const resClone = await client.post(`${RPATH.schemaTree}/nodes/${selectedNodeId}/clone`);
                const target = getValueByPath(resClone, 'body.data.target')
                if (!!target) {
                    message.info(`已拷贝节点 ${selectedNodeId}`);
                }
            } else {
                message.error('拷贝失败，无法获取选中节点 id')
            }
            break;

        case 'paste': 
            // 直接调用缓存区中的节点，进行粘贴
            const resPaste = await client.post(`${RPATH.schemaTree}/nodes/${selectedNodeId}/children`, { useBuffer: true });
            // console.log(111, resPaste);

            if(!hasEtteException(resPaste, ['schemaTree', 'paste', 'buffer'])){
                const resultNode = getValueByPath(resPaste, 'body.data.node');
                if (!!resultNode) {
                    // 粘贴成功后需要选中新的节点 id
                    client.put(`${RPATH.schemaTree}/selection/${resultNode.id}`);
                } else {
                    message.info(`粘贴失败: 请先 copy 节点才能进行粘贴操作`)
                }
            };
            break;

        case 'delete': 
            // 先获取父节点信息
            const resParentNode = await client.get(`${RPATH.schemaTree}/nodes/${selectedNodeId}/parent?filter=id`);
            const resDel = await client.del(`${RPATH.schemaTree}/nodes/${selectedNodeId}`);
            if (!hasEtteException(resDel, ['schemaTree', 'del'])) {
                const resultNode = getValueByPath(resDel, 'body.data.node');
                if (!!resultNode) {
                    // 删除成功之后，需要更新 selection 为其父节点
                    const parentId = getValueByPath(resParentNode, 'body.data.node.id');
                    client.put(`${RPATH.schemaTree}/selection/${parentId}`);
                } else {
                    message.info(`删除失败: 当前节点不存在`)
                }
            };
            break;

        default:
            break;
    }
}


/**
 * 隐藏 menu 菜单
 * @param env - IStoresEnv
 */
export const hideMenu = (env: IStoresEnv<IStoresModel>) => async (key: string, keyPath: Array<string>, item: any) => {
    const { client } = env;

    client.put('/clients/contextMenu/menu', { name: 'visible', value: false });
}


