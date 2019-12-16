export const rnodeWs = (rnodeUrl: string) => {
  if (global.rnodeWs && global.rnodeWsUrl === rnodeUrl) {
    return global.rnodeWs;
  }
  const connection = new WebSocket(rnodeUrl);
  global.rnodeWsUrl = rnodeUrl;
  connection.onopen = _ => {
    console.log(`RNODE Socket connected`);
  };

  connection.onclose = _ => {
    console.log(`RNODE Socket closed`);
  };

  connection.onerror = err => {
    console.error(`RNODE_WS_ERROR`, err);
  };
  global.rnodeWs = connection;
  return connection;
  // connection.onmessage = ({ data }) => {
  //   const { event, payload } = JSON.parse(data);
  //   console.log('RNODE_EVENT', event, payload);
  //   const deployId = localStorage.getItem('check_balance');
  //
  //   if (payload && payload['deploy-ids'] && payload['deploy-ids'].indexOf(deployId) > -1) {
  //     console.log('success');
  //   }
  // };
};
