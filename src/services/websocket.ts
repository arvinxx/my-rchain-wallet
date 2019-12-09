export const startRNodeWs = (rnodeUrl: string) => {
  var connection = new WebSocket(rnodeUrl);

  connection.onopen = _ => {
    console.log(`RNODE Socket connected`);
  };

  connection.onclose = _ => {
    console.log(`RNODE Socket closed`);
  };

  connection.onerror = err => {
    console.error(`RNODE_WS_ERROR`, err);
  };

  connection.onmessage = ({ data }) => {
    const { event, payload } = JSON.parse(data);
    // console.log('RNODE_EVENT', event, payload);

    const deployId = localStorage.getItem('check_balance');

    if (deployId === payload['deploy-ids']) {
      console.log('success');
    }
    payload && console.log('DEPLOYS', payload['deploy-ids']);
  };
};
