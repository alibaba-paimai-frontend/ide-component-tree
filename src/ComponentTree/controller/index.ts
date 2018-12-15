import Application from 'ette';
import { router as GetRouter } from '../router/get';
import { router as PostRouter } from '../router/post';
import { router as PutRouter } from '../router/put';
import { router as DelRouter } from '../router/del';

export const app = new Application({ domain: 'component-tree' });

export const client = app.client; // 透给外部

// 注册路由
app.use(GetRouter.routes());
app.use(PostRouter.routes());
app.use(PutRouter.routes());
app.use(DelRouter.routes());
