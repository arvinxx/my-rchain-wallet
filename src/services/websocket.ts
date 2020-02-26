import { getItem, setItem, Uint8ArrayToString } from '@/utils/utils';

export interface IPayload {
  'block-hash': string;
  'parent-hashes': string[];
  'justification-hashes': string[][];
  'deploy-ids'?: string[];
  creator: string;
  'seq-num': number;
}
export const getMsgFromRNode = (url: string, rnodeUrl: string): void => {
  const connection = new WebSocket(url);
  connection.onopen = _ => {
    console.log(`rnode Socket connected!`);
  };

  connection.onclose = _ => {
    console.log(`RNODE Socket closed!`);
  };
  connection.onmessage = async ({ data }: any) => {
    const { event, payload } = JSON.parse(data);
    console.log(event, payload);
    if (event === 'block-added') {
      global.g_app._store.dispatch({ type: 'wallet/addBlockNumber' });
    }
    const item = getItem('checkBalanceContact');
    const { deployId } = item;

    // 如果发现有部署合约
    if (
      deployId &&
      payload &&
      payload['deploy-ids'] &&
      payload['deploy-ids'].indexOf(deployId) > -1
    ) {
      const hash = payload['block-hash'];
      // const { blockinfo } = await getBlock(rnodeUrl, hash);
      // const blockNumber = blockinfo && blockinfo.blockinfo.blocknumber;
      // if (blockinfo && blockinfo.blockinfo.seqnum) {
      //   setItem('checkBalanceContact', {
      //     ...item,
      //     blockNumber: blockNumber,
      //     status: 'success',
      //   });
      //   global.g_app._store.dispatch({ type: 'wallet/getBalance' });
      //   connection.close();
      // }
    }
  };

  connection.onerror = e => {
    console.log(`RNODE error`, e);
  };
};
