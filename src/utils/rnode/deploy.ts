import { doDeploy, getBlocks } from '@/services/rnode';

export const sendDeploy = async (url: string, code: string): Promise<{ result?: string }> => {
  const blocks = await getBlocks(1);

  console.log(blocks);
  const { blockNumber } = blocks[0];

  // Create deploy
  const deployData = {
    term: code,
    phloLimit: 100e4,
    phloPrice: 1,
    validAfterBlockNumber: blockNumber,
  };

  // Send deploy
  const res = await doDeploy(deployData);
  console.log(res);

  // Deploy response
  // return { result };
};
