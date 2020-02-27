// Import generated protobuf types (in global scope)
import '@grpc/DeployServiceV1_pb';
import '@grpc/ProposeServiceV1_pb';

import grpcWeb from 'grpc-web';
import protoSchema from '@grpc/pbjs_generated.json';
import { rnodeDeploy, rnodePropose, signDeploy, DeployDataProto } from '@tgrospic/rnode-grpc-js';
import { IConnection } from '@/models/global';
import { getItem } from '@/utils/utils';
import { getBlocks } from '@/services/rnode/webAPI';

export const rnodeService = () => {
  // Instantiate http clients
  const { validator } = getItem<IConnection>('connection');

  const options = { grpcLib: grpcWeb, host: validator, protoSchema };

  // Get RNode service methods
  const { doDeploy, listenForDataAtName, getBlocks, getBlock, showMainChain } = rnodeDeploy(
    options,
  );

  const { propose } = rnodePropose(options);
  return { DoDeploy: doDeploy, propose, listenForDataAtName, getBlocks, getBlock, showMainChain };
};

/**
 * getDeployData
 * @param code you want to deploy
 * @param privateKey your private key
 */
export const getDeployData = async (code: string, privateKey: string): Promise<DeployDataProto> => {
  const blocks = await getBlocks(1);
  const { blockNumber } = blocks[0];

  // Deploy signing key
  const key = privateKey;
  // Create deploy
  const deployData = {
    term: code,
    phlolimit: 100e4,
    phloprice: 1,
    validafterblocknumber: blockNumber,
  };

  //Sign deploy
  return signDeploy(key, deployData);
};

const bytesToHex = (bytes: Uint8Array): string => {
  const hex: string[] = [];
  for (let i = 0; i < bytes.length; i++) {
    hex.push((bytes[i] >>> 4).toString(16));
    hex.push((bytes[i] & 0xf).toString(16));
  }
  return hex.join('');
};

export const getWebDeployData = (deploy: DeployDataProto) => ({
  data: {
    term: deploy.term,
    timestamp: deploy.timestamp,
    phloPrice: deploy.phloprice,
    phloLimit: deploy.phlolimit,
    validAfterBlockNumber: deploy.validafterblocknumber,
  },
  sigAlgorithm: deploy.sigalgorithm,
  signature: bytesToHex(deploy.sig),
  deployer: bytesToHex(deploy.deployer),
});
