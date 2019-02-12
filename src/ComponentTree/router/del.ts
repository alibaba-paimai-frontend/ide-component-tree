import Router from 'ette-router';
import { getEnv } from 'mobx-state-tree';
import { IContext } from './helper';
export const router = new Router();

// // 移除整棵树
// router.del('nodes', '/nodes', async function(ctx: IContext) {
//   const { stores } = ctx;

//   const { schemaTreeClient } = getEnv(stores);
//   const res = await schemaTreeClient.del('/nodes');
//   ctx.response.body = res.body;
//   ctx.response.status = 200;
// });

// // 移除指定节点
// router.del('nodes', '/nodes/:id', async function(ctx: IContext) {
//   const { stores, params } = ctx;
//   const { id } = params;

//   const { schemaTreeClient } = getEnv(stores);
//   const res = await schemaTreeClient.del(`/nodes/${id}`);
//   ctx.response.body = res.body;
//   ctx.response.status = 200;
// });
