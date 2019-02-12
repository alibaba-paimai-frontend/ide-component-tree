import Router from 'ette-router';
import { getEnv } from 'mobx-state-tree';
import { IContext } from './helper';
export const router = new Router();

// 更新菜单的位置（比如右键显示菜单等等）
router.put('menu', '/menu/autoposition', async function(ctx: IContext) {
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
