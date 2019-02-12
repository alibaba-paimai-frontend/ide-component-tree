import Router from 'ette-router';
import { getEnv } from 'mobx-state-tree';
import { IContext } from './helper';

export const router = new Router();


// // 创建新的菜单
// router.post('menu', '/menu', function(ctx: IContext) {
//   const { stores, request } = ctx;
//   const { menu } = request.data;

//   // 调用 context menu Client 的同名方法
//   const { contextMenuClient } = getEnv(stores);
//   contextMenuClient.post('/menu', { menu: menu });

//   ctx.response.status = 200;
// });
