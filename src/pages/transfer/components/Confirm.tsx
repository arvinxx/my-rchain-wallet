import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import moment from 'moment';

import { Icon as LegacyIcon } from '@ant-design/compatible';

import { Button, Alert, Typography, List, Modal } from 'antd';
import { Link } from 'umi';
import { CheckPassword } from '@/components';
import numeral from 'numeral';

import styles from './Confirm.less';
import { DispatchProps } from '@/models/connect';

const { Text, Title } = Typography;
const { Item } = List;

interface IConfirmInnerProps {}

interface IConfirmProps extends DispatchProps {
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

interface IConfirmState {
  status: 'confirm' | 'check' | 'done';
}

export default class Confirm extends Component<IConfirmProps, IConfirmState> {
  static defaultProps: IConfirmInnerProps;
  state: IConfirmState = {
    status: 'confirm',
  };
  next = () => {
    this.setState({
      status: 'check',
    });
  };
  backToConfirm = () => {
    this.setState({
      status: 'confirm',
    });
  };

  checkedPwd = () => {
    const { send } = this.props;
    send();
    this.setState({
      status: 'done',
    });
  };
  finish = () => {
    const { hide } = this.props;
    hide();
    this.setState({
      status: 'confirm',
    });
  };

  render() {
    const { visible, send, pwd, amount, address, toAddr, note, type, fee, hide } = this.props;
    const { status } = this.state;
    const data = [
      {
        type: formatMessage({
          id: 'transfer.component.confirm.type.amount',
        }),
        value: numeral(amount).format('0,0.00') + ' REV',
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
        value: numeral(fee).format('0.0000000') + ' REV',
      },
    ];

    return (
      <Modal visible={visible} centered zIndex={100} footer={null} onCancel={hide}>
        <Title level={3}>
          <FormattedMessage id={`transfer.component.confirm.title.${status}`} />
        </Title>
        {status !== 'check' ? (
          <div>
            <div className={styles.iconWrapper}>
              <LegacyIcon
                type={status === 'done' ? 'check' : 'arrow-up'}
                className={`${styles.icon} ${status === 'done' ? styles.success : ''}`}
              />
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
                    onClick={this.next}
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
                onClick={this.finish}
                className={styles.button}
                style={{
                  marginTop: 16,
                }}
              >
                <FormattedMessage id={'transfer.component.confirm.action.ok'} />
              </Button>
            )}
          </div>
        ) : (
          <div style={{ marginTop: 40 }}>
            <CheckPassword next={this.checkedPwd} password={pwd} />
            <Button block className={styles.button} onClick={this.backToConfirm}>
              <FormattedMessage id={'transfer.component.confirm.action.back'} />
            </Button>
          </div>
        )}
      </Modal>
    );
  }
}
