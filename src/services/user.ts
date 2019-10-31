import request from '@/utils/request';
import { getDecryptedItem, getItem } from '@/utils/utils';
import { IAccount } from '@/services/account';

export const query = (): IAccount[] => {
  return getDecryptedItem('userList');
};

export const queryCurrent = (): IAccount | undefined => {
  const currentUser = getItem('currentUser');
  if (!currentUser) {
    return;
  }
  getDecryptedItem('userList');
  const userList: IAccount[] = getDecryptedItem('userList');
  return userList.find(user => user.username === currentUser);
};

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}

export const transfer = async () => {
  //TODO: make the rev transfer
};
