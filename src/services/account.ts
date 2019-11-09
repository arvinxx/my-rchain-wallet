import {
  getKeyPairFromMnemonic,
  getMnemonic,
  getTwoTypeAddrFromPublicKey,
  getPublicKeyFromPrivateKey,
  getRevAddressFromPublicKey,
} from '@/utils/blockchain';

export interface IAccount {
  address: string;
  ethAddr: string;
  privateKey: string;
  pwd: string;
  uid: string;
  username: string;
  mnemonic?: string;
  avatar: string;
  balanceId: string;
  userid: string;
  transferId: string;
}
export const getAccountFromPrivateKey = (privateKey: string) => {
  const publicKey = getPublicKeyFromPrivateKey(privateKey);
  const res = getTwoTypeAddrFromPublicKey(publicKey);
  if (!res) {
    return;
  }
  const { revAddr, ethAddr } = res;
  return { address: revAddr, ethAddr };
};

export const getAccountFromMnemonic = (mnemonic: string) => {
  const keyPair = getKeyPairFromMnemonic(mnemonic);
  const { privateKey, publicAddress } = keyPair;
  const revAddr = getRevAddressFromPublicKey(publicAddress);
  return { privateKey, revAddr, ethAddr: publicAddress };
};
