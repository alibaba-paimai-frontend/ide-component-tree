import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { StoresFactory, IStoresModel } from './schema/stores';
import { AppFactory } from './controller/index';
import {
  IStoresModel as ISchemaTreeStoresModel,
  SchemaTree,
  ISchemaTreeEvent
} from 'ide-tree';
import {
  IStoresModel as IContextMenuStoresModel,
  ContextMenu,
  IContextMenuEvent
} from 'ide-context-menu';

export interface IComponentTreeProps {
  schemaTree: ISchemaTreeStoresModel;
  contextMenu: IContextMenuStoresModel;
  schemaTreeEvent: ISchemaTreeEvent;
  contextMenuEvent: IContextMenuEvent;
}

// 推荐使用 decorator 的方式，否则 stories 的导出会缺少 **Prop Types** 的说明
// 因为 react-docgen-typescript-loader 需要  named export 导出方式
@observer
export class ComponentTree extends Component<IComponentTreeProps> {
  constructor(props: IComponentTreeProps) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      schemaTree,
      contextMenu,
      schemaTreeEvent,
      contextMenuEvent
    } = this.props;

    return (
      <div>
        <SchemaTree {...schemaTree} {...schemaTreeEvent} />
        <ContextMenu {...contextMenu} {...contextMenuEvent} />
      </div>
    );
  }
}

/* ----------------------------------------------------
    以下是专门配合 store 时的组件版本
----------------------------------------------------- */

/**
 * 科里化创建 ComponentTreeWithStore 组件
 * @param stores - store 模型实例
 */
export const ComponentTreeAddStore = (stores: IStoresModel) =>
  observer(function ComponentTreeWithStore(props: IComponentTreeProps) {
    return (
      <ComponentTree
        schemaTree={stores.schemaTree}
        contextMenu={stores.contextMenu}
        {...props}
      />
    );
  });
/**
 * 工厂函数，每调用一次就获取一副 MVC
 * 用于隔离不同的 ComponentTreeWithStore 的上下文
 */
export const ComponentTreeFactory = () => {
  const stores = StoresFactory(); // 创建 model
  const app = AppFactory(stores); // 创建 controller，并挂载 model
  return {
    stores,
    app,
    client: app.client,
    ComponentTreeWithStore: ComponentTreeAddStore(stores)
  };
};
