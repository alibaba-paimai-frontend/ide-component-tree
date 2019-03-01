import { SchemaTreeNodeMouseEvent } from 'ide-tree';
import { IStoresEnv } from 'ide-lib-base-component';
import { IStoresModel } from '../../schema/stores';

const shouldViewList = ['createSub', 'createUp', 'createDown'];

export const showComponentList = (env: IStoresEnv<IStoresModel>) => (key: string, keyPath: Array<string>, item: any)  => {
    const { stores, client } = env;

    // 根据是否是根节点，对菜单进行不同的设置
    if (!!~shouldViewList.indexOf(key)) {
        stores.model.setListVisible(true); // 让 list 可见
    }

    // 同时让 menu 隐藏 
    client.put('/clients/contextMenu/menu', { name: 'visible', value: false });
}