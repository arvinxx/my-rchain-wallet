import React, { Component } from 'react';
import { Card, Typography, Tag, Button, Tooltip, Icon, Avatar, message, Spin } from 'antd';
import styles from './Account.less';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import { showHiddenAddress } from '@/utils/blockchain';
import { CurrentUser } from '@/models/user';
import { copyToClipboard } from '@/utils/utils';

const { Text } = Typography;
interface IAccountProps {
  currentUser: CurrentUser;
  open: () => void;
}
export default class Account extends Component<IAccountProps> {
  copy = () => {
    const {
      currentUser: { address },
    } = this.props;

    copyToClipboard(address);
    message.success(formatMessage({ id: 'dashboard.account.copy.success' }), 0.5);
  };
  render() {
    const { currentUser, open } = this.props;
    if (!currentUser) {
      return <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />;
    }
    const { username, address, avatar } = currentUser;

    return (
      avatar && (
        <Card
          title={
            <div className={styles.title}>
              <div>
                <FormattedMessage id={'dashboard.account.title'} />
              </div>
            </div>
          }
          bordered={false}
          style={{ maxWidth: 550 }}
        >
          <div className={styles.account}>
            <div className={styles.user}>
              <Avatar src={avatar} className={styles.avatar} />

              <Text style={{ fontSize: 16, marginTop: 8 }}>{username}</Text>
              <Tooltip
                placement={'bottom'}
                title={formatMessage({ id: 'dashboard.account.address.tip' })}
              >
                <div
                  onClick={this.copy}
                  className={styles.address}
                  style={{ marginTop: 4, marginBottom: 16 }}
                >
                  <Text type={'secondary'}>{showHiddenAddress(address)}</Text>
                  <Icon
                    type={'copy'}
                    theme={'filled'}
                    style={{ marginLeft: 4 }}
                    className={styles.icon}
                  />
                </div>
              </Tooltip>
              <Tag onClick={open} className={styles.view}>
                {formatMessage({ id: 'dashboard.account.view' })}
              </Tag>
            </div>
            <div className={styles.operation}>
              <div className={styles.money}>
                <Text> {formatMessage({ id: 'dashboard.account.balance' })}</Text>
                <div className={styles.balance}>1,016,100 REV</div>
                <Text type={'secondary'}>$ 16,100 USD</Text>
              </div>
              <div className={styles.button}>
                <Button type={'primary'} className={styles.receive}>
                  <FormattedMessage id={'dashboard.account.button.receive'} />
                </Button>
                <Button type={'primary'} className={styles.send}>
                  <FormattedMessage id={'dashboard.account.button.send'} />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )
    );
  }
}
