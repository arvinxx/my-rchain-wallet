import { setItem } from '@/utils/utils';

export const accountLogin = (uid: string) => {
  setItem('currentUser', uid);
  setItem('lastLogin', new Date().valueOf());
};
