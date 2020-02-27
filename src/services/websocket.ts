import { getItem, setItem, Uint8ArrayToString } from '@/utils/utils';

export interface IPayload {
  'block-hash': string;
  'parent-hashes': string[];
  'justification-hashes': string[][];
  'deploy-ids'?: string[];
  creator: string;
  'seq-num': number;
}
let connection: WebSocket = undefined;

/**
 * Get rnode WebSocket Instance
 * @param observer string Observer rnode url
 */
export const rnodeWebSocket = (observer: string): WebSocket => {
  if (!!connection) {
    return connection;
  }
  connection = new WebSocket(observer.replace('http', 'ws') + '/ws/events');
  connection.onopen = _ => {
    console.log(`rnode Socket connected!`);
  };

  connection.onclose = _ => {
    console.log(`RNODE Socket closed!`);
  };
  connection.onmessage = async ({ data }: any) => {
    const { event, payload } = JSON.parse(data);
    console.log(event, payload);

    const deployId = getItem('deployId');
    // 如果发现有部署合约
    if (
      deployId &&
      payload &&
      payload['deploy-ids'] &&
      payload['deploy-ids'].indexOf(deployId) > -1
    ) {
      global.g_app._store.dispatch({ type: 'wallet/checkBalance' });
    }
  };

  connection.onerror = e => {
    console.log(`RNODE error`, e);
  };
  return connection;
};
