import { Instance } from 'mobx-state-tree';
import { initSuitsFromConfig } from 'ide-lib-engine';

export * from './ComponentTree/config';
export * from './ComponentTree/';

import { ComponentTreeCurrying } from './ComponentTree/';
import { configComponentTree } from './ComponentTree/config';

const {
    ComponentModel: ComponentTreeModel,
    StoresModel: ComponentTreeStoresModel,
    NormalComponent: ComponentTree,
    ComponentHOC: ComponentTreeHOC,
    ComponentAddStore: ComponentTreeAddStore,
    ComponentFactory: ComponentTreeFactory
} = initSuitsFromConfig(ComponentTreeCurrying,configComponentTree);

export {
    ComponentTreeModel,
    ComponentTreeStoresModel,
    ComponentTree,
    ComponentTreeHOC,
    ComponentTreeAddStore,
    ComponentTreeFactory
};

export interface IComponentTreeModel extends Instance<typeof ComponentTreeModel> { }
