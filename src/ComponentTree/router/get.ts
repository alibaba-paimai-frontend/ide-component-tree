import { stores } from '../stores';
import { getAllIds } from '../schema/util';
import Router from 'ette-router';

export const router = new Router();

// 获取所有的节点
(router as any).get('nodes', '/nodes', function(ctx: any) {
  ctx.response.body = {
    nodes: getAllIds(stores.schema)
  };
  ctx.response.status = 200;
});
