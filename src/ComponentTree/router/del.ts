import Router from 'ette-router';
import { getEnv } from 'mobx-state-tree';
export const router = new Router();

// 移除整棵树
(router as any).del('nodes', '/nodes', async function(ctx: any) {
  const { stores } = ctx;

  const { schemaTreeClient } = getEnv(stores);
  const res = await schemaTreeClient.del('/nodes');
  ctx.response.body = res.body;
  ctx.response.status = 200;
});

// 移除指定节点
(router as any).del('nodes', '/nodes/:id', async function(ctx: any) {
  const { stores, params } = ctx;
  const { id } = params;
  
  const { schemaTreeClient } = getEnv(stores);
  const res = await schemaTreeClient.del(`/nodes/${id}`);
  ctx.response.body = res.body;
  ctx.response.status = 200;
});
