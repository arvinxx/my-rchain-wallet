import { transferFunds_rho } from './rho';
import { sendDeploy } from './deploy';

/**
 * Transfer token Function
 */
export const transferToken = async (
  fromAddr: string,
  toAddr: string,
  amount: number,
  url: string,
) => {
  const deployCode = transferFunds_rho(fromAddr, toAddr, amount);

  const { result } = await sendDeploy(url, deployCode);
  // return result;
};
