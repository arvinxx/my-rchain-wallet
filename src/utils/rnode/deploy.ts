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
  const { doDeploy, listenForDataAtName } = rnodeDeploy(options);
  const { propose } = rnodePropose(options);
  return { DoDeploy: doDeploy, propose, listenForDataAtName };
};

export const sendDeploy = async (rnodeUrl: string, code: string, privateKey: string) => {
  const { DoDeploy, propose } = rnode(rnodeUrl);

  // Deploy signing key
  const key = privateKey;
  // Create deploy
  const deployData = {
    term: code,
    phlolimit: 100e3,
    // TODO
    // TEMP: in RNode v0.9.16 'valid after block number' must be zero
    // so that signature will be valid.
    // Future versions will require correct block number.
    validafterblocknumber: 1,
  };

  // Sign deploy
  const deploy = signDeploy(key, deployData);
  // Send deploy
  const { result } = await DoDeploy(deploy);
  // Try to propose but don't throw on error
  try {
    const resPropose = await propose();
    console.log(resPropose);
  } catch (error) {
    console.warn(error);
  }
  // Deploy response
  return [result, deploy];
};

export const getDataForDeploy = async (rnodeUrl: string, deployId: any) => {
  const { listenForDataAtName } = rnode(rnodeUrl);
  const {
    payload: { blockinfoList },
  } = await listenForDataAtName({
    depth: -1,
    name: { unforgeablesList: [{ gDeployIdBody: { sig: deployId } }] },
  });
  // Get data as number
  return blockinfoList.length && blockinfoList[0].postblockdataList[0].exprsList[0].gInt;
};
