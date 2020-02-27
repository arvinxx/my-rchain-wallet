import { checkBalance_rho, transferFunds_rho } from './rho';
import { exploreDeploy, doDeploy, getDeployData, getWebDeployData } from './rnode';

export const checkBalance = async (address: string) => {
  return exploreDeploy(checkBalance_rho(address));
};

/**
 * Transfer Token Function
 */
export const transferToken = async (
  fromAddr: string,
  toAddr: string,
  amount: number,
  privateKey: string,
) => {
  // get transfer token
  const code = transferFunds_rho(fromAddr, toAddr, amount);

  // get deploy data
  const deploy = await getDeployData(code, privateKey.replace('0x', ''));

  // transfer to webData
  const webDeployData = getWebDeployData(deploy);

  // Send deploy and get response
  return await doDeploy(webDeployData);
};
