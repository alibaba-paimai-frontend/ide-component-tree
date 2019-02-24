import { cast, types, Instance, SnapshotOrInstance } from 'mobx-state-tree';

import {
  Stores as SchemaTreeStores,
  IStoresModel as ISchemaTreeStoresModel,
  SchemaTreeFactory
} from 'ide-tree';

import {
  Stores as ContextMenuStores,
  IStoresModel as IContextMenuStoresModel,
  ContextMenuFactory
} from 'ide-context-menu';

import { ComponentTreeModel } from './index';
import { createEmptyModel } from './util';

export const STORE_ID_PREIX = 'sct_';

export const Stores: any = types
  .model('StoresModel', {
    id: types.refinement(
      types.identifier,
      identifier => identifier.indexOf(STORE_ID_PREIX) === 0
    ),
    model: ComponentTreeModel,
    schemaTree: SchemaTreeStores,
    contextMenu: ContextMenuStores
  })
  .actions(self => {
    return {
      setModel(model: SnapshotOrInstance<typeof self.model>) {
        self.model = cast(model);
      },
      setSchemaTree(store: ISchemaTreeStoresModel) {
        self.schemaTree = store;
      },
      setContextMenu(store: IContextMenuStoresModel) {
        self.contextMenu = store;
      },
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
  const {
    app: schemaTreeApp,
    client: schemaTreeClient,
    stores: schemaTreeStores
  } = SchemaTreeFactory();
  const {
    app: contextMenuApp,
    client: contextMenuClient,
    stores: contextMenuStores
  } = ContextMenuFactory();

  // see: https://github.com/mobxjs/mobx-state-tree#dependency-injection
  // 依赖注入，方便在 controller 中可以直接调用子组件的 controller
  const stores = Stores.create(
    {
      id: `${STORE_ID_PREIX}${autoId++}`,
      schemaTree: schemaTreeStores,
      contextMenu: contextMenuStores
    },
    {
      schemaTreeClient,
      contextMenuClient
    }
  );

  return {
    stores,
    innerApps: {
      schemaTree: schemaTreeApp,
      contextMenu: contextMenuApp
    }
  };
}
