import { checkBalance_rho, transferFunds_rho } from './rho';
import { getDataForDeploy, sendDeploy } from './deploy';
import { Uint8ArrayToString } from '@/utils/utils';
// import { bufferToHex } from 'ethereumjs-util';

/**
 * Check Balance Function
 */
export const checkRevBalance = async (address: string, privateKey: string, url: string) => {
  const deployCode = checkBalance_rho(address);
  // @ts-ignore
  const [res, { sig }] = await sendDeploy(url, deployCode, privateKey);
  // @ts-ignore
  const deployId = res.match(/:(.*)$/)[1].replace(/\s/, '');

  // const x = sig;
  // console.log('sig', bufferToHex(x));
  console.log(sig);
  const balance = await getDataForDeploy(url, sig);
  return {
    balance,
    deployId,
  };
};

/**
 * Transfer token Function
 */
export const transferToken = async (
  fromAddr: string,
  toAddr: string,
  amount: number,
  privateKey: string,
  url: string,
) => {
  const deployCode = transferFunds_rho(fromAddr, toAddr, amount);

  try {
    const [response] = await sendDeploy(url, deployCode, privateKey.replace(/^0x/, ''));
    return response;
  } catch (e) {
    console.error(e);
  }
};
