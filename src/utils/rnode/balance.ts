import grpcWeb from 'grpc-web';
import { ec } from 'elliptic';
import protoSchema from './rnode-grpc-gen/js/pbjs_generated.json';

import { rnodeDeploy, rnodePropose, signDeploy } from '@tgrospic/rnode-grpc-js';
import { checkBalance_rho } from './rho';

const rnode = (rnodeUrl: string) => {
  // Instantiate http clients
  const options = { grpcLib: grpcWeb, host: rnodeUrl, protoSchema };

  // Get RNode service methods
  const { doDeploy, listenForDataAtName } = rnodeDeploy(options);
  const { propose } = rnodePropose(options);
  return { DoDeploy: doDeploy, propose, listenForDataAtName };
};

const sendDeploy = async (rnodeUrl: string, code: string, privateKey?: string) => {
  const { DoDeploy, propose } = rnode(rnodeUrl);
  // Deploy signing key
  const secp256k1 = new ec('secp256k1');
  const key = privateKey || secp256k1.genKeyPair();
  // Create deploy
  const deployData = {
    term: code,
    phlolimit: 100e3,
    // TEMP: in RNode v0.9.16 'valid after block number' must be zero
    // so that signature will be valid.
    // Future versions will require correct block number.
    validafterblocknumber: 0,
  };
  // Sign deploy
  const deploy = signDeploy(key, deployData);
  // Send deploy
  const { result } = await DoDeploy(deploy);
  // Try to propose but don't throw on error
  try {
    const resPropose = await propose();
  } catch (error) {
    console.warn(error);
  }
  // Deploy response
  return [result, deploy];
};

const getDataForDeploy = async (rnodeUrl: string, deployId: string) => {
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

const checkBalanceEv = async (address: string, url: string) => {
  const deployCode = checkBalance_rho(address);
  const [response, { sig }] = await sendDeploy(url, deployCode);
  console.log('response', response);
  return await getDataForDeploy(url, sig);
};
