import Router from 'ette-router';
import { getEnv } from 'mobx-state-tree';
import { updateStylesMiddleware, updateThemeMiddleware } from 'ide-lib-base-component';

import { IContext } from './helper';
import { ESubApps } from '../schema/stores';
export const router = new Router();

// 更新菜单项属性
router.put('model', '/model', function (ctx: IContext) {
  const { stores, request } = ctx;
  const { name, value } = request.data;

  //   stores.setSchema(createSchemaModel(schema));
  const isSuccess = stores.model.updateAttribute(name, value);
  ctx.response.body = {
    success: isSuccess
  };

  ctx.response.status = 200;
});


// 更新菜单的位置（比如右键显示菜单等等）
router.put('menu', '/menu/autoposition', async function(ctx: IContext) {
  const { stores, request } = ctx;
  const { data } = request;
  const { x, y } = data;
  const { clients } = getEnv(stores);

  const contextMenuClient = clients[ESubApps.contextMenu]; // 获取 contextMenu 的 client
  
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



// 更新 css 属性
router.put('model', '/model/styles/:target', updateStylesMiddleware('model'));
// 更新 theme 属性
router.put('model', '/model/theme/:target', updateThemeMiddleware('model'));
