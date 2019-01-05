import Router from 'ette-router';
import { getEnv } from 'mobx-state-tree';
import { type } from 'os';
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

/* ----------------------------------------------------
    菜单项有关
----------------------------------------------------- */
// 更新菜单项属性
(router as any).put('menu', '/menu', async function(ctx: any) {
  const { stores, request } = ctx;
  const { name, value } = request.data;

  const { contextMenuClient } = getEnv(stores);

  const res = await contextMenuClient.put('/menu', { name, value });

  // 如果是关闭菜单，则从 buffer 中移除
  if (name === 'visible' && value === false) {
    contextMenuClient.del('/menu/bufferAreas');
  }

  ctx.response.body = res.body;
  ctx.response.status = 200;
});

// 更新菜单的位置（比如右键显示菜单等等）
(router as any).put('menu', '/menu/autoposition', async function(ctx: any) {
  const { stores, request } = ctx;
  const { data } = request;
  const { x, y } = data;

  const { contextMenuClient } = getEnv(stores);
  const { body } = await contextMenuClient.put(`/menu/position?type=event`, {
    x,
    y
  });

  contextMenuClient.put('/menu', { name: 'visible', value: true }); // 同时让菜单可见

  if (body.area) {
    contextMenuClient.post('/menu/bufferAreas', { area: body.area }); // 注册可见区域，当用户点击外部区域需要隐藏
  }

  ctx.response.body = body;
  ctx.response.status = 200;
});
