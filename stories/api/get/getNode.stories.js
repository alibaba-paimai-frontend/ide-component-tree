import React from 'react';
import { storiesOf } from '@storybook/react';
import { Row, Col, Input, Button } from 'antd';
import { wInfo } from '../../../.storybook/utils';
import mdGetNode from './getNode.md';

import { ComponentTreeWithStore, client } from '../../../src/';
import { treegen } from '../../helper';

const styles = {
  demoWrap: {
    display: 'flex',
    width: '100%'
  }
};

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

function getById() {
  const id = document.getElementById('nodeId').value;
  client.get(`/nodes/${id}`).then(res => {
    const { status, body } = res;
    if (status === 200) {
      const node = body.node || {};
      document.getElementById('info').innerText = JSON.stringify(
        node.toJSON ? node.toJSON() : node,
        null,
        4
      );
    }
  });

  // 同时选中那个节点
  client.put(`/selection/${id}`);
}
storiesOf('API - get', module)
  .addParameters(wInfo(mdGetNode))
  .addWithJSX('节点：/nodes 获取所有节点', () => {
    return (
      <Row style={styles.demoWrap}>
        <Col span={10} offset={2}>
          <Button onClick={getNodeInfo}>获取所有节点信息（id,attrs)</Button>
          <Button onClick={createNew}>创建随机树</Button>
          
          <ComponentTreeWithStore />
        </Col>
        <Col span={12}>
          <div id="info" />
        </Col>
      </Row>
    );
  })
  .addWithJSX('节点：/nodes/:id 获取指定节点信息', () => {
    return (
      <Row style={styles.demoWrap}>
        <Col span={10} offset={2}>
          <Input placeholder="输入节点 ID" id="nodeId" addonAfter={
            <>
              <Button onClick={getById}>获取节点信息</Button>
              <Button onClick={createNew}>创建随机树</Button>
            </>
          } />
          <ComponentTreeWithStore />
        </Col>
        <Col span={12}>
          <div id="info" />
        </Col>
      </Row>
    );
  });
