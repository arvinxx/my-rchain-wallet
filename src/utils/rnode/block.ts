import { getItem } from '@/utils/utils';
import { rnode } from '@/utils/rnode/deploy';

export const getBlockDepth = async (rnodeUrl: string) => {
  const { getBlocks } = rnode(rnodeUrl);

  const blocks = await getBlocks({ depth: 1 });

  const { blockinfo } = blocks[0];
  const currentBlockNumber: number = (blockinfo && (blockinfo.blocknumber as number)) || 0;
  const { blockNumber = 0 } = getItem('checkBalanceContact');

  return currentBlockNumber - blockNumber + 2;
};
