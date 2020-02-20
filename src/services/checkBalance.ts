import request from 'umi-request';
import { checkBalance_rho } from '@/utils/rnode/rho';

export const checkBalance = (address: string) => {
  return request.post('http://34.66.209.49:40403/api/explore-deploy', {
    data: checkBalance_rho(address),
  });
};
