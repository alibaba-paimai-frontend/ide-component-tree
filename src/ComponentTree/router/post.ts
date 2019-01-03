import Router from 'ette-router';
import { getEnv } from 'mobx-state-tree';

export const router = new Router();

// 根据 schema 创建组件树
(router as any).post('nodes', '/nodes', function(ctx: any) {
  const { stores, request } = ctx;
  const { schema } = request.data;

  const { schemaTreeClient } = getEnv(stores);

  // 调用 schemaTree Client 的同名方法
  schemaTreeClient.post('/nodes', { schema: schema });

  ctx.response.status = 200;
});

// 创建新的菜单
(router as any).post('menu', '/menu', function(ctx: any) {
  const { stores, request } = ctx;
  const { menu } = request.data;

  // 调用 context menu Client 的同名方法
  const { contextMenuClient } = getEnv(stores);
  contextMenuClient.post('/menu', { menu: menu });

  ctx.response.status = 200;
});
