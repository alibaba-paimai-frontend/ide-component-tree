import { Response } from 'ette'
import { IStoresEnv } from 'ide-lib-base-component';
import { IComponentListItem } from 'ide-component-list';
import { getValueByPath } from 'ide-lib-utils';

import { IStoresModel } from '../../schema/stores';
import { getSchemaByName} from '../../schema/comps-gourd'


export const addChildNodeByItem = (env: IStoresEnv<IStoresModel>) => (item: IComponentListItem) => {
    const { stores, client } = env;
    // 根据是否是根节点，对菜单进行不同的设置

    console.log('当前选中的组件：', item);
    client.put('/model', { name: 'listVisible', value: false }); // 关闭 list

    // 根据组件名，获取 schema 对象
    const schema = getSchemaByName(item.name); // 根据组件名获取组件 schema
    console.log('生成的 schema 对象', schema);


    client.get('/clients/schemaTree/selection').then((res: Response) => {
        const id = getValueByPath(res, 'body.data.id', '');
        console.log('当前选中 id: ', id);
        if (!!id) {
            client.post(`/clients/schemaTree/nodes/${id}/children`, { schema }).then((res: Response) => {
                const newId = getValueByPath(res, 'body.data.node.id');

                // 如果插入的组件带有 children 属性，比如 'Row'、‘FormItem' 组件
                // 需要同时生成指定的额外 child
                (item.children || []).forEach((child: any) => {
                    client.post(`/clients/schemaTree/nodes/${newId}/children`, { schema: getSchemaByName(child.name) });
                });
            });
        }
    });
}