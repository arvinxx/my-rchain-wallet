import request from 'umi-request';
import { getItem } from '@/utils/utils';
import { IConnection } from '@/models/global';

export const exploreDeploy = data => {
  const { observer } = getItem('connection') as IConnection;
  return request.post(observer + '/api/explore-deploy', { data });
};

export const getBlocks = (depth: number) => {
  const { observer } = getItem('connection') as IConnection;
  return request(observer + '/api/blocks/' + depth);
};

interface DeployData {
  term: string;
  timestamp: number | Long /* int64 */;
  phloPrice: number | Long /* int64 */;
  phloLimit: number | Long /* int64 */;
  validAfterBlockNumber: number | Long /* int64 */;
}

interface DeployRequest {
  data: DeployData;
  deployer: string;
  signature: string;
  sigAlgorithm: string;
}

export const doDeploy = (data: DeployRequest) => {
  const { validator } = getItem('connection') as IConnection;
  return request.post(validator + '/api/deploy', { data });
};

export const getDeployInfo = (deployId: string) => {
  const { validator } = getItem('connection') as IConnection;
  return request(validator + '/api/deploy/' + deployId);
};
