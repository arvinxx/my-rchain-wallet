import { checkBalance_rho } from './rho';
import { getDataForDeploy, sendDeploy } from './deploy';

export const checkRevBalance = async (
  address: string,
  privateKey: string,
  url: string,
  balanceId?: string,
) => {
  let deployId = balanceId;
  if (!deployId) {
    const deployCode = checkBalance_rho(address);
    const [response] = await sendDeploy(url, deployCode, privateKey);
    deployId = response.match(/:(.*)$/)[1].replace(/\s/, '');
  }
  const balance = await getDataForDeploy(url, deployId);
  return { balance, deployId };
};
