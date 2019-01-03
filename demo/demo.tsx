import * as React from 'react';
import { render } from 'react-dom';
import { createSchemaModel } from 'ide-tree';
import { IMenuObject } from 'ide-context-menu';

import { ComponentTree } from '../src/index';

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
const menu: IMenuObject = {
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
      onExpand: onExpand
    }}
    contextMenu={{
      menu: menu,
      visible: true,
      width: 200,
      left: 100,
      top: 100,
      onClickItem: onClickItem
    }}
  />,
  document.getElementById('example') as HTMLElement
);
