declare global {
  namespace NodeJS {
    export interface Global {
      rnodeWS: any;
      rnodeWSUrl: string;
    }
  }
}

const initWebSocket = (url: string) => {
  const connection = new WebSocket(url);
  connection.onopen = _ => {
    console.log(`RNODE Socket connected`);
  };

  connection.onclose = _ => {
    console.log(`RNODE Socket closed`);
  };

  connection.onerror = err => {
    console.error(`RNODE_WS_ERROR`, err);
  };
  global.rnodeWS = connection;
  global.rnodeWSUrl = url;
  return connection;
};
export const rnodeWS = (url: string) => {
  if (!global.rnodeWS) {
    console.log('ws 初始化 - url:', url);
    return initWebSocket(url);
  }
  console.log(global.rnodeWSUrl, url);
  if (global.rnodeWSUrl === url) {
    console.log('URL相同 - url:', url);
    console.log(global.rnodeWS);

    return global.rnodeWS;
  }
  console.log('URL改变 - url:', url);
  global.rnodeWS.close();
  return initWebSocket(url);
};
