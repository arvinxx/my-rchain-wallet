import React, { FC } from 'react';
import Icon, { CopyFilled, ReloadOutlined } from '@ant-design/icons';
import {
  Badge,
  Card,
  Typography,
  Tag,
  Button,
  Statistic,
  Tooltip,
  Avatar,
  message,
  Spin,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import { showHiddenAddress } from '@/utils/blockchain';
import { CurrentUser } from '@/models/user';
import { WalletModelState } from '@/models/wallet';
import { copyToClipboard } from '@/utils/utils';
import { router } from 'umi';
import { AvatarSvg } from '@/components';
import { ConnectState } from '@/models/connect';
import { useDispatch, useSelector } from 'dva';
import styles from './Account.less';

const { Text } = Typography;

interface IAccountProps {
  loading: boolean;
  open: () => void;
}

const Account: FC<IAccountProps> = ({ open, loading }) => {
  const dispatch = useDispatch();
  const { revBalance, checkStatus } = useSelector<ConnectState, WalletModelState>(
    state => state.wallet,
  );
  const currentUser = useSelector<ConnectState, CurrentUser>(state => state.user.currentUser);

  const { username, address } = currentUser;

  const copy = () => {
    const { address } = currentUser;
    copyToClipboard(address);
    message.success(formatMessage({ id: 'dashboard.account.copy.success' }), 0.5);
  };

  const navigate = (type: string) => () => {
    router.push('transfer');
  };

  return (
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
          <Avatar
            icon={<AvatarSvg key={username + address} size={50} />}
            className={styles.avatar}
          />
          <Text style={{ fontSize: 16, marginTop: 8 }}>{username}</Text>
          <Tooltip
            placement={'bottom'}
            title={formatMessage({ id: 'dashboard.account.address.tip' })}
          >
            <div
              onClick={copy}
              className={styles.address}
              style={{ marginTop: 4, marginBottom: 16 }}
            >
              <Text type={'secondary'}>{showHiddenAddress(address)}</Text>
              <CopyFilled style={{ marginLeft: 4 }} className={styles.icon} />
            </div>
          </Tooltip>
          <Tag onClick={open} className={styles.view}>
            {formatMessage({ id: 'dashboard.account.view' })}
          </Tag>
        </div>
        <div className={styles.operation}>
          <div className={styles.money}>
            {checkStatus === 'error' ? (
              <>
                <div style={{ marginTop: 16, marginBottom: 16 }}>
                  <Tooltip title={formatMessage({ id: 'dashboard.account.balance.deploy' })}>
                    <ReloadOutlined
                      style={{
                        fontSize: 20,
                      }}
                      className={styles.reload}
                      onClick={() => {
                        dispatch({
                          type: 'wallet/checkBalance',
                        });
                      }}
                    />
                  </Tooltip>
                </div>
              </>
            ) : checkStatus !== 'success' || loading ? (
              <>
                <div style={{ marginTop: 16, marginBottom: 16 }}>
                  <Spin />
                </div>
              </>
            ) : (
              <>
                <Statistic
                  title={
                    <>
                      {formatMessage({ id: 'dashboard.account.balance' })}
                      <Tooltip title={formatMessage({ id: 'dashboard.account.balance.deploy' })}>
                        <ReloadOutlined
                          className={styles.reload}
                          onClick={() => {
                            dispatch({
                              type: 'wallet/checkBalance',
                            });
                          }}
                        />
                      </Tooltip>
                    </>
                  }
                  className={styles.balance}
                  precision={4}
                  value={revBalance === 0 ? 0 : revBalance}
                  suffix="REV"
                />
                {/*<Text type={'secondary'}>$ {balance * 7} USD</Text>*/}
              </>
            )}
            <div>
              <Badge count={5} status={checkStatus} />
              <Text type={'secondary'}>
                {formatMessage({ id: `dashboard.account.balance.${checkStatus}` })}
              </Text>
            </div>
          </div>
          <div className={styles.button}>
            <Button type={'primary'} className={styles.receive}>
              <FormattedMessage id={'dashboard.account.button.receive'} />
            </Button>
            <Button type={'primary'} className={styles.send} onClick={navigate('send')}>
              <FormattedMessage id={'dashboard.account.button.send'} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
export default Account;
