import { setItem } from '@/utils/utils';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

export const accountLogin = (username: string) => {
  setItem('currentUser', username);
  setItem('lastLogin', new Date().valueOf());
};
