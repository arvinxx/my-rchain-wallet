declare global {
  namespace NodeJS {
    export interface Global {
      rnodeWS: any;
      rnodeWSUrl: string;
    }
  }
}

export const getMsgFromRNode = (url: string): Promise<{ event: string; payload: object }> => {
  const connection = new WebSocket(url);
  console.log('监听 RNode', connection);
  connection.onopen = _ => {
    console.log(`RNODE Socket connected`);
  };

  connection.onclose = _ => {
    console.log(`RNODE Socket closed`);
  };

  global.rnodeWS = connection;
  global.rnodeWSUrl = url;
  return new Promise((resolve, reject) => {
    connection.onmessage = ({ data }: any) => {
      resolve(JSON.parse(data));
    };
    connection.onerror = err => {
      reject(err);
    };
  });
};
