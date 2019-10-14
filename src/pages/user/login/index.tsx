import React, { Component } from 'react';
import { Alert, Button, Select, Divider, Icon, Typography, Avatar } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import Identicon from 'identicon.js';

import Link from 'umi/link';
import { router } from 'umi';
import { connect } from 'dva';
import { StateType } from './model';
import { InputBlock } from '@/components';
import styles from './style.less';
import { ReactComponent as NewAccount } from '@/assets/img/new_account.svg';

import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';

const { Text, Title } = Typography;
const { Option } = Select;
interface LoginProps {
  dispatch: Dispatch<any>;
  userLogin: StateType;
  submitting: boolean;
}

interface LoginState {
  type: string;
  autoLogin: boolean;
  password: string;
}

export interface FormDataType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

@connect(
  ({
    userLogin,
    loading,
  }: {
    userLogin: StateType;
    loading: {
      effects: {
        [key: string]: string;
      };
    };
  }) => ({
    userLogin,
    submitting: loading.effects['userLogin/login'],
  }),
)
export default class Login extends Component<LoginProps, LoginState> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state: LoginState = {
    type: 'account',
    autoLogin: true,
    password: '',
  };

  changeAutoLogin = (e: CheckboxChangeEvent) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  signup = () => {
    router.push('/user/signup');
  };

  render() {
    const { userLogin, submitting } = this.props;
    const { type, autoLogin, password } = this.state;
    let account;
    // account = [
    //   { username: 'bob', address: '0x461b3e7746a6fef7777f78a23981a799c5127b9a' },
    //   { username: 'alice', address: '0x7159c9177242007691a46D0106Ca77A82b177629'.toLowerCase() },
    // ];
    return (
      <div className={styles.container}>
        {!account ? (
          <>
            <NewAccount className={styles.img} />
            <div>
              <Text type={'secondary'}>
                {formatMessage({ id: 'user-login.login.none-account' })}
              </Text>
            </div>
            <Button className={styles.newBtn} type={'primary'} onClick={this.signup}>
              {formatMessage({ id: 'user-login.login.create-account' })}
            </Button>
            <div style={{ marginTop: 16 }}>
              <Text type={'secondary'}>
                <FormattedMessage
                  id={'user-login.login.restore'}
                  values={{
                    restore: (
                      <Link to={'/user/restore'}>
                        {formatMessage({ id: 'user-login.login.restore.restore' })}
                      </Link>
                    ),
                  }}
                />
              </Text>
            </div>
          </>
        ) : (
          <>
            <Title level={2} style={{ marginBottom: 0 }}>
              {formatMessage({ id: `user-login.login.title` })}
            </Title>
            <Text type={'secondary'} className={styles.description}>
              <FormattedMessage
                id={'user-login.login.title.description'}
                values={{
                  create: (
                    <Link to={'/user/signup'}>
                      {formatMessage({ id: 'user-login.login.title.description.create' })}
                    </Link>
                  ),
                }}
              />
            </Text>
            <Divider dashed className={styles.divider} />
            <Select defaultValue={account[0].address} size={'large'} className={styles.account}>
              {account.map(account => {
                const { address, username } = account;
                const data = new Identicon(address).toString();
                const avatar = `data:image/png;base64,${data}`;

                return (
                  <Option value={address}>
                    <div className={styles.option}>
                      <Avatar src={avatar} className={styles.avatar} />

                      <div className={styles.text}>
                        <div>{username}</div>
                        <Text type={'secondary'} style={{ fontSize: 12 }}>
                          {address}
                        </Text>
                      </div>
                    </div>
                  </Option>
                );
              })}
            </Select>
            <InputBlock
              label={'user-login.login.input.password'}
              onChange={e => this.setState({ password: e.target.value })}
              type={'password'}
              value={password}
            />
            <Button type={'primary'} size={'large'} className={styles.button} block>
              {formatMessage({ id: 'user-login.login.login' })}
            </Button>
          </>
        )}
      </div>
    );
  }
}
