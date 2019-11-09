import { checkBalance_rho } from './rho';
import { getDataForDeploy, sendDeploy } from './deploy';

export const checkRevBalance = async (address: string, privateKey: string, url: string) => {
  const deployCode = checkBalance_rho(address);
  const [response, { sig }] = await sendDeploy(url, deployCode, privateKey);
  console.log('response', response);
  return await getDataForDeploy(url, sig);
};
