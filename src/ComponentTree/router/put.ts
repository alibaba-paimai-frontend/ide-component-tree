import { stores } from '../stores';
import Router from 'ette-router';

export const router = new Router();

// 获取所有的节点
(router as any).put('nodes', '/nodes/root', function(ctx: any) {
  const { name } = ctx.request.data;

//   stores.setSchema(createSchemaModel(schema));
  stores.schema.setName(name);

  ctx.response.status = 200;
});
