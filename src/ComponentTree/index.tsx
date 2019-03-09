import React from 'react';
import { observer } from 'mobx-react-lite';
// import { useClickOutside } from 'use-events';
import useWindowSize from '@rehooks/window-size';

import { pick } from 'ide-lib-utils';
import { based, Omit, OptionalProps, IBaseTheme, IBaseComponentProps, IStoresEnv, useIndectedEvents } from 'ide-lib-base-component';

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

import { StyledContainer, StyledListWrap, StyledModalLayer } from './styles';
import { ComponentList, IComponentListItem } from 'ide-component-list';

import { debugRender } from '../lib/debug';
import { StoresFactory, IStoresModel } from './schema/stores';
import { TComponentTreeControlledKeys, CONTROLLED_KEYS } from './schema/index';
import { AppFactory } from './controller/index';
import { COMP_LIST } from './schema/comps-gourd';
import { showContextMenu, showComponentList, addChildNodeByItem, actionByItem, hideMenu } from './solution';

type OptionalSchemaTreeProps = OptionalProps<
  ISchemaTreeProps,
  TSchemaTreeControlledKeys
>;
type OptionalMenuProps = OptionalProps<
  IContextMenuProps,
  TStoresMenuControlledKeys
>;

// export interface IComponentTreeStyles extends IBaseStyles {
//   // container: React.CSSProperties;
// }

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
export const ComponentTreeHOC: (subComponents: ISubComponents) => React.FunctionComponent<IComponentTreeProps> = (subComponents) => {
  const ComponentTreeHOC = (props: IComponentTreeProps) => {
    const { SchemaTreeComponent, ContextMenuComponent } = subComponents;
    const mergedProps = Object.assign({}, DEFAULT_PROPS, props);
    const { schemaTree, contextMenu, styles, theme, listVisible, onClickListOutside, onSelectListItem } = mergedProps;

    const refList = React.useRef(null);

    // 监听 window 大小
    const windowSize = useWindowSize();

    const onSelectItem = (item: IComponentListItem)=>{
      onSelectListItem && onSelectListItem(item);
    }

    // 监听是否点击到 list 外面
    const onClickModal = (ref: React.RefObject<HTMLElement>) => (e: MouseEvent) => {
      if (!refList) return;
      const { current } = ref;

      // 获取当前元素的宽、高；
      const w = current.offsetWidth;
      const h = current.offsetHeight;
      const x = 200, y = 10; // 元素起点位置
      const { clientX, clientY } = e; // 鼠标点击位置

      // 点击位置落在区域外
      const wasOutSide = !(
        clientX > x &&
        clientX < x + w &&
        clientY > y &&
        clientY < y + h
      );

      // const containedTarget = current.contains(e.target as HTMLElement);
      if (current !== null && wasOutSide) {
        onClickListOutside(e);
      }
    }

    // debugInteract(`[isClickListOutside]: ${isClickListOutside}`)
    return <StyledContainer style={styles.container} className="ide-component-tree-container">
      <SchemaTreeComponent {...schemaTree} />
      <ContextMenuComponent {...contextMenu} />

      <StyledModalLayer className="modal-layer" visible={listVisible} height={windowSize.innerHeight} width={windowSize.innerWidth} onClick={onClickModal(refList)}>
      </StyledModalLayer>

      <StyledListWrap className="component-list-wrap" ref={refList} visible={listVisible} height={windowSize.innerHeight}>
        <ComponentList list={COMP_LIST} onSelectItem={onSelectItem} />
      </StyledListWrap>

    </StyledContainer>;
    
  };
  ComponentTreeHOC.displayName = 'ComponentTreeHOC';
  return observer(based(ComponentTreeHOC, DEFAULT_PROPS));
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
export const ComponentTreeAddStore: (storesEnv: IStoresEnv<IStoresModel>) => React.FunctionComponent<IComponentTreeProps> = (storesEnv) => {
  const { stores } = storesEnv;
  const ComponentTreeHasSubStore = ComponentTreeHOC({
    SchemaTreeComponent: SchemaTreeAddStore(stores.schemaTree/* , extracSubEnv(env, 'schemaTree') */),
    ContextMenuComponent: ContextMenuAddStore(stores.contextMenu)
  });

  const ComponentTreeWithStore = (props: Omit<IComponentTreeProps, TComponentTreeControlledKeys>) => {
    const { schemaTree, contextMenu, ...otherProps} = props;
    const { model } = stores;
    const controlledProps = pick(model, CONTROLLED_KEYS);
    debugRender(`[${stores.id}] rendering`);

    const contextMenuWithInjected = useIndectedEvents<IContextMenuProps, IStoresModel>(storesEnv, contextMenu, {
      'onClickItem': [showComponentList, actionByItem, hideMenu]
    });

    const schemaTreeWithInjected = useIndectedEvents<ISchemaTreeProps, IStoresModel>(storesEnv, schemaTree, {
      'onRightClickNode': [showContextMenu]
    });

    const otherPropsWithInjected = useIndectedEvents<IComponentTreeProps, IStoresModel>(storesEnv, otherProps, {
      'onSelectListItem': [addChildNodeByItem]
    });

    return (
      <ComponentTreeHasSubStore
        schemaTree={schemaTreeWithInjected}
        contextMenu={contextMenuWithInjected}
        // onSelectListItem={onSelectListItemWithStore(storesEnv, onSelectListItem)}
        {...controlledProps}
        {...otherPropsWithInjected}
      />
    );
  };
  ComponentTreeWithStore.displayName = 'ComponentTreeWithStore';
  return observer(ComponentTreeWithStore);
};

/**
 * 生成 env 对象，方便在不同的状态组件中传递上下文
 */
export const ComponentTreeStoresEnv = () => {
  const { stores, innerApps } = StoresFactory(); // 创建 model
  const app = AppFactory(stores, innerApps); // 创建 controller，并挂载 model
  return {
    stores,
    app,
    client: app.client,
    innerApps: innerApps
  };
}

/**
 * 工厂函数，每调用一次就获取一副 MVC
 * 用于隔离不同的 ComponentTreeWithStore 的上下文
 */
export const ComponentTreeFactory = () => {
  const storesEnv = ComponentTreeStoresEnv();
  return {
    ...storesEnv,
    ComponentTreeWithStore: ComponentTreeAddStore(storesEnv)
  }
};

