import * as React from 'react';
import { Tree } from 'antd';
import { AntTreeNodeMouseEvent } from 'antd/es/tree';
import { observer } from 'mobx-react';
import { ISchemaObject, findById } from '../model/schema-util';
import { traverse } from 'ss-tree';

const TreeNode = Tree.TreeNode;

export type ComponentTreeNodeMouseEvent = {
  node: ISchemaObject;
  event: React.MouseEventHandler<any>;
};

interface NodeProps {
  name: string;
  id: string;
  childArray?: any[];
}

export function TreeNodeCanAddChild({ name, id, childArray = [] }: NodeProps) {
  return (
    <TreeNode title={name} key={id}>
      {childArray || null}
    </TreeNode>
  );
}

interface Props {
  treeJSON: ISchemaObject;
  selectedId?: string;
  onRightClickNode?: (options: ComponentTreeNodeMouseEvent) => void;
  onSelectNode?: (node: ISchemaObject) => void;
}

interface State {
  selectedId?: string;
}

export default class ComponentTree extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  onSelectNode = (selectedKeys: any, info: any) => {
    console.log('selected', selectedKeys, info);
    const { onSelectNode, treeJSON } = this.props;
    const id = selectedKeys && selectedKeys[0];

    this.setState(
      {
        selectedId: selectedKeys[0]
      },
      () => {
        if (!!id && onSelectNode) {
          let node = findById(treeJSON, id) as ISchemaObject;
          onSelectNode && onSelectNode(node);
        }
      }
    );
  };

  /**
   * 非递归生成组件树结构
   *
   * @memberof ComponentTree
   */
  renderTree = (root: ISchemaObject) => {
    const treeNodeIdMap: any = {};
    let count = 0;
    const nodes = traverse(root, (node: ISchemaObject, nodeArray: any = []) => {
      const { name, id, parent } = node;
      nodeArray.push({
        id: id,
        name: name,
        component: <TreeNode title={name} key={id} />,
        parentId: parent && parent.id
      });

      treeNodeIdMap[id] = count; // 倒序索引
      count++;

      return nodeArray;
    });

    // 逆序遍历，将节点 reduce 成单个节点
    // 主要是依赖江源
    for (let i = count; i > 0; i--) {
      const currentNode = nodes[i - 1];
      if (currentNode && currentNode.parentId) {
        const targetNodeIndex = treeNodeIdMap[currentNode.parentId];
        const targetNode = nodes[targetNodeIndex]; // 方向索引出目标节点

        // 目标节点组件
        const component = targetNode.component;
        const { name, id } = targetNode;
        const { children } = component.props;

        // 将当前节点 append 到父节点上
        const newChild = children
          ? children.concat(currentNode.component)
          : [currentNode.component];
        // 重新构造父节点
        targetNode.component = (
          <TreeNode title={name} key={id}>
            {newChild}
          </TreeNode>
        );
      }
    }
    return nodes[0].component;
  };

  onRightClick = (option: AntTreeNodeMouseEvent) => {
    const { node, event } = option;
    const { treeJSON, onRightClickNode } = this.props;
    let id = node.props.eventKey; // key就是他
    if (!!id && onRightClickNode) {
      let node = findById(treeJSON, id) as ISchemaObject;
      onRightClickNode({ event, node });
    }
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.selectedId !== prevState.selectedId) {
      return {
        selectedId: nextProps.selectedId
      };
    }
    return prevState;
  }

  render() {
    const { treeJSON } = this.props;
    const { selectedId } = this.state;
    return (
      <Tree
        key="componentTree"
        showLine
        defaultExpandAll={true}
        defaultSelectedKeys={[selectedId]}
        onSelect={this.onSelectNode}
        onRightClick={this.onRightClick}
      >
        {this.renderTree(treeJSON)}
      </Tree>
    );
  }
}
