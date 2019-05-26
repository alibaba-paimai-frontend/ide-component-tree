import Router from 'ette-router';
import {
  updateStylesMiddleware,
  updateThemeMiddleware,
  buildNormalResponse,
  getClientFromCtx
} from 'ide-lib-base-component';

import { IContext } from './helper';

import { ESubAppNames } from '../subs';

export const router = new Router();
// 更新单项属性
router.put('updateModel', '/model', function(ctx: IContext) {
  const { stores, request } = ctx;
  const { name, value } = request.data;

  //   stores.setSchema(createSchemaModel(schema));
  const originValue = stores.model[name];
  const isSuccess = stores.model.updateAttribute(name, value);

  buildNormalResponse(
    ctx,
    200,
    { success: isSuccess, origin: originValue },
    `属性 ${name} 的值从 ${originValue} -> ${value} 的变更: ${isSuccess}`
  );
});

// TODO: 更新菜单的位置（比如右键显示菜单等等）
router.put('menu', '/menu/autoposition', async function(ctx: IContext) {
  const { request } = ctx;
  const { data } = request;
  const { x, y } = data;
  const contextMenuClient = getClientFromCtx(ctx, ESubAppNames.contextMenu); // 获取 contextMenu 的 client
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
router.put(
  'updateStyles',
  '/model/styles/:target',
  updateStylesMiddleware('model')
);

// 更新 theme 属性
router.put(
  'updateTheme',
  '/model/theme/:target',
  updateThemeMiddleware('model')
);
