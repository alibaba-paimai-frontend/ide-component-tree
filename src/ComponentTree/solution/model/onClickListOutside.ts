import { IStoresEnv } from 'ide-lib-base-component';
import { IStoresModel } from '../../schema/stores';

/**
 * 显示 list 列表项
 * @param env - IStoresEnv
 */
export const hideList = (env: IStoresEnv<IStoresModel>) => async (e: MouseEvent) =>  {
  const { stores, client } = env;
    stores.model.setListVisible(false);
};
