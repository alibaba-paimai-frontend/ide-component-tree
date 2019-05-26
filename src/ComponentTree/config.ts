import { types } from 'mobx-state-tree';
import { BASE_CONTROLLED_KEYS } from 'ide-lib-base-component';

import { IStoresModel, IModuleConfig } from 'ide-lib-engine';
import { DEFAULT_PROPS, IComponentTreeProps } from '.';
import { hideList, hideContextMenu } from './solution/model';

import { subComponents, ISubProps } from './subs';

import { router as GetRouter } from './router/get';
import { router as PostRouter } from './router/post';
import { router as PutRouter } from './router/put';
import { router as DelRouter } from './router/del';
import { routerHoistTable } from './router/helper';

export const configComponentTree: IModuleConfig<
  IComponentTreeProps,
  ISubProps
> = {
  component: {
    className: 'ComponentTree',
    solution: {
      onOutsideListPanel: [hideList],
      onOutsideContextMenu: [hideContextMenu]
    },
    defaultProps: DEFAULT_PROPS,
    children: subComponents
  },
  router: {
    domain: 'component-tree',
    list: [GetRouter, PostRouter, PutRouter, DelRouter],
    hoistRoutes: routerHoistTable, // 提升访问子路由功能，相当于是强约束化的 alias
    aliases: {
      alias: 'blockbar',
      path: 'bar/headerbar'
    } // 自定义的路由别名规则
  },
  store: {
    idPrefix: 'sct'
  },
  model: {
    controlledKeys: [], // 后续再初始化
    props: {
      // visible: types.optional(types.boolean, true),
      menuModalVisible: types.optional(types.boolean, false),
      listModalVisible: types.optional(types.boolean, false)
      // language: types.optional(
      //   types.enumeration('Type', CODE_LANGUAGES),
      //   ECodeLanguage.JS
      // ),
      // children: types.array(types.late((): IAnyModelType => SchemaModel)) // 在 mst v3 中， `types.array` 默认值就是 `[]`
      // options: types.map(types.union(types.boolean, types.string))
      // 在 mst v3 中， `types.map` 默认值就是 `{}`
    }
  }
};

// 枚举受 store 控制的 key，一般来自 config.model.props 中 key
// 当然也可以自己枚举
export const SELF_CONTROLLED_KEYS = Object.keys(
  configComponentTree.model.props
); // ['visible', 'text']

export const CONTROLLED_KEYS = BASE_CONTROLLED_KEYS.concat(
  SELF_CONTROLLED_KEYS
);

// 初始化 controlledKeys
configComponentTree.model.controlledKeys = CONTROLLED_KEYS;
