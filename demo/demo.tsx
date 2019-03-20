import * as React from 'react';
import { render } from 'react-dom';
import { createSchemaModel, ISchemaProps } from 'ide-tree';
import { IMenuObject } from 'ide-context-menu';
import { getValueByPath } from 'ide-lib-utils';
import { Collapse } from 'antd';
const Panel = Collapse.Panel;

import {
  ComponentTree,
  schemaConverter,
  ESchemaOrigin,
  ComponentTreeFactory,
  getSchemaByName
} from '../src/index';

import schemajson from './schema.json';

const convertedJSON = schemaConverter(schemajson, ESchemaOrigin.GOURD_V1);

const schema = createSchemaModel(convertedJSON);

const onExpand = function(keys) {
  console.log(888, keys);
};

const onSelectNode = node => {
  console.log('当前选中的 node:', node.id, node.name);
};

/**
 * context menu 部分
 */
const menu: IMenuObject = {
  id: 'component-tree',
  name: '组件树右键菜单',
  children: [
    { id: 'createSub', name: '添加组件', icon: 'plus', shortcut: '⌘+Alt+G' },
    // { id: 'createTmpl', name: '添加模板', icon: 'plus', shortcut: '' },
    { id: 'createUp', name: '前面插入组件', icon: 'arrow-up', shortcut: '' },
    {
      id: 'createDown',
      name: '后面插入组件',
      icon: 'arrow-down',
      shortcut: ''
    },
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
  console.log(`[11]当前点击项的 id: ${key}`);
}

// ========== with store ==============

const { ComponentTreeWithStore, client } = ComponentTreeFactory();

const eventsInStore = {
  onRightClick: ({ node, event }) => {
    console.log('onRightClick...');
  },
  onClickMenuItem: (key, keyPath, item) => {
    console.log('onClickMenuItem...');
  },
  onSelectListItem: item => {
    console.log('onSelectListItem...');
  },
  onClickListOutside: () => {
    // 点击到外部则隐藏
    console.log('click outside list');
    // client.put('/model', { name: 'listVisible', value: false }); // 关闭 list
    // client.put('/model/theme/main', { value: '#ccc' });
  }
};

// 当 store 有变更的时候，调用该方法
// 作用：增删改 shema 的时候，通知外界什么出现了变更
// 机理：监听 mst 的变更
const onModelChange = function(key: string, value: any) {
  console.log('model changed', key, value);
};

render(
  <Collapse defaultActiveKey={['1']}>
    <Panel header="普通组件" key="0">
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
      />
      ,
    </Panel>
    <Panel header="包含 store 功能" key="1">
      <ComponentTreeWithStore
        schemaTree={{
          onSelectNode: onSelectNode,
          onRightClickNode: eventsInStore.onRightClick,
          onModelChange: function(key: string, value: any) {
            console.log(
              'schema tree model changed:',
              key,
              value.toJSON ? value.toJSON() : value
            );
          },
          onExpand
        }}
        contextMenu={{
          onClickItem: eventsInStore.onClickMenuItem
        }}
        onModelChange={onModelChange}
        onSelectListItem={eventsInStore.onSelectListItem}
        onClickListOutside={eventsInStore.onClickListOutside}
      />
    </Panel>
  </Collapse>,
  document.getElementById('example') as HTMLElement
);

// 创建组件树和右键菜单
client.post('/clients/schemaTree/tree', { schema: schema }); // 注意这里的 schema 需要用 createSchemaModel 转换一层，否则因为缺少 parentId ，导致无法创建成功
client.post('/clients/contextMenu/menu', { menu: menu }).then(res => {
  console.log(444, res);
});
