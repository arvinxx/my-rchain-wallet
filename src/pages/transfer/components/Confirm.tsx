import React, { FC, useEffect, useState } from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import { CheckOutlined, ArrowUpOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Alert, Typography, List, Modal, Result } from 'antd';
import { useSelector } from 'dva';

import { CheckPassword } from '@/components';
import numeral from 'numeral';

import styles from './Confirm.less';
import { ConnectState } from '@/models/connect';
import { TransferStatus } from '@/models/wallet';
import { util } from 'protobufjs';
import ucFirst = util.ucFirst;

const { Text, Title } = Typography;
const { Item } = List;

interface IConfirmProps {
  visible: boolean;
  send: () => void;
  hide: () => void;
  pwd: string;
  amount: number;
  address: string;
  toAddr: string;
  note: string;
  type: string;
  fee: number;
}

type ConfirmStatus = 'confirm' | 'check' | 'done' | 'error';

const Confirm: FC<IConfirmProps> = props => {
  const { visible, send, pwd, amount, address, toAddr, note, type, fee, hide } = props;
  const [status, handleStatus] = useState<ConfirmStatus>('confirm');
  const transferStatus = useSelector<ConnectState, TransferStatus>(
    state => state.wallet.transferStatus,
  );

  useEffect(() => {
    // when transferStatus is error
    if (transferStatus === 'error') {
      handleStatus('error');
    }
  }, [transferStatus]);

  const next = () => {
    handleStatus('check');
  };
  const backToConfirm = () => {
    handleStatus('confirm');
  };

  const checkedPwd = () => {
    send();
    handleStatus('done');
  };
  const finish = () => {
    hide();
    handleStatus('confirm');
  };

  const data = [
    {
      type: formatMessage({
        id: 'transfer.component.confirm.type.amount',
      }),
      value: amount + ' REV',
      className: styles.amount,
    },
    {
      type: formatMessage({
        id: 'transfer.component.confirm.type.type',
      }),
      value: type,
    },
    {
      type: formatMessage({
        id: 'transfer.component.confirm.type.from',
      }),
      value: address,
    },
    {
      type: formatMessage({
        id: 'transfer.component.confirm.type.to',
      }),
      value: toAddr,
    },
    {
      type: formatMessage({
        id: 'transfer.component.confirm.type.note',
      }),
      value: note,
    },
    {
      type: formatMessage({
        id: 'transfer.component.confirm.type.fee',
      }),
      value: numeral(fee).format('0.00000000') + ' REV',
    },
  ];

  return (
    <Modal visible={visible} centered width={560} zIndex={100} footer={null} onCancel={hide}>
      <Title level={3}>
        <FormattedMessage id={`transfer.component.confirm.title.${status}`} />
      </Title>
      {status === 'check' ? (
        <div style={{ marginTop: 40 }}>
          <CheckPassword next={checkedPwd} password={pwd} />
          <Button block className={styles.button} onClick={backToConfirm}>
            <FormattedMessage id={'transfer.component.confirm.action.back'} />
          </Button>
        </div>
      ) : (
        <div>
          {status === 'error' ? (
            <Result
              status={'error'}
              title={<FormattedMessage id={'transfer.component.confirm.error.desc'} />}
            />
          ) : (
            <>
              <div className={styles.iconWrapper}>
                {status === 'done' ? (
                  <CheckOutlined className={styles.success} />
                ) : (
                  <ArrowUpOutlined className={styles.icon} />
                )}
              </div>
              <List
                dataSource={data}
                renderItem={item => (
                  <Item key={item.type}>
                    <Item.Meta title={item.type} className={styles.type} />
                    <div className={item.className}>{item.value}</div>
                  </Item>
                )}
              />
            </>
          )}
          {status === 'confirm' ? (
            <>
              <Alert
                showIcon
                type={'warning'}
                message={formatMessage({
                  id: 'transfer.component.info',
                })}
              />
              <div className={styles.action}>
                <Button block className={styles.button} onClick={hide}>
                  <FormattedMessage id={'transfer.component.confirm.action.cancel'} />
                </Button>
                <Button
                  block
                  type={'primary'}
                  onClick={next}
                  className={styles.button}
                  style={{ marginLeft: 16 }}
                >
                  <FormattedMessage id={'transfer.component.confirm.action.confirm'} />
                </Button>
              </div>
            </>
          ) : (
            <Button
              block
              type={'primary'}
              onClick={finish}
              className={styles.button}
              style={{
                marginTop: 16,
              }}
            >
              <FormattedMessage id={'transfer.component.confirm.action.ok'} />
            </Button>
          )}
        </div>
      )}
    </Modal>
  );
};

export default Confirm;
