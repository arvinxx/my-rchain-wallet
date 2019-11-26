import React, { Component } from 'react';
import {
  Card,
  Typography,
  Statistic,
  Input,
  Slider,
  InputNumber,
  Modal,
  Divider,
  Avatar,
  Button,
  Icon,
} from 'antd';
import styles from './style.less';
import mixpanel from 'mixpanel-browser';
import { IconFont, CheckPassword } from '@/components';

import { formatMessage, FormattedMessage } from 'umi-plugin-locale';

import { connect } from 'dva';
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
export default class Dashboard extends Component<IAccountDetailProps> {
  state = {
    visible: false,
    number: 0,
    sendAddress: '',
  };

  componentDidMount(): void {
    this.props.dispatch({
      type: 'wallet/checkBalance',
    });
  }

  close = () => {
    this.setState({
      visible: false,
    });
    mixpanel.track('关闭用户详情窗口');
  };
  showModal = () => {
    this.setState({
      visible: true,
    });
    mixpanel.track('点击发送按钮');
  };
  handleNumber = number => {
    this.setState({
      number,
    });
  };
  handleSendAddr = e => {
    this.setState({
      sendAddress: e.target.value,
    });
  };
  setMax = () => {
    const { revBalance } = this.props.wallet;

    this.setState({
      number: revBalance,
    });
  };
  reset = () => {
    this.setState({
      number: 0,
      sendAddress: '',
    });
  };
  send = () => {
    console.log('send');
  };
  render() {
    const { user, dispatch, wallet } = this.props;
    const { visible, number, sendAddress } = this.state;
    const { currentUser } = user;
    const { revBalance } = wallet;
    const { address, avatar, username, pwd } = currentUser;
    return (
      <div className={styles.container}>
        <Modal
          visible={visible}
          centered
          footer={null}
          onCancel={() => {
            this.setState({
              visible: false,
            });
          }}
        >
          <CheckPassword next={this.send} password={pwd} />
        </Modal>
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
                onChange={this.handleNumber}
                value={number}
                size={'large'}
              />
              <Button type={'link'} onClick={this.setMax}>
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
              <Avatar src={avatar} className={styles.avatar} />
              <div className={styles.user}>
                <div>
                  <Text style={{ fontSize: 20, marginBottom: 8 }}>{username}</Text>
                </div>
                <div>
                  <Text type={'secondary'}>{showHiddenAddress(address)}</Text>
                </div>
              </div>
              <div className={styles.balance}>
                <Statistic title={'REV'} precision={4} value={revBalance} />
              </div>
            </div>
          </div>
          <Divider>
            <Icon type="caret-down" className={styles.down} />
          </Divider>
          <div>
            <div className={styles.title}>
              <Text type={'secondary'}>
                <FormattedMessage id={'transfer.receive-address.title'} />
              </Text>
            </div>
            <Input
              className={styles.input}
              prefix={<IconFont type="mrw-address" className={styles.icon} />}
              value={sendAddress}
              onChange={this.handleSendAddr}
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
                <FormattedMessage id={'transfer.fee.title'} />：
                <Text>{(0.58861).toFixed(8)} REV</Text>
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
              onClick={this.reset}
              style={{ marginRight: 32 }}
            >
              <FormattedMessage id={'transfer.button.reset'} />
            </Button>
            <Button
              block
              type={'primary'}
              disabled={!(number && address)}
              className={styles.button}
              onClick={this.showModal}
            >
              <FormattedMessage id={'transfer.button.confirm'} />
            </Button>
          </div>
        </Card>
      </div>
    );
  }
}
