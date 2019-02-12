import Router from 'ette-router';
import { getEnv } from 'mobx-state-tree';
import { IContext } from './helper';

export const router = new Router();

// 返回某个 client 对象
router.get('clients', '/innerApps/:name', async function(ctx: IContext) {
  const { innerApps } = ctx;
  const { name } = ctx.params;

  const result = {
    success: false,
    message: '',
    client: '' // 其实应该赋值为 null 的，为了规避 ts 的类型检查，用 '' 空字符串代替
  };

  if (!name) {
    result.message = '传入参数 name 不能为空';
  } else if (!innerApps) {
    result.message = '不存在 innerApps 对象';
  } else if (!innerApps[name]) {
    result.message = ` innerApps 中不存在名为 ${name} 的实例`;
  } else {
    result.message = '获取成功';
    result.client = innerApps[name];
  }

  ctx.response.body = result;
  ctx.response.status = 200;
});
