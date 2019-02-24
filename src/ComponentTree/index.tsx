import React, { Component } from 'react';
import { observer } from 'mobx-react-lite';
import { ThemeProvider } from 'styled-components';
// import { useClickOutside } from 'use-events';
import useWindowSize from '@rehooks/window-size';

import { based, Omit, OptionalProps, IBaseTheme, IBaseStyles, IBaseComponentProps } from 'ide-lib-base-component';


import { StyledContainer, StyledListWrap } from './styles';

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

import { debugRender, debugInteract } from '../lib/debug';
import { StoresFactory, IStoresModel } from './schema/stores';
import { AppFactory } from './controller/index';
import { COMP_LIST } from './controller/comps-gourd';

type OptionalSchemaTreeProps = OptionalProps<
  ISchemaTreeProps,
  TSchemaTreeControlledKeys
>;
type OptionalMenuProps = OptionalProps<
  IContextMenuProps,
  TStoresMenuControlledKeys
>;

export interface IComponentTreeStyles extends IBaseStyles {
  container ?: React.CSSProperties;
}

export interface IComponentTreeTheme extends IBaseTheme{
  main: string;
}


export interface IComponentTreeEvent {
  /**
   * 点击 list 外面时的回调函数
   */
  onClickListOutside?: (e: MouseEvent) => void;


  /**
   * 点击选择 component item 的回调
   */
  onSelectListItem?: (item: IComponentListItem) => void;

}


export interface IComponentTreeProps extends IComponentTreeEvent, IBaseComponentProps {
  /**
   * schema tree 配置项
   */
  schemaTree?: OptionalSchemaTreeProps;

  /**
   * context menu 配置项
   */
  contextMenu?: OptionalMenuProps;

    /**
     * 是否显示组件列表
     */
  listVisible?: boolean;

}

interface ISubComponents {
  SchemaTreeComponent: React.ComponentType<OptionalSchemaTreeProps>;
  ContextMenuComponent: React.ComponentType<OptionalMenuProps>;
}



export const DEFAULT_PROPS: IComponentTreeProps = {
  theme: {
    main: '#25ab68'
  },
  listVisible: false,
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
    const { schemaTree, contextMenu, styles, theme, listVisible, onClickListOutside, onSelectListItem } = mergedProps;

    const refList = React.useRef(null);

    // 监听是否点击到 list 外面，因性能问题，暂时先不用这个函数
    // const [isClickListOutside] = useClickOutside(refList, event => {
    //   onClickListOutside && onClickListOutside(event);
    // });

    // 监听 window 大小
    const windowSize = useWindowSize();

    const onSelectItem = (item: IComponentListItem)=>{
      onSelectListItem && onSelectListItem(item);
    }

    // debugInteract(`[isClickListOutside]: ${isClickListOutside}`)
    return <ThemeProvider theme={theme}>
      <StyledContainer style={styles.container} className="ide-component-tree-container">
          <SchemaTreeComponent {...schemaTree} />
          <ContextMenuComponent {...contextMenu} />
        <StyledListWrap className="component-list-wrap" ref={refList} visible={listVisible} height={windowSize.innerHeight}>
          <ComponentList list={COMP_LIST} onSelectItem={onSelectItem}/>
        </StyledListWrap>
        </StyledContainer>
      </ThemeProvider>;
    
  };
  ComponentTreeHOC.displayName = 'ComponentTreeHOC';
  return observer(based(ComponentTreeHOC));
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
