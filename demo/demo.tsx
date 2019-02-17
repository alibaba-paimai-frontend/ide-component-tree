import * as React from 'react';
import { render } from 'react-dom';
import { createSchemaModel, ISchemaProps } from 'ide-tree';
import { IMenuObject } from 'ide-context-menu';

import { ComponentTree, jsonConverter, ComponentTreeFactory } from '../src/index';

import schemajson from './schema.json';

const convertedJSON = jsonConverter(schemajson) as ISchemaProps;

const schema = createSchemaModel(convertedJSON);

const onExpand = function(keys) {
  console.log(888, keys);
};

const onSelectNode = (node) => {
  console.log('当前选中的 node:', node.id, node.name);
}

/**
 * context menu 部分
 */
const menu: IMenuObject = {
  id: 'component-tree',
  name: '组件树右键菜单',
  children: [
    { id: 'createSub', name: '添加组件', icon: 'plus', shortcut: '⌘+Alt+G' },
    { id: 'createTmpl', name: '添加模板', icon: 'plus', shortcut: '' },
    { id: 'createUp', name: '前面插入组件', icon: 'arrow-up', shortcut: '' },
    { id: 'createDown', name: '后面插入组件', icon: 'arrow-down', shortcut: '' },
    {
      id: 'divider',
      name: '分割线',
      icon: 'file',
      type: 'separator'
    },
    { id: 'copy', name: '复制', icon: 'copy', shortcut: '⌘+C' },
    { id: 'paste', name: '粘贴', icon: 'switcher', shortcut: '⌘+V' },
    {
      id: 'divider',
      name: '分割线',
      icon: 'file',
      type: 'separator'
    },
    { id: 'delete', name: '删除', icon: 'delete', shortcut: '⌘+Delete' }
  ]
};

function onClickItem(key: string, keyPath: Array<string>, item: any) {
  console.log(`当前点击项的 id: ${key}`);
}

render(
  <ComponentTree
    schemaTree={{
      schema: schema,
      selectedId: 'Col_1',
      expandedIds: ['Row_1'],
      onExpand: onExpand,
      onSelectNode
    }}
    contextMenu={{
      menu: menu,
      visible: false,
      width: 200,
      left: 100,
      top: 10,
      onClickItem: onClickItem
    }}
  />,
  document.getElementById('example') as HTMLElement
);

// ========== with store ==============


const {
  ComponentTreeWithStore, client
} = ComponentTreeFactory();


const eventsInStore = {
  onRightClick: ({ node, event }) => {
    
 
    // 根据是否是根节点，对菜单进行不同的设置
    const isRoot = !node.parentId;
    const menuIds = ['createUp', 'createDown', 'delete'];

    console.log(
      '点击节点 id：',
      node.id,
      `（isRoot: ${isRoot}）点击坐标 （${event.clientX}, ${event.clientY}）`
    );
    
    // 如果是根节点，需要 disabled 指定的元素
    menuIds.forEach((mid)=>{
      client.put(`/clients/contextMenu/items/${mid}`, { name: 'disabled', value: isRoot });
    });

    // 根据事件位置，自动展现右键菜单
    client.put('/menu/autoposition', {
      x: event.clientX,
      y: event.clientY
    }); // 根据点击事件更新位置

    
  },
  onClickMenuItem: (key, keyPath, item) => {
    console.log(`当前点击项的 id: ${key}`);
    // 关闭菜单
    client.put('/clients/contextMenu/menu', { name: 'visible', value: false });
  }
}


render(
  <ComponentTreeWithStore
    schemaTree={{
      onSelectNode: onSelectNode,
      onRightClickNode: eventsInStore.onRightClick,
      onExpand
    }}
    contextMenu={{
      onClickItem: eventsInStore.onClickMenuItem
    }}
  />,
  document.getElementById('example-store') as HTMLElement
);

// 创建组件树和右键菜单
client.post('/clients/schemaTree/tree', { schema: schema }); // 注意这里的 schema 需要用 createSchemaModel 转换一层，否则因为缺少 parentId ，导致无法创建成功
client.post('/clients/contextMenu/menu', { menu: menu });