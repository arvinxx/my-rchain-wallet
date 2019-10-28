import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { bufferToHex, toBuffer, pubToAddress, toChecksumAddress } from 'ethereumjs-util';
import hdkey from 'ethereumjs-wallet/hdkey';
import { fromPrivateKey } from 'ethereumjs-wallet';

import { getAddrFromEth } from '@/utils/rnode';

/**
 * generate Mnemonic Phrase
 */
export const getMnemonic = generateMnemonic;

/**
 * get key pair form  mnemonic phrase
 */
export const getKeyPairFromMnemonic = (mnemonic: string) => {
  let seed = mnemonicToSeedSync(mnemonic);

  let hdWallet = hdkey.fromMasterSeed(seed);

  // generate key pair in path m/44'/60'/0'/0/0
  let key = hdWallet.derivePath("m/44'/60'/0'/0/" + 0);
  // get private key from key pair
  const privateKey = bufferToHex(key._hdkey._privateKey);

  // get public key from key pair
  const publicKey = bufferToHex(key._hdkey._privateKey);

  // get eth address from key pair
  const publicAddressBuffer = pubToAddress(key._hdkey._publicKey, true);
  const publicAddress = toChecksumAddress(publicAddressBuffer.toString('hex'));

  return { privateKey, publicKey, publicAddress };
};

export const getRevAddressFromPublicKey = (publicKey: string) =>
  getAddrFromEth(publicKey) || getAddrFromEth(publicKey.replace(/^0x/, ''));

export const getPublicKeyFromPrivateKey = (privateKey: string) => {
  const wallet = fromPrivateKey(toBuffer(privateKey));
  return wallet.getPublicKeyString();
};
/**
 * transfer address to a hidden address
 * @param address
 * @param count charterer lengths of start and end
*/
export const showHiddenAddress = (address: string, count: number = 5) => {
  const prefix = address.slice(0, count);
  const suffix = address.slice(-count);
  return prefix + '*****' + suffix;
};
