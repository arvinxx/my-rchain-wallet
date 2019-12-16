import { checkBalance_rho, transferFunds_rho } from './rho';
import { getDataForDeploy, sendDeploy } from './deploy';
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

  const balance = await getDataForDeploy(url, sig);
  console.log('getDataForDeploy', balance);

  return {
    // balance,
    deployId,
    sig,
  };
};
/**
 * get Balance Function
 */
export const getRevBalance = async (sig: string, url: string) => {
  return await getDataForDeploy(url, sig);
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
