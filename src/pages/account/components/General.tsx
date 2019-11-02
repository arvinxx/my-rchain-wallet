import React, { Component } from 'react';
import styles from './General.less';
import { Button, InputNumber, Typography } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import { DispatchProps } from '@/models/connect';

const { Title, Text } = Typography;

interface IGeneralInnerProps {}

interface IGeneralProps extends DispatchProps {
  lockTime: number;
}

export default class General extends Component<IGeneralProps> {
  static defaultProps: IGeneralInnerProps;

  onChange = (lockTime: number) => {
    this.props.dispatch({
      type: 'global/save',
      payload: { lockTime },
    });
  };

  render() {
    const { lockTime } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.block}>
          <div className={styles.title}>
            <Title level={3}>
              <FormattedMessage id={'account.components.general.lock-time'} />
            </Title>
            <Text type={'secondary'}>
              <FormattedMessage id={'account.components.general.lock-time.desc'} />
            </Text>
          </div>
          <InputNumber value={lockTime} onChange={this.onChange} />
        </div>
      </div>
    );
  }
}
