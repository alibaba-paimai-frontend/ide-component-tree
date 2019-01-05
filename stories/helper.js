import Chance from 'chance';
import { uuid } from '../src/lib/util';
const chance = new Chance();


// 来自： https://github.com/loopmode/treegen
function createTree(args, currentDepth, parentNode) {
  currentDepth = currentDepth === undefined ? 0 : currentDepth;
  const name = args.name();
  var node = {
      name: name,
      id: name,
      parentId: parentNode && parentNode.id,
    props: args.props(),
    children: []
  };

  if (currentDepth < args.depth) {
    for (var i = 0; i < args.spread; i++) {
      node.children.push(createTree(args, currentDepth + 1, node));
    }
  }
  return node;
}

export function treegen(args) {
  args.depth = args.depth === undefined ? chance.integer({min: 1, max: 3}) : args.depth;
    args.spread = args.spread === undefined ? chance.integer({ min: 1, max: 3 }) : args.spread;
  args.name =
    args.name ||
    function() {
      return uuid();
    };

  args.props =
    args.props ||
    function() {
      return {
          data_text: chance.word(),
          span: chance.integer({ min: 1, max: 10 })
      };
    };
  return createTree(args);
}



const itemsArray = [
  { id: 'newFile', name: '创建新页面', icon: 'file' },
  { id: 'copy', name: '复制', icon: 'copy', shortcut: '⌘+C' },
  { id: 'paste', name: '粘贴', icon: 'switcher', shortcut: '⌘+V' },
  { id: 'preview', name: '预览', icon: 'eye' },
  { id: 'delete', name: '删除', icon: 'delete', shortcut: '⌘+Delete' },
  {
    id: 'service',
    name: '服务设置',
    icon: 'database',

    disabled: true
  },
  { id: 'rename', name: '重命名', icon: 'file-unknown' },
  { id: 'authority', name: '修改权限', icon: 'safety' },
  { id: 'createSub', name: '添加组件', icon: 'plus', shortcut: '⌘+Alt+G' },
  { id: 'createTmpl', name: '添加模板', icon: 'plus' },
  { id: 'createUp', name: '前面插入组件', icon: 'arrow-up' },
  { id: 'createDown', name: '后面插入组件', icon: 'arrow-down' },
  { id: 'divider', name: '分割线', icon: 'file', type: 'separator' }
];
/**
 * 生成随机的菜单项，用于测试
 */
export function menuGen() {
  return {
    id: 'rightMenu',
    name: 'demo',
    children: chance.pickset(itemsArray, chance.integer({ min: 3, max: itemsArray.length - 1 }))
  };
}

export function menuNormalGen() {
  return {
    id: 'component-tree',
    name: '组件树右键菜单',
    children: [
      { id: 'newFile', name: '创建新页面', icon: 'file' },
      { id: 'copy', name: '复制', icon: 'copy', shortcut: '⌘+C' },
      { id: 'paste', name: '粘贴', icon: 'switcher', shortcut: '⌘+V' },
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
}
