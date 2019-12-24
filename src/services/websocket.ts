export interface IPayload {
  'block-hash': string;
  'parent-hashes': string[];
  'justification-hashes': string[][];
  'deploy-ids'?: string[];
  creator: string;
  'seq-num': number;
}
export const getMsgFromRNode = (url: string): Promise<{ event: string; payload: IPayload }> => {
  const connection = new WebSocket(url);
  console.log('监听 RNode', connection);
  connection.onopen = _ => {
    console.log(`RNODE Socket connected`);
  };

  connection.onclose = _ => {
    console.log(`RNODE Socket closed`);
  };

  return new Promise((resolve, reject) => {
    connection.onmessage = ({ data }: any) => {
      resolve(JSON.parse(data));
    };
    connection.onerror = err => {
      reject(err);
    };
  });
};
