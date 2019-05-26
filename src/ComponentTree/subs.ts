import { ValueOf, getSubRouterPrefix } from 'ide-lib-base-component';
import { IComponentConfig } from 'ide-lib-engine';

import {
  ISchemaTreeProps,
  Stores as SchemaTreeStores,
  SchemaTree,
  SchemaTreeAddStore,
  DEFAULT_PROPS as DEFAULT_PROPS_SCHEMA_TREE,
  SchemaTreeFactory
} from 'ide-tree';

import {
  IContextMenuProps,
  ContextMenuStoresModel,
  ContextMenu,
  ContextMenuAddStore,
  DEFAULT_PROPS as DEFAULT_PROPS_CONTEXT_MENU,
  ContextMenuFactory
} from 'ide-context-menu';

import {
  ComponentList,
  ComponentListStoresModel,
  IComponentListProps,
  DEFAULT_PROPS as DEFAULT_PROPS_COMPONENT_LIST,
  ComponentListAddStore,
  ComponentListFactory
} from 'ide-component-list';

import {
  showContextMenu,
  showComponentList,
  actionByItem,
  hideMenuWhenListShow
} from './solution';
import {
  addChildNodeByItem,
} from './solution/comList'

// export const addChildNodeByItem2 = () => async () => {};
// console.log(1112, addChildNodeByItem, addChildNodeByItem2);

export interface ISubProps {
  schemaTree?: ISchemaTreeProps;
  contextMenu?: IContextMenuProps;
  comList?: IComponentListProps;
}

// component: 子组件属性列表
export const subComponents: Record<
  keyof ISubProps,
  IComponentConfig<ValueOf<ISubProps>, any>
> = {
  schemaTree: {
    className: 'SchemaTree',
    namedAs: 'schemaTree',
    defaultProps: DEFAULT_PROPS_SCHEMA_TREE,
    normal: SchemaTree,
    addStore: SchemaTreeAddStore,
    storesModel: SchemaTreeStores,
    factory: SchemaTreeFactory,
    solution: {
      onRightClickNode: [showContextMenu]
    },
    routeScope: ['tree', 'nodes', 'selection', 'buffers'] // 能通过父组件访问到的路径
  },
  contextMenu: {
    className: 'ContextMenu',
    namedAs: 'contextMenu',
    defaultProps: DEFAULT_PROPS_CONTEXT_MENU,
    normal: ContextMenu,
    addStore: ContextMenuAddStore,
    storesModel: ContextMenuStoresModel,
    factory: ContextMenuFactory,
    solution: {
      onClickItem: [showComponentList, actionByItem, hideMenuWhenListShow]
    },
    routeScope: ['menu', 'items'] // 能通过父组件访问到的路径
  },
  comList: {
    className: 'ComponentList',
    namedAs: 'comList',
    defaultProps: DEFAULT_PROPS_COMPONENT_LIST,
    normal: ComponentList,
    addStore: ComponentListAddStore,
    storesModel: ComponentListStoresModel,
    factory: ComponentListFactory,
    solution: {
      onSelectItem: [addChildNodeByItem]
    },
    routeScope: ['model'] // 能通过父组件访问到的路径
  }
};

// 获取子组件名映射表，即: {headerBar: "headerBar"}
export const ESubAppNames: { [key: string]: string } = {};
for (const name in subComponents) {
  if (subComponents.hasOwnProperty(name)) {
    ESubAppNames[name] = (subComponents as any)[name].namedAs;
  }
}
