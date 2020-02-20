import request from 'umi-request';
import { checkBalance_rho } from '@/utils/rnode/rho';

export const checkBalance = (address: string) => {
  return request.post('https://rnode.myrchainwallet.com/api/explore-deploy', {
    data: checkBalance_rho(address),
  });
};
