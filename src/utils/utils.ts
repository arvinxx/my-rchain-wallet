import { parse } from 'querystring';
import { decrypt, encrypt } from './crypto';
import identicon from 'identicon.js';
import mixpanel from 'mixpanel-browser';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);
export const getUID = () => {
  const s = [];
  const hexDigits = '0123456789abcdef';
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4';
  // @ts-ignore
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = '-';
  return s.join('');
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);

type ILocalData =
  | 'currentUser'
  | 'restore'
  | 'lastLogin'
  | 'network'
  | 'grpc'
  | 'http'
  | 'check_balance_deploy_id'
  | 'check_balance_sig';
type IEncryptedData = 'userList' | 'mnemonic' | 'privateKey';

export const generateAvatar = (string: string = '') => {
  const data = new identicon(string);
  return `data:image/png;base64,${data}`;
};

export const setItem = (key: ILocalData, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getItem = (key: ILocalData) => {
  const res = localStorage.getItem(key);
  if (res) {
    return JSON.parse(res);
  }
};

export const setEncryptedItem = (key: IEncryptedData, value: any) => {
  const encryptedData = encrypt(JSON.stringify(value));
  localStorage.setItem(key, encryptedData);
};

export const getDecryptedItem = (key: IEncryptedData) => {
  const res = localStorage.getItem(key) as string;
  if (res) {
    const des = decrypt(res);
    return des ? JSON.parse(des) : undefined;
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
  mixpanel.track('复制地址');
  return flag;
};

export const Uint8ArrayToString = (fileData: Uint8Array) => {
  var dataString = '';
  for (var i = 0; i < fileData.length; i++) {
    dataString += String.fromCharCode(fileData[i]);
  }

  return dataString;
};

export const stringToUint8Array = (str: string) => {
  var arr = [];
  for (var i = 0, j = str.length; i < j; ++i) {
    arr.push(str.charCodeAt(i));
  }
  return new Uint8Array(arr);
};
