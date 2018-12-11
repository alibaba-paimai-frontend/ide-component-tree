import React from 'react';
import { storiesOf } from '@storybook/react';
import { wInfo } from '../../../.storybook/utils';
import mdGetNode from './getNode.md';

import { ComponentTreeWithStore, client } from '../../../src/';
import { treegen } from '../../helper';

let ids = [];

function getIds() {
  client.get('/nodes').then(res => {
    const { status, body } = res;
    if (status === 200) {
      ids = body.nodes;
    }

    document.getElementById('info').innerText = ids.join(',');
  });
}

function createNew() {
  const schema = treegen({});
  client.post('/nodes', { schema: schema });
}

function updateName() {
  client.put('/nodes/root', {name: 'good'});
}

storiesOf('API - get', module)
  .addParameters(wInfo(mdGetNode))
  .addWithJSX('节点：/nodes 获取所有节点', () => {
    return (
      <div>
        <div id="info" />
        <button onClick={getIds}>获取所有ids</button>
        <button onClick={createNew}>创建随机树</button>
        <button onClick={updateName}>更新根节点名字</button>
        <ComponentTreeWithStore />
      </div>
    );
  });
