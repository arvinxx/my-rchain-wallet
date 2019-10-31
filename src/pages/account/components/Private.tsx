import React, { Component } from 'react';
import { Typography, Button, Switch } from 'antd';
import styles from './Private.less';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';

import { DispatchProps } from '@/models/connect';

const { Text, Title } = Typography;

export interface PrivateProps extends DispatchProps {
  analytics: boolean;
}
export default class Private extends Component<PrivateProps> {
  switchAnalytics = (analytics: boolean) => {
    this.props.dispatch({
      type: 'global/save',
      payload: { analytics },
      meta: {
        mixpanel: {
          event: analytics ? null : '关闭Analytics',
        },
      },
    });
  };
  showExport = () => {
    this.props.dispatch({
      type: 'global/save',
      payload: { exports: true },
      meta: {
        mixpanel: {
          event: '导出助记词',
        },
      },
    });
  };

  render() {
    const { analytics } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.block}>
          <div className={styles.title}>
            <Title level={3}>
              <FormattedMessage id={'account.components.private.mnemonic'} />
            </Title>
            <Text type={'secondary'}>
              <FormattedMessage id={'account.components.private.mnemonic.desc'} />
            </Text>
          </div>
          <Button className={styles.phraseButton} type={'default'} onClick={this.showExport}>
            <FormattedMessage id={'account.components.private.mnemonic.button'} />
          </Button>
        </div>
        <div className={styles.block}>
          <div className={styles.title}>
            <Title level={3}>
              <FormattedMessage id={'account.components.private.analytics'} />
            </Title>
            <Text type={'secondary'}>
              <FormattedMessage id={'account.components.private.analytics.desc'} />
            </Text>
          </div>
          <div className={styles.switch}>
            <Switch onChange={this.switchAnalytics} checked={analytics} />
            <Text strong={true} style={{ fontSize: 16, marginLeft: 8 }}>
              <FormattedMessage
                id={`account.components.private.analytics.switch.${analytics ? 'on' : 'off'}`}
              />
            </Text>
          </div>
        </div>
      </div>
    );
  }
}
