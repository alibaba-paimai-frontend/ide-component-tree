import React, { useCallback, useMemo, useRef } from 'react';
import {
  IBaseTheme,
  IBaseComponentProps,
  withClickOutside,
  useSizeArea
} from 'ide-lib-base-component';
import { TComponentCurrying } from 'ide-lib-engine';
import { IContextMenuProps } from 'ide-context-menu';

import useWindowSize from '@rehooks/window-size';

import { StyledContainer, StyledListWrap } from './styles';
import { debugRender, debugModel } from '../lib/debug';
import { ISubProps } from './subs';

export * from './schema/util';

export interface IComponentTreeEvent {
  /**
   * 点击 list Panel 蒙层时的回调，用于探测是否点击在蒙层外
   */
  onOutsideListPanel?: (
    e: MouseEvent,
    isOutSide: boolean,
    detail: { [key: string]: boolean }
  ) => void;
  /**
   * 点击 list Panel 蒙层时的回调，用于探测是否点击在蒙层外
   */
  onOutsideContextMenu?: (
    e: MouseEvent,
    isOutSide: boolean,
    detail: { [key: string]: boolean }
  ) => void;
}

// export interface IComponentTreeStyles extends IBaseStyles {
//   container?: React.CSSProperties;
// }

export interface IComponentTreeTheme extends IBaseTheme {
  main: string;
}

export interface IComponentTreeProps
  extends IComponentTreeEvent,
    ISubProps,
    IBaseComponentProps {
  /**
   * 是否显示 menu modal
   */
  menuModalVisible?: boolean;

  /**
   * 是否显示 list modal
   */
  listModalVisible?: boolean;
}

export const DEFAULT_PROPS: IComponentTreeProps = {
  menuModalVisible: false,
  listModalVisible: false,
  theme: {
    main: '#25ab68'
  },
  styles: {
    container: {}
  }
};
// TODO: 采用 contextMenu.visible 代替 contextMeunModalVisible
export const ComponentTreeCurrying: TComponentCurrying<
  IComponentTreeProps,
  ISubProps
> = subComponents => props => {
  const {
    schemaTree = {},
    contextMenu = {},
    comList = {},
    styles,
    menuModalVisible,
    listModalVisible,
    onOutsideListPanel,
    onOutsideContextMenu
  } = props;

  const {
    SchemaTree: SchemaTreeComponent,
    ContextMenu: ContextMenuComponent,
    ComponentList: ComponentListComponent
  } = subComponents as Record<string, React.FunctionComponent<typeof props>>;

  const refContainer = useRef(null);
  // const containerArea = useSizeArea(refContainer);

  // 监听 window 大小
  const windowSize = useWindowSize();
  const containerArea = useMemo(() => {
    return {
      point: { x: 0, y: 0 },
      size: { width: windowSize.innerWidth, height: windowSize.innerHeight }
    };
  }, [windowSize]);

  // 使用 useMemo 提高性能
  const ComponentListWithClickOutside = useMemo(() => {
    const StyledComponentList = (props: IContextMenuProps) => {
      return (
        <StyledListWrap
          className="component-list-wrap"
          visible={true}
          height={windowSize.innerHeight}
        >
          <ComponentListComponent {...props} />
        </StyledListWrap>
      );
    };
    StyledComponentList.displayName = 'StyledComponentList';
    return withClickOutside(StyledComponentList);
  }, [ComponentListComponent]);

  // 使用 useMemo 提高性能
  const ContextMenuWithClickOutside = useMemo(
    () => withClickOutside(ContextMenuComponent),
    [ContextMenuComponent]
  );

  return (
    <StyledContainer
      ref={refContainer}
      style={styles.container}
      className="ide-component-tree-container"
    >
      <SchemaTreeComponent {...schemaTree} />

      <ContextMenuWithClickOutside
        onClick={onOutsideContextMenu}
        visible={menuModalVisible}
        layerArea={containerArea}
        bgColor={'rgba(0,0,0, 0)'}
        contentProps={contextMenu}
      />

      <ComponentListWithClickOutside
        onClick={onOutsideListPanel}
        visible={listModalVisible}
        layerArea={containerArea}
        bgColor={'rgba(0,0,0, 0)'}
        contentProps={comList}
      />
    </StyledContainer>
  );
};
