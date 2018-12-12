import React from 'react';
import { storiesOf } from '@storybook/react';
import { wInfo } from '../../../.storybook/utils';
import mdGetNode from './getNode.md';

import { ComponentTreeWithStore, client } from '../../../src/';
import { treegen } from '../../helper';

let nodes = [];

function getNodeInfo() {
  client.get('/nodes?filter=id,attrs').then(res => {
    const { status, body } = res;
    if (status === 200) {
      nodes = body.nodes;
    }

    document.getElementById('info').innerText = JSON.stringify(nodes, null, 4);
  });
}

function createNew() {
  const schema = treegen({});
  client.post('/nodes', { schema: schema });
}

function updateName() {
  client.put('/nodes/root', { name: 'good' });
}

function getById() {
  const id = document.getElementById('nodeId').value;
  client.get(`/nodes/${id}`).then(res => {
    const { status, body } = res;
    if (status === 200) {
      const node = body.node || {};
      document.getElementById('info').innerText = JSON.stringify(
        node.toJSON ? node.toJSON(): node,
        null,
        4
      );
    }
  });
}
storiesOf('API - get', module)
  .addParameters(wInfo(mdGetNode))
  .addWithJSX('节点：/nodes 获取所有节点', () => {
    return (
      <div>
        <div id="info" />
        <button onClick={getNodeInfo}>获取所有节点信息（id,attrs)</button>
        <button onClick={createNew}>创建随机树</button>
        <button onClick={updateName}>更新根节点名字</button>
        <ComponentTreeWithStore />
      </div>
    );
  })
  .addWithJSX('节点：/nodes/:id 获取指定节点信息', () => {
    return (
      <div>
        <div id="info" />
        <input id="nodeId" />
        <button onClick={createNew}>创建随机树</button>
        <button onClick={getById}>获取指定节点信息</button>
        <ComponentTreeWithStore />
      </div>
    );
  });
