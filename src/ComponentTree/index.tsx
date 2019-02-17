import React, { Component } from 'react';
import { observer } from 'mobx-react-lite';
import { ThemeProvider } from 'styled-components';

import { StyledContainer } from './styles';

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

import { ComponentList, IComponentListItem } from 'ide-component-list';

import { debugRender } from '../lib/debug';
import { StoresFactory, IStoresModel } from './schema/stores';
import { AppFactory } from './controller/index';
import { COMP_LIST } from './controller/comps-gourd';

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


export interface IStyles {
  [propName: string]: React.CSSProperties;
}

export interface IComponentTreeStyles extends IStyles {
  container ?: React.CSSProperties;
}

export interface IComponentTreeTheme {
  main: string;
  [prop: string]: any;
}


export interface IComponentTreeProps {
  /**
   * schema tree 配置项
   */
  schemaTree?: OptionalSchemaTreeProps;

  /**
   * context menu 配置项
   */
  contextMenu?: OptionalMenuProps;

  /**
   * 样式集合，方便外部控制
   */
    styles?: IComponentTreeStyles;

    /**
     * 设置主题
     */
    theme?: IComponentTreeTheme;

}

interface ISubComponents {
  SchemaTreeComponent: React.ComponentType<OptionalSchemaTreeProps>;
  ContextMenuComponent: React.ComponentType<OptionalMenuProps>;
}



export const DEFAULT_PROPS: IComponentTreeProps = {
  theme: {
    main: '#25ab68'
  },
  styles: {
    container: {}
  }
};

/**
 * 使用高阶组件打造的组件生成器
 * @param subComponents - 子组件列表
 */
export const ComponentTreeHOC = (subComponents: ISubComponents) => {
  const ComponentTreeHOC = (props: IComponentTreeProps = DEFAULT_PROPS) => {
    const { SchemaTreeComponent, ContextMenuComponent } = subComponents;
    const mergedProps = Object.assign({}, DEFAULT_PROPS, props);
    const { schemaTree, contextMenu, styles, theme } = mergedProps;

    const onSelectItem = (item: IComponentListItem)=>{
      console.log('select item:', item);
    }

    return <ThemeProvider theme={theme}>
      <StyledContainer style={styles.container} className="ide-component-tree-container">
          <SchemaTreeComponent {...schemaTree} />
          <ContextMenuComponent {...contextMenu} />

        <ComponentList list={COMP_LIST} onSelectItem={onSelectItem}/>
        </StyledContainer>
      </ThemeProvider>;
    
  };
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
  };
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
