import { checkBalance_rho, transferFunds_rho } from './rho';
import {  sendDeploy } from './deploy';

/**
 * Check Balance Function
 */
export const deployCheckBalance = async (address: string, privateKey: string, url: string) => {
  const deployCode = checkBalance_rho(address);

  const {
    result,
    deploy: { sig },
  } = await sendDeploy(url, deployCode, privateKey);

  const match = result && result.match(/:(.*)$/);
  const deployId = match && match[1] && match[1].replace(/\s/, '');

  return { deployId, sig };
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

  const { result } = await sendDeploy(url, deployCode, privateKey);
  return result;
};
