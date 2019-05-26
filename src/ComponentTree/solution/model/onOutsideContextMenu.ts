import { message } from 'antd';
import { getValueByPath } from 'ide-lib-utils';
import { IStoresEnv, hasEtteException } from 'ide-lib-base-component';

import { IStoresModel } from 'ide-lib-engine';
import { ROUTER_MAP } from '../../router/helper';

const shouldViewList = ['createSub', 'createUp', 'createDown'];

/**
 * 显示 list 列表项
 * @param env - IStoresEnv
 */
export const hideContextMenu = (env: IStoresEnv<IStoresModel>) => async (
  e: MouseEvent,
  isOutSide: boolean,
  detail: { [key: string]: boolean }
) => {
  const { stores, client } = env;

  if (isOutSide) {
    stores.model.setMenuModalVisible(false); // 让 menu 隐藏

    // 同时更新 菜单属性
    client.put(`${ROUTER_MAP.contextMenu}/menu`, {
      name: 'visible',
      value: false
    });
  }
};
