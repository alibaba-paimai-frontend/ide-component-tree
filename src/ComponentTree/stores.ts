import { types, SnapshotOrInstance } from 'mobx-state-tree';
import { createEmptyModel } from './schema/util';
import { ISchemaModel, Schema } from './schema';

export const Stores = types
  .model('StoresModel', {
    schema: Schema,
    selectedId: types.optional(types.string, ''),
    expandedIds: types.array(types.string)
  })
  .actions(self => {
    return {
      setSchema(model: ISchemaModel) {
        self.schema = model;
      },
      setExpandedIds(ids: SnapshotOrInstance<typeof self.expandedIds> = []) {
        self.expandedIds = ids as any;
      },
      setSelectedId(id: SnapshotOrInstance<typeof self.selectedId>) {
        self.selectedId = id;
      }
    };
  });

export const stores = Stores.create({
  schema: createEmptyModel() as any
});
