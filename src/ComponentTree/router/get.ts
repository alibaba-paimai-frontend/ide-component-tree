import Router from 'ette-router';
import { getInnerAppsMiddleware } from 'ide-lib-base-component';

import { IContext } from './helper';

export const router = new Router();

// 返回某个 client 对象
router.get('clients', '/innerApps/:name', getInnerAppsMiddleware);
