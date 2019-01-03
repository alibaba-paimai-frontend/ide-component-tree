import Router from 'ette-router';
import { getEnv } from 'mobx-state-tree';

export const router = new Router();

// 默认获取所有的节点，可以通过 filter 返回指定的属性值
// 比如 /nodes?filter=name,screenId ，返回的集合只有这两个属性
(router as any).get('nodes', '/nodes', async function(ctx: any) {
  const { stores, request } = ctx;
  const { query } = request;

  const { schemaTreeClient } = getEnv(stores);
  const res = await schemaTreeClient.get(`/nodes${query && query.filter ? `?filter=${query.filter}`: ''}`);

  ctx.response.body = res.body;
  ctx.response.status = 200;
});

// 返回某个节点的 schema 信息
(router as any).get('nodes', '/nodes/:id', async function(ctx: any) {
  const { stores, request } = ctx;
  const { query } = request;
  const { id } = ctx.params;
  const { schemaTreeClient } = getEnv(stores);
  const res = await schemaTreeClient.get(`/nodes/${id}${query && query.filter ? `?filter=${query.filter}` : ''}`);

  ctx.response.body = res.body;
  ctx.response.status = 200;
});
