import { parse } from 'querystring';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

type ILocalData = 'currentUser' | 'userList' | 'mnemonic' | 'restore' | 'privateKey';

export const setItem = (key: ILocalData, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};
export const getItem = (key: ILocalData) => {
  const res = localStorage.getItem(key);
  if (res) {
    return JSON.parse(res);
  }
};

export const copyToClipboard = (string: string): boolean => {
  const tempInput = document.createElement('input'); //create temp input
  document.body.appendChild(tempInput); // add tempInput to DOM
  tempInput.value = string;
  tempInput.focus();
  // get selection
  if (tempInput.setSelectionRange) tempInput.setSelectionRange(0, tempInput.value.length);
  else tempInput.select();
  let flag;
  try {
    flag = document.execCommand('copy'); // Exec Copy
  } catch (e) {
    flag = false;
  }
  document.body.removeChild(tempInput); // Delete TempInput

  return flag;
};
