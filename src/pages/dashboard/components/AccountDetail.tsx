import React, { Component } from 'react';
import {
  Modal,
  Avatar,
  Input,
  Icon,
  Button,
  Card,
  Alert,
  Typography,
  Divider,
  message,
} from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-locale';
import QRCode from 'qrcode.react';
import { CheckPassword } from '@/components';

import styles from './AccountDetail.less';
import { CurrentUser } from '@/models/user';
import { showHiddenAddress } from '@/utils/blockchain';
import { DispatchProps } from '@/models/connect';
import { copyToClipboard } from '@/utils/utils';

const { Text, Title } = Typography;

interface IAccountDetailProps extends DispatchProps {
  visible: boolean;
  currentUser: CurrentUser;
  close: () => void;
}

export default class AccountDetail extends Component<IAccountDetailProps> {
  state = {
    editable: false,
    exports: false,
    value: '',
    checked: false,
  };
  edit = () => {
    const { editable } = this.state;
    this.setState({
      editable: !editable,
    });
  };
  abort = () => {
    this.setState({
      editable: false,
    });
  };
  onKeyDown = e => {
    e.stopPropagation();
    if (e.key === 'Escape') {
      this.abort();
    }
  };
  onChange = e => {
    this.setState({
      value: e.target.value,
    });
  };
  ok = () => {
    const { value } = this.state;
    const { currentUser } = this.props;
    this.setState({
      editable: false,
    });
    if (value) {
      this.props.dispatch({
        type: 'user/save',
        payload: {
          currentUser: { ...currentUser, username: value },
        },
      });
    }
  };
  exportPrivate = () => {
    this.setState({
      exports: true,
    });
  };
  next = () => {
    this.setState({
      checked: true,
    });
  };

  copy = () => {
    const {
      currentUser: { privateKey },
    } = this.props;
    const flag = copyToClipboard(privateKey ? privateKey.replace('0x', '') : '');
    this.props.dispatch({
      type: 'analytics',
      meta: {
        mixpanel: {
          event: '复制私钥',
        },
      },
    });
    if (flag) {
      message.success(formatMessage({ id: 'component.phrase-box.copy.success' }), 0.3);
    } else {
      message.error(formatMessage({ id: 'component.phrase-box.copy.error' }));
    }
  };

  exportToTXT = () => {
    const {
      currentUser: { privateKey },
    } = this.props;
    if (privateKey) {
      const blob = new Blob([privateKey.replace('0x', '')], { type: 'text/txt;charset=utf8;' });
      const a = document.createElement('a');
      a.download = 'private.txt';
      a.href = URL.createObjectURL(blob);
      a.click();
      this.props.dispatch({
        type: 'analytics',
        meta: {
          mixpanel: {
            event: '导出CSV',
          },
        },
      });
    } else {
      message.error(formatMessage({ id: 'component.phrase-box.export.error' }));
    }
  };
  render() {
    const { editable, checked, exports } = this.state;
    const { visible, currentUser, close } = this.props;
    if (!currentUser) {
      return null;
    }
    const { avatar, username, address, pwd, privateKey } = currentUser;
    return (
      <Modal onCancel={close} centered visible={visible} footer={null} width={400}>
        <div className={styles.container}>
          <Avatar size={'large'} className={styles.avatar} src={avatar} />
          <div className={styles.title}>
            {editable ? (
              <>
                <Input
                  defaultValue={username}
                  size={'large'}
                  onKeyDown={this.onKeyDown}
                  onAbort={this.abort}
                  onChange={this.onChange}
                />
                <Icon type={'close'} onClick={this.abort} className={styles.abort} />
                <Icon type={'check'} onClick={this.ok} className={styles.ok} />
              </>
            ) : (
              <>
                <Title level={4}>{username}</Title>
                {exports ? null : (
                  <Icon type={'edit'} onClick={this.edit} className={styles.icon} />
                )}
              </>
            )}
          </div>
          {!exports ? (
            <>
              <div className={styles.body}>
                <div>
                  <QRCode
                    value={'revAddress:' + address}
                    className={styles.qrcode}
                    includeMargin
                    style={{ height: 200, width: 200 }}
                  />
                </div>
                <Text type={'secondary'}>{showHiddenAddress(address, 10)}</Text>
              </div>
              <Divider dashed style={{ marginBottom: 0, marginTop: 24 }} />
              <Button
                block
                size={'large'}
                type={'default'}
                className={styles.export}
                onClick={this.exportPrivate}
              >
                <FormattedMessage id={'dashboard.account-detail.button.export'} />
              </Button>
            </>
          ) : (
            <div className={styles.pwd}>
              <Alert
                type={'error'}
                showIcon
                banner
                message={<FormattedMessage id={'dashboard.account-detail.export.alert.title'} />}
                description={<FormattedMessage id={'dashboard.account-detail.export.alert.desc'} />}
                style={{ marginBottom: 36 }}
              />
              {checked ? (
                <div className={styles.private}>
                  <Card
                    actions={[
                      <Button size={'small'} type={'link'} onClick={this.copy}>
                        <Icon type={'copy'} />
                        <FormattedMessage id={'dashboard.account-detail.export.copy'} />
                      </Button>,
                      <Button size={'small'} type={'link'} onClick={this.exportToTXT}>
                        <Icon type={'download'} />
                        <FormattedMessage id={'dashboard.account-detail.export.txt'} />
                      </Button>,
                    ]}
                  >
                    <div className={styles.key}>
                      {privateKey.replace('0x', '').toLocaleUpperCase()}
                    </div>
                  </Card>
                </div>
              ) : (
                <CheckPassword next={this.next} password={pwd} />
              )}
              <Button
                block
                style={{ height: 42 }}
                onClick={() => {
                  this.setState({
                    exports: false,
                    checked: false,
                  });
                }}
              >
                <FormattedMessage id={'dashboard.account-detail.export.return'} />
              </Button>
            </div>
          )}
        </div>
      </Modal>
    );
  }
}
