import Router from 'ette-router';
import { getEnv } from 'mobx-state-tree';
export const router = new Router();

// 更新根节点的属性
(router as any).put('nodes', '/nodes/root', async function(ctx: any) {
  const { stores, request } = ctx;
  const { name, value } = request.data;
  const { schemaTreeClient } = getEnv(stores);

  const res = await schemaTreeClient.put('/nodes/root', { name, value });
  ctx.response.body = res.body;
  ctx.response.status = 200;
});

// 更新指定节点的属性
(router as any).put('nodes', '/nodes/:id', async function(ctx: any) {
  const { stores, request } = ctx;
  const { name, value } = request.data;
  const { id } = ctx.params;
  const { schemaTreeClient } = getEnv(stores);

  const res = await schemaTreeClient.put(`/nodes/${id}`, { name, value });
  ctx.response.body = res.body;
  ctx.response.status = 200;
});

// 更新被选中的节点 id，同时自动展开
(router as any).put('nodes', '/selection/:id', async function(ctx: any) {
  const { stores, params } = ctx;
  const { id } = params;

  const { schemaTreeClient } = getEnv(stores);
  const res = await schemaTreeClient.put(`/selection/${id}`);
  ctx.response.body = res.body;
  ctx.response.status = 200;
});

// 更新菜单项属性
(router as any).put('menu', '/menu', async function(ctx: any) {
  const { stores, request } = ctx;
  const { name, value } = request.data;

  const { contextMenuClient } = getEnv(stores);

  const res = await contextMenuClient.put('/menu', { name, value });
  ctx.response.body = res.body;
  ctx.response.status = 200;
  
});
