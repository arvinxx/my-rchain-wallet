import grpcWeb from 'grpc-web';
import protoSchema from '@rnode/js/pbjs_generated.json';

// Import generated protobuf types (in global scope)
import '@rnode/js/DeployServiceV1_pb';
import '@rnode/js/ProposeServiceV1_pb';

import { rnodeDeploy, rnodePropose, signDeploy } from '@tgrospic/rnode-grpc-js';

const rnode = (rnodeUrl: string) => {
  // Instantiate http clients
  const options = { grpcLib: grpcWeb, host: rnodeUrl, protoSchema };

  // Get RNode service methods
  const { doDeploy, listenForDataAtName, getBlocks } = rnodeDeploy(options);
  const { propose } = rnodePropose(options);
  return { DoDeploy: doDeploy, propose, listenForDataAtName, getBlocks };
};

export const sendDeploy = async (rnodeUrl: string, code: string, privateKey: string) => {
  const { DoDeploy, propose, getBlocks } = rnode(rnodeUrl);

  const blocks = await getBlocks({ depth: 1 });

  const { blockinfo } = blocks[0];
  const validafterblocknumber = (blockinfo && blockinfo.blocknumber) || 0;

  // Deploy signing key
  const key = privateKey;
  // Create deploy
  const deployData = {
    term: code,
    phlolimit: 100e4,
    phloprice: 2,
    validafterblocknumber,
  };

  // Sign deploy
  const deploy = signDeploy(key, deployData);
  // Send deploy
  const { result } = await DoDeploy(deploy);
  // Try to propose but don't throw on error
  try {
    await propose();
  } catch (error) {
    console.warn(error);
  }
  // Deploy response
  return [result, deploy];
};

export const getDataForDeploy = async (rnodeUrl: string, deployId: Uint8Array) => {
  const { listenForDataAtName } = rnode(rnodeUrl);
  const {
    // @ts-ignore
    payload: { blockinfoList },
  } = await listenForDataAtName({
    depth: -1,
    name: { unforgeablesList: [{ gDeployIdBody: { sig: deployId } }] },
  });

  // Get data as number
  return blockinfoList.length && blockinfoList[0].postblockdataList[0].exprsList[0].gInt;
};
