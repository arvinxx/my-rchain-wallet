import { setItem } from '@/utils/utils';

export const accountLogin = (username: string) => {
  setItem('currentUser', username);
  setItem('lastLogin', new Date().valueOf());
};
