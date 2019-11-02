import React, { Component } from 'react';
import styles from './Network.less';
import { Button, Typography } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';


const { Title, Text } = Typography;
interface INetworkInnerProps {}

interface INetworkProps extends INetworkInnerProps {}

export default class Network extends Component<INetworkProps> {
  static defaultProps: INetworkInnerProps;

  render() {
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
      </div>
    );
  }
}
