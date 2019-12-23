import React, { Component } from 'react';
import {
  Card,
  Typography,
  Tag,
  Button,
  Statistic,
  Tooltip,
  Icon,
  Avatar,
  message,
  Spin,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import { showHiddenAddress } from '@/utils/blockchain';
import { CurrentUser } from '@/models/user';
import { TDeployStatus } from '@/models/wallet';
import { copyToClipboard } from '@/utils/utils';
import { router } from 'umi';
import { DispatchProps } from '@/models/connect';
import { connect } from 'dva';
import styles from './Account.less';

const { Text } = Typography;

interface IAccountProps extends DispatchProps {
  currentUser: CurrentUser;
  loading: boolean;
  deployStatus: TDeployStatus;
  balance: number;
  open: () => void;
}

@connect()
export default class Account extends Component<IAccountProps> {
  copy = () => {
    const {
      currentUser: { address },
    } = this.props;

    copyToClipboard(address);
    message.success(formatMessage({ id: 'dashboard.account.copy.success' }), 0.5);
  };
  navigate = (type: string) => () => {
    console.log(type);
    router.push('transfer');
  };

  render() {
    const { currentUser, open, balance, dispatch, deployStatus } = this.props;
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
                {deployStatus !== 'success' ? (
                  <>
                    <div style={{ marginTop: 16, marginBottom: 24 }}>
                      <Spin />
                    </div>
                    <div>
                      <Text type={'secondary'}>
                        {formatMessage({ id: `dashboard.account.balance.${deployStatus}` })}
                      </Text>
                    </div>
                  </>
                ) : (
                  <>
                    <Statistic
                      title={
                        <>
                          {formatMessage({ id: 'dashboard.account.balance' })}
                          <Tooltip title={'重新部署余额合约'}>
                            <Icon
                              type={'reload'}
                              className={styles.reload}
                              onClick={() => {
                                dispatch({
                                  type: 'wallet/deployCheckBalance',
                                });
                              }}
                            />
                          </Tooltip>
                        </>
                      }
                      className={styles.balance}
                      value={balance}
                      suffix="REV"
                    />
                    {/*<Text type={'secondary'}>$ {balance * 7} USD</Text>*/}
                  </>
                )}
              </div>
              <div className={styles.button}>
                <Button type={'primary'} className={styles.receive}>
                  <FormattedMessage id={'dashboard.account.button.receive'} />
                </Button>
                <Button type={'primary'} className={styles.send} onClick={this.navigate('send')}>
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
