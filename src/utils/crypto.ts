import CryptoJS from 'crypto-js';

const secretPassphrase = 'UFHED@*#RYFUCJ!SKSL@*FH!(#Y$!#)TU'; //密钥

// Encrypt 加密
export const encrypt = (data: string) => {
  return CryptoJS.AES.encrypt(data, secretPassphrase).toString();
};
export const decrypt = (data: string) => {
  const bytes = CryptoJS.AES.decrypt(data, secretPassphrase);
  return bytes.toString(CryptoJS.enc.Utf8);
};
