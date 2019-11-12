import React, { Component } from 'react';
import styles from './Network.less';
import { Button, Radio, Typography } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import { DispatchProps } from '@/models/connect';
import { INetList } from '@/models/global';

const { Title, Text } = Typography;

interface INetworkInnerProps extends DispatchProps {}

interface INetworkProps extends INetworkInnerProps {
  network: string;
  netList: INetList;
}

export default class Network extends Component<INetworkProps> {
  static defaultProps: INetworkInnerProps;
  state = {
    value: 1,
  };

  onChange = e => {
    this.props.dispatch({
      type: 'global/changeNetwork',
      payload: e.target.value,
    });
  };

  render() {
    const { network, netList } = this.props;
    const { testNetList } = netList;
    return (
      <div className={styles.container}>
        <div className={styles.block}>
          <div className={styles.title}>
            <Title level={3}>
              <FormattedMessage id={'account.components.network.title'} />
            </Title>
            <Text type={'secondary'}>
              <FormattedMessage id={`account.components.network.desc`} />
            </Text>
          </div>
        </div>
        <div className={styles.block}>
          <Title level={4}>
            <FormattedMessage id={'account.components.network.title.test'} />
          </Title>
          <Radio.Group onChange={this.onChange} value={network}>
            {testNetList.map((net, index) => (
              <Radio
                key={net}
                className={styles.radio}
                value={`https://testnet-${index}.grpc.rchain.isotypic.com`}
              >
                {net}
              </Radio>
            ))}
            <Radio className={styles.radio} value={`http://localhost:44401`}>
              localhost
            </Radio>
          </Radio.Group>
        </div>
      </div>
    );
  }
}
