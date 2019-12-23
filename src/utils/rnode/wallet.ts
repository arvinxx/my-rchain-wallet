import { checkBalance_rho, transferFunds_rho } from './rho';
import { getDataForDeploy, sendDeploy } from './deploy';

/**
 * Check Balance Function
 */
export const deployCheckBalance = async (
  address: string,
  privateKey: string,
  url: string,
) => {
  const deployCode = checkBalance_rho(address);
  // @ts-ignore
  const [res, { sig }] = await sendDeploy(url, deployCode, privateKey);
  // @ts-ignore
  const deployId = res.match(/:(.*)$/)[1].replace(/\s/, '');
  return { deployId, sig };
};
/**
 * get Balance Function
 */
export const getRevBalance = async (sig: Uint8Array, url: string) => {
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
    const [response] = await sendDeploy(url, deployCode, privateKey);
    return response;
  } catch (e) {
    console.error(e);
  }
};
