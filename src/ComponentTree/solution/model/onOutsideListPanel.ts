import { IStoresEnv } from 'ide-lib-base-component';
import { IStoresModel } from 'ide-lib-engine';

import { ROUTER_MAP } from '../../router/helper';

/**
 * 显示 list 列表项
 * @param env - IStoresEnv
 */
export const hideList = (env: IStoresEnv<IStoresModel>) => async (
  e: MouseEvent,
  isOutSide: boolean,
  detail: { [key: string]: boolean }
) => {
  const { stores, client } = env;
  if (isOutSide) {
    stores.model.setListModalVisible(false);

    client.put(`${ROUTER_MAP.comList}/model`, {
      name: 'visible',
      value: false
    });
  }
};
