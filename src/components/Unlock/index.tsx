import React, { Component, lazy } from 'react';
import { Modal, Input, Typography, Icon, Button } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import { ReactComponent as UnlockIcon } from '@/assets/img/unlock.svg';
import styles from './style.less';
import { ConnectState, ConnectProps } from '@/models/connect';
import { IAccount } from '@/services/account';
import { getDecryptedItem, getItem, setItem } from '@/utils/utils';

const { Text, Title } = Typography;

interface IUnlockInnerProps extends ConnectProps {
  visible: boolean;
}

interface IUnlockProps extends IUnlockInnerProps {}

class Unlock extends Component<IUnlockProps> {
  static defaultProps: IUnlockInnerProps;
  state = {
    password: '',
    error: false,
  };
  check = () => {
    const { password } = this.state;
    const userList: IAccount[] = getDecryptedItem('userList');
    const username = getItem('currentUser');
    const user = userList.find(user => user.uid === username);
    if (user && user.pwd === password) {
      setItem('lastLogin', new Date().valueOf());
      this.props.dispatch({
        type: 'global/save',
        payload: { locked: false },
      });
    } else {
      this.setState({
        error: true,
      });
    }
  };
  handleInput = e => {
    this.setState({ password: e.target.value });
  };

  render() {
    const { children, visible } = this.props;
    const { password, error } = this.state;
    return (
      <>
        <Modal
          className={styles.container}
          closable={false}
          centered
          visible={visible}
          footer={null}
          width={320}
        >
          <div className={styles.bg}>
            <UnlockIcon className={styles.illustration} />
          </div>
          <div className={styles.content}>
            <Title level={4}>
              <FormattedMessage id={'component.unlock.title'} />
            </Title>
            <Text type={'secondary'}>
              <FormattedMessage id={'component.unlock.desc'} />
            </Text>
            <Input
              prefix={<Icon type={'lock'} className={styles.icon} />}
              value={password}
              onPressEnter={this.check}
              suffix={
                <Button
                  size={'small'}
                  icon={'arrow-right'}
                  type={'primary'}
                  className={styles.button}
                  onClick={this.check}
                />
              }
              onChange={this.handleInput}
              placeholder={formatMessage({ id: 'component.unlock.password' })}
              type={'password'}
              className={styles.input}
            />
            {error ? (
              <div className={styles.error}>
                <Text type={'danger'}>
                  <FormattedMessage id={'component.unlock.error'} />
                </Text>
              </div>
            ) : null}
          </div>
        </Modal>
        {children}
      </>
    );
  }
}

export default connect(
  ({ global }: ConnectState): IUnlockInnerProps => ({ visible: global.locked }),
)(Unlock);
