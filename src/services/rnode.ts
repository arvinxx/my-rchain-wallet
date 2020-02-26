import request from 'umi-request';
import { checkBalance_rho } from '@/utils/rnode/rho';
import { getItem } from '@/utils/utils';
import { IConnection } from '@/models/global';

export const checkBalance = (address: string) => {
  const { observer } = getItem('connection') as IConnection;
  return request.post(observer + '/api/explore-deploy', {
    data: checkBalance_rho(address),
  });
};
export const getBlocks = (depth: number) => {
  const { observer } = getItem('connection') as IConnection;
  return request(observer + '/api/blocks/' + depth);
};
export const doDeploy = (data: any) => {
  const { validator } = getItem('connection') as IConnection;
  return request.post(validator + '/api/doDeploy', { data });
};
