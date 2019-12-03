import { checkBalance_rho, transferFunds_rho } from './rho';
import { getDataForDeploy, sendDeploy } from './deploy';

/**
 * Check Balance Function
 */
export const checkRevBalance = async (address: string, privateKey: string, url: string) => {
  const deployCode = checkBalance_rho(address);
  // @ts-ignore
  const [_, { sig }] = await sendDeploy(url, deployCode, privateKey);
  const balance = await getDataForDeploy(url, sig);
  return { balance };
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
