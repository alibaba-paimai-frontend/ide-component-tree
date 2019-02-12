import React, { Component } from 'react';
import { observer } from 'mobx-react';

import {
  ISchemaTreeProps,
  SchemaTree,
  SchemaTreeAddStore,
  TSchemaTreeControlledKeys
} from 'ide-tree';
import {
  IContextMenuProps,
  ContextMenu,
  ContextMenuAddStore,
  TStoresControlledKeys as TStoresMenuControlledKeys
} from 'ide-context-menu';

import { debugRender } from '../lib/debug';
import { StoresFactory, IStoresModel } from './schema/stores';
import { AppFactory } from './controller/index';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type OptionalProps<T, K> = T | Omit<T, K>;
type OptionalSchemaTreeProps = OptionalProps<
  ISchemaTreeProps,
  TSchemaTreeControlledKeys
>;
type OptionalMenuProps = OptionalProps<
  IContextMenuProps,
  TStoresMenuControlledKeys
>;
export interface IComponentTreeProps {
  /**
   * schema tree 配置项
   */
  schemaTree: OptionalSchemaTreeProps;

  /**
   * context menu 配置项
   */
  contextMenu: OptionalMenuProps;
}

interface ISubComponents {
  SchemaTreeComponent: React.ComponentType<OptionalSchemaTreeProps>;
  ContextMenuComponent: React.ComponentType<OptionalMenuProps>;
}

/**
 * 使用高阶组件打造的组件生成器
 * @param subComponents - 子组件列表
 */
export const ComponentTreeHOC = (subComponents: ISubComponents) => {
  const ComponentTreeHOC = (props: IComponentTreeProps) => {
    const { SchemaTreeComponent, ContextMenuComponent } = subComponents;
    const { schemaTree, contextMenu } = props;

    return (
      <div>
        <SchemaTreeComponent {...schemaTree} />
        <ContextMenuComponent {...contextMenu} />
      </div>
    );
  }
  ComponentTreeHOC.displayName = 'ComponentTreeHOC';
  return observer(ComponentTreeHOC);
};

export const ComponentTree = ComponentTreeHOC({
  SchemaTreeComponent: SchemaTree,
  ContextMenuComponent: ContextMenu
});

/* ----------------------------------------------------
    以下是专门配合 store 时的组件版本
----------------------------------------------------- */

/**
 * 科里化创建 ComponentTreeWithStore 组件
 * @param stores - store 模型实例
 */
export const ComponentTreeAddStore = (stores: IStoresModel) => {
  const ComponentTreeHasSubStore = ComponentTreeHOC({
    SchemaTreeComponent: SchemaTreeAddStore(stores.schemaTree),
    ContextMenuComponent: ContextMenuAddStore(stores.contextMenu)
  });

  const ComponentTreeWithStore = (props: IComponentTreeProps) => {
    const { schemaTree, contextMenu } = props;
    debugRender(`[${stores.id}] rendering`);
    return (
      <ComponentTreeHasSubStore
        schemaTree={schemaTree}
        contextMenu={contextMenu}
      />
    );
  }
  ComponentTreeWithStore.displayName = 'ComponentTreeWithStore';
  return observer(ComponentTreeWithStore);
};
/**
 * 工厂函数，每调用一次就获取一副 MVC
 * 用于隔离不同的 ComponentTreeWithStore 的上下文
 */
export const ComponentTreeFactory = () => {
  const { stores, innerApps } = StoresFactory(); // 创建 model
  const app = AppFactory(stores, innerApps); // 创建 controller，并挂载 model
  return {
    stores,
    app,
    client: app.client,
    ComponentTreeWithStore: ComponentTreeAddStore(stores)
  };
};
