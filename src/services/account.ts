import {
  getKeyPairFromMnemonic,
  getMnemonic,
  getPublicKeyFromPrivateKey,
  getRevAddressFromPublicKey,
} from '@/utils/blockchain';
import { getAddrFromPublicKey } from '@/utils/rnode';

export interface IAccount {
  address: string;
  ethAddr: string;
  privateKey: string;
  pwd: string;
  uid: string;
  username: string;
  mnemonic?: string;
  avatar: string;
}
export const getAccountFromPrivateKey = (privateKey: string) => {
  const publicKey = getPublicKeyFromPrivateKey(privateKey);
  const res = getAddrFromPublicKey(publicKey);
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
