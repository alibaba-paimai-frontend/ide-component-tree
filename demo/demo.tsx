import * as React from 'react';
import { render } from 'react-dom';
import { Collapse } from 'antd';
const Panel = Collapse.Panel;

import { createSchemaModel } from 'ide-tree';
import { IMenuObject } from 'ide-context-menu';

import {
  ComponentTree,
  ComponentTreeFactory,
  IComponentTreeProps,
  ESchemaOrigin,
  schemaConverter,
  schemaConvertToNew
} from '../src/';
const {
  ComponentWithStore: ComponentTreeWithStore,
  client
} = ComponentTreeFactory();

import schemajson from './schema';
import COMP_LIST from './list.json';
import newCompList from './comp-list';
import gourd2BlockList, { blockSchema } from './gourd2-complist';
// import console = require('console');

/**
 * schema tree 部分
 */

// 新版 json 转换
const convertedJSON = schemaConverter(schemajson, ESchemaOrigin.GOURD_V2);
const schema = createSchemaModel(convertedJSON);

const onExpand = function(keys) {
  console.log(888, keys);
};

const onSelectNode = node => {
  console.log('当前选中的 node:', node.id, node.name);
};

const onRightClickNode = ({ node, event }) => {
  console.log('onRightClickNode...');
};

/**
 * context menu 部分
 */
const menu: IMenuObject = {
  id: 'component-tree',
  name: '组件树右键菜单',
  children: [
    { id: 'createSub', name: '添加组件', icon: 'plus', shortcut: '⌘+Alt+G' },
    {
      id: 'createBlock',
      name: '添加区块',
      icon: 'appstore-o',
      shortcut: '⌘+Alt+B'
    },
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

  const targetList = key === 'createBlock' ? gourd2BlockList : newCompList;
  // 如果点击是 “创建区块”，则更改 list 源
  client.put('/comList/model', { name: 'list', value: targetList });
}

/**
 * component list 部分
 */

const onSelectListItem = item => {
  console.log('onSelectListItem...', item);

  // 在某个节点下新增
  client.get('/contextMenu/selection').then(res => {
    const keyName = res.body.data.selection;
    if (keyName === 'createBlock') {
      // 获取当前选择的 selectId，并转换成 schema 对象
      const convertedSchema = schemaConvertToNew(blockSchema);
      // const model = createSchemaModel(convertedSchema);

      // 获取被选中的 id
      client.get('/schemaTree/selection').then(res => {
        const id = res.body.data.id;
        client.post(`/schemaTree/nodes/${id}/children`, {
          schema: convertedSchema
        });
      });

      // console.log(444, model);
    }
  });
};

const onOutsideListPanel = (e: MouseEvent, isOutSide: boolean) => {
  console.log('detect click list panel:', isOutSide, e);
};

// =============

// 当 store 有变更的时候，调用该方法
// 作用：增删改 shema 的时候，通知外界什么出现了变更
// 机理：监听 mst 的变更
const onComponentTreeChange = function(key: string, value: any) {
  console.log('component model changed', key, value);
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
        comList={{
          visible: true,
          list: COMP_LIST
        }}
      />
    </Panel>
    <Panel header="包含 store 功能" key="1">
      <div style={{ width: 400 }}>
        <ComponentTreeWithStore
          schemaTree={{
            onSelectNode: onSelectNode,
            onRightClickNode: onRightClickNode,
            onModelChange: function(key: string, value: any) {
              if (key === 'schema') {
                const result = value.schemaJSON ? value.schemaJSON : value;
                console.log('schema changed', key, result);
              }
            },
            onExpand
          }}
          contextMenu={{
            onClickItem: onClickItem
          }}
          comList={{
            onSelectItem: onSelectListItem
          }}
          onModelChange={onComponentTreeChange}
          onOutsideListPanel={onOutsideListPanel}
        />
      </div>
    </Panel>
  </Collapse>,
  document.getElementById('example') as HTMLElement
);

// 创建组件树和右键菜单
client.post('/schemaTree/tree', { schema: schema }); // 注意这里的 schema 需要用 createSchemaModel 转换一层，否则因为缺少 parentId ，导致无法创建成功
client.post('/contextMenu/menu', { menu: menu });
client.put('/comList/model', { name: 'visible', value: true });
client.put('/comList/model', { name: 'list', value: gourd2BlockList });

// client.get('/schemaTree/nodes/$root_div').then(res => {
//   console.log(111, res, res.body.node.children[0].toJSON());
// });
