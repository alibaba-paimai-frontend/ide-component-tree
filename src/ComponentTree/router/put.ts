import { stores } from '../stores';
import Router from 'ette-router';

export const router = new Router();

// 更新节点的属性
(router as any).put('nodes', '/nodes/root', function(ctx: any) {
  const { name } = ctx.request.data;

  //   stores.setSchema(createSchemaModel(schema));
  stores.schema.setName(name);

  ctx.response.status = 200;
});

// 更新被选中的节点 id，同时自动展开
(router as any).put('nodes', '/selection/:id', function(ctx: any) {
  const { id } = ctx.params;

  // stores.setSchema(createSchemaModel(schema));
  stores.setSelectedId(id);

  // 自动展开看到当前节点
  stores.autoExpandIdIntoView(id);

  ctx.response.status = 200;
});
