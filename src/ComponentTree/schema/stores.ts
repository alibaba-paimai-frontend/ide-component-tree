import { cast, types, Instance, SnapshotOrInstance } from 'mobx-state-tree';
import { TAnyMSTModel, getSubStoresAssigner, IStoresEnv, getSubAppsFromFactoryMap} from 'ide-lib-base-component';

import {
  Stores as SchemaTreeStores,
  SchemaTreeFactory
} from 'ide-tree';

import {
  Stores as ContextMenuStores,
  ContextMenuFactory
} from 'ide-context-menu';


import { ComponentTreeModel } from './index';
import { createEmptyModel } from './util';

export const STORE_ID_PREIX = 'sct_';

export enum ESubApps {
  schemaTree = 'schemaTree',
  contextMenu = 'contextMenu'
};

export const NAMES_SUBAPP = Object.values(ESubApps);

// 定义子 stores 映射关系
export const STORES_SUBAPP: Record<ESubApps, TAnyMSTModel> = {
  schemaTree: SchemaTreeStores,
  contextMenu: ContextMenuStores
}

// 定义子 facotry 映射关系
export const FACTORY_SUBAPP: Record<ESubApps, (...args: any[]) => Partial<IStoresEnv<TAnyMSTModel>>> = {
  schemaTree: SchemaTreeFactory,
  contextMenu: ContextMenuFactory
}

export const Stores: any = types
  .model('StoresModel', {
    id: types.refinement(
      types.identifier,
      identifier => identifier.indexOf(STORE_ID_PREIX) === 0
    ),
    model: ComponentTreeModel,
    ...STORES_SUBAPP
  })
  .actions((self: TAnyMSTModel) => {
    const assignerInjected = getSubStoresAssigner(self, NAMES_SUBAPP);
    return {
      setModel(model: SnapshotOrInstance<typeof self.model>) {
        self.model = cast(model);
      },
      // 注入诸如 setSchemaTree 这样的方法
      ...assignerInjected,
      resetToEmpty() {
        self.model = createEmptyModel();
      }
    };
  });

export interface IStoresModel extends Instance<typeof Stores> {}

let autoId = 1;

/**
 * 工厂方法，用于创建 stores，同时注入对应子元素的 client 和 app
 */
export function StoresFactory() {
  const { subStores, subApps, subClients } = getSubAppsFromFactoryMap(FACTORY_SUBAPP);

  // see: https://github.com/mobxjs/mobx-state-tree#dependency-injection
  // 依赖注入，方便在 controller 中可以直接调用子组件的 controller
  const stores = Stores.create(
    {
      id: `${STORE_ID_PREIX}${autoId++}`,
      model: createEmptyModel(),
      ...subStores
    }, {
      clients: subClients
    }
  );

  return {
    stores,
    innerApps: subApps
  };
}
