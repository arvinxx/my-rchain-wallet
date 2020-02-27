import React, { FC, useEffect, useState } from 'react';
import { CaretDownOutlined } from '@ant-design/icons';
import {
  Card,
  Typography,
  Statistic,
  Input,
  Slider,
  InputNumber,
  Divider,
  Avatar,
  Button,
} from 'antd';
import styles from './style.less';
import { IconFont, BaseLoading, AvatarSvg } from '@/components';
import Confirm from './components/Confirm';

import { formatMessage, FormattedMessage } from 'umi-plugin-locale';

import { useDispatch, useSelector } from 'dva';
import { ConnectState, DispatchProps, UserModelState, WalletModelState } from '@/models/connect';
import { showHiddenAddress } from '@/utils/blockchain';

const { Text, Title } = Typography;
const marks = {
  0: formatMessage({ id: 'transfer.fee.slow' }),
  100: formatMessage({ id: 'transfer.fee.fast' }),
};

export interface ITransfer {
  type: string;
  timestamp: number;
  title: string;
  number: number;
  status: string;
}

interface IAccountDetailProps extends DispatchProps {
  user: UserModelState;
  wallet: WalletModelState;
  checkBalance: boolean;
}

@connect(({ user, wallet, loading }: ConnectState) => ({
  user,
  wallet,
  checkBalance: loading.effects['wallet/checkBalance'],
}))
const Transfer: FC<IAccountDetailProps> = () => {
  const dispatch = useDispatch();
  const { user, wallet } = useSelector<ConnectState, ConnectState>(state => state);
  const balanceLoading = useSelector<ConnectState, boolean>(
    state => state.loading.effects['wallet/checkBalance'],
  );
  const [visible, handleVisible] = useState<boolean>(false);
  const [amount, handleAmount] = useState<number>(0.01);
  const [toAddr, handleToAddr] = useState<string>(
    '11112dFk8NKkEyBdopURE1GhqjgwJSaaTMTWd31knXTfxxAjuJhgF9',
  );
  const [note, handleNote] = useState<string>('');

  useEffect(() => {
    dispatch({
      type: 'wallet/checkBalance',
    });
  }, []);

  const showModal = () => {
    dispatch({
      type: 'wallet/transfer',
      payload: { amount, toAddr },
    });
    // handleVisible(true);
  };

  const setMax = () => {
    const { revBalance, fee } = wallet;
    handleAmount(revBalance - fee);
  };
  const reset = () => {
    handleAmount(0);
    handleToAddr('');
  };

  const send = () => {
    dispatch({
      type: 'wallet/transfer',
      payload: { amount, toAddr },
    });
  };
  const hide = () => {
    handleVisible(false);
  };

  const { currentUser } = user;
  const { revBalance, fee, checkStatus } = wallet;
  const { address, username, pwd } = currentUser;

  return (
    <div className={styles.container}>
      <Confirm
        visible={visible}
        hide={hide}
        pwd={pwd}
        send={send}
        note={note}
        type={'payment'}
        address={address}
        toAddr={toAddr}
        amount={amount}
        fee={fee}
        dispatch={dispatch}
      />
      <Card className={styles.transfer} bordered={false}>
        <Title level={3}>
          <FormattedMessage id={'transfer.title'} />
        </Title>
        <div>
          <div className={styles.title}>
            <Text type={'secondary'}>
              <FormattedMessage id={'transfer.send-number.title'} />
            </Text>
          </div>
          <div className={styles.numberWrapper} style={{ display: 'flex' }}>
            <InputNumber
              className={styles.number}
              onChange={handleAmount}
              value={amount}
              size={'large'}
            />
            <Button type={'link'} onClick={setMax}>
              <FormattedMessage id={'transfer.send-number.max'} />
            </Button>
          </div>
        </div>
        <div>
          <div className={styles.title}>
            <Text type={'secondary'}>
              <FormattedMessage id={'transfer.send-address.title'} />
            </Text>
          </div>
          <div className={styles.send}>
            <Avatar icon={<AvatarSvg size={28} />} className={styles.avatar} />
            <div className={styles.user}>
              <div>
                <Text style={{ fontSize: 20, marginBottom: 8 }}>{username}</Text>
              </div>
              <div>
                <Text type={'secondary'}>{showHiddenAddress(address)}</Text>
              </div>
            </div>
            <div className={styles.balance}>
              <BaseLoading loading={checkStatus !== 'success'}>
                <Statistic title={'REV'} precision={4} value={revBalance} />
              </BaseLoading>
            </div>
          </div>
        </div>
        <Divider>
          <CaretDownOutlined className={styles.down} />
        </Divider>
        <div>
          <div className={styles.title}>
            <Text type={'secondary'}>
              <FormattedMessage id={'transfer.receive-address.title'} />
            </Text>
          </div>
          <Input
            className={styles.input}
            size={'large'}
            prefix={<IconFont type="mrw-address" className={styles.icon} />}
            value={toAddr}
            onChange={e => {
              handleToAddr(e.target.value);
            }}
            placeholder={formatMessage({
              id: 'transfer.receive-address.placeholder',
            })}
          />
        </div>
        <div className={styles.feeCard}>
          <div className={styles.fee}>
            <Text type={'secondary'}>
              <FormattedMessage
                id={'transfer.fee.time'}
                values={{
                  confirm: 12,
                  time: 0.13213,
                }}
              />
            </Text>
            <Text type={'secondary'}>
              <FormattedMessage id={'transfer.fee.title'} />：<Text>{fee.toFixed(8)} REV</Text>
            </Text>
          </div>
          <Slider className={styles.slider} defaultValue={10} marks={marks} />
        </div>
        <div>
          <div className={styles.title}>
            <Text type={'secondary'}>
              <FormattedMessage id={'transfer.note.title'} />
            </Text>
          </div>
          <Input
            className={styles.input}
            value={note}
            onChange={e => {
              handleNote(e.target.value);
            }}
            prefix={<IconFont type="mrw-note" className={styles.icon} />}
            placeholder={formatMessage({
              id: 'transfer.note.placeholder',
            })}
          />
        </div>

        <div className={styles.action}>
          <Button
            block
            type={'default'}
            className={styles.button}
            onClick={reset}
            style={{ marginRight: 32 }}
          >
            <FormattedMessage id={'transfer.button.reset'} />
          </Button>
          <Button
            block
            type={'primary'}
            disabled={!(!balanceLoading && amount && toAddr)}
            className={styles.button}
            onClick={showModal}
          >
            <FormattedMessage id={'transfer.button.confirm'} />
          </Button>
        </div>
      </Card>
    </div>
  );
};
export default Transfer;
