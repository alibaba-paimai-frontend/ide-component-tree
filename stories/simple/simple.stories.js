import React from 'react';
import { storiesOf } from '@storybook/react';
import { wInfo } from '../../.storybook/utils';

import { createModel } from 'ide-lib-engine';

import { createSchemaModel } from 'ide-tree';

import { ContextMenuModel } from 'ide-context-menu';
import { ComponentTree } from '../../src/';

import mdMobx from './simple-mobx.md';
import mdPlain from './simple-plain.md';

/**
 * schema tree 部分
 *
 */
const base = id => {
  return {
    name: 'Row',
    id: id,
    props: {
      isZebra: true,
      dataSource: []
    }
  };
};
const schema2 = {
  ...base('Row_1'),
  children: [
    {
      name: 'Col',
      id: 'Col_1',
      children: [base('Row_2'), base('Row_3')]
    }
  ]
};
const schema = createSchemaModel(schema2);

const onExpand = function(keys) {
  console.log(888, keys);
};

/**
 * context menu 部分
 */

function onClickItem(key, keyPath, item) {
  console.log(`当前点击项的 id: ${key}`);
}

const menuModel = createModel(ContextMenuModel, {
  menu: {
    id: 'component-tree',
    name: '组件树右键菜单',
    children: [
      { id: 'newFile', name: '创建新页面', icon: 'file' },
      { id: 'copy', name: '复制', icon: 'copy', shortcut: '⌘+C' },
      {
        id: 'paste',
        name: '粘贴',
        icon: 'switcher',
        shortcut: '⌘+V',
        disabled: true
      },
      {
        id: 'divider',
        name: '分割线',
        icon: 'file',
        type: 'separator'
      },
      { id: 'preview', name: '预览', icon: 'eye' },
      { id: 'delete', name: '删除', icon: 'delete', shortcut: '⌘+Delete' }
    ]
  }
}).menu;

let plainMenu = menuModel.toJSON();

let plainSchema = schema.toJSON();

function clickBtn() {
  schema.setName('jscon222');
  plainSchema = schema.toJSON();

  menuModel.children[0].setName('hello2');
  plainMenu = menuModel.toJSON();
}

storiesOf('基础使用', module)
  .addParameters(wInfo(mdMobx))
  .addWithJSX('使用 mobx 对象', () => (
    <div>
      <ComponentTree
        schemaTree={{
          schema: schema,
          selectedId: 'Col_1',
          expandedIds: ['Row_1'],
          onExpand: onExpand
        }}
        contextMenu={{
          menu: menuModel,
          visible: true,
          width: 200,
          left: 100,
          top: 100,
          onClickItem: onClickItem
        }}
        comList={{
          visible: false
        }}
      />
      <button onClick={clickBtn}>点击更换 name （会响应）</button>
    </div>
  ))
  .addParameters(wInfo(mdPlain))
  .addWithJSX('普通 schema 对象', () => (
    <div>
      <ComponentTree
        schemaTree={{
          schema: plainSchema,
          selectedId: 'Col_1',
          expandedIds: ['Row_1'],
          onExpand: onExpand
        }}
        contextMenu={{
          menu: plainMenu,
          visible: true,
          width: 200,
          left: 100,
          top: 100,
          onClickItem: onClickItem
        }}
        comList={{
          visible: false
        }}
      />
      <button onClick={clickBtn}>点击更换 name （无效）</button>
    </div>
  ));
