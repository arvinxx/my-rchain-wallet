import React, { Component } from 'react';
import styles from './style.less';
import { InputBlock } from '@/components';
import { Button, Checkbox } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

import { Link } from 'umi';
import { getDecryptedItem, getItem, setEncryptedItem, setItem } from '@/utils/utils';
import { getMnemonic } from '@/utils/blockchain';
import { getAccountFromMnemonic, getAccountFromPrivateKey, IAccount } from '@/services/account';

type Type = 'username' | 'password' | 'confirm';

interface ICreateAccountInnerProps {}

interface ICreateAccountProps extends ICreateAccountInnerProps {
  next: Function;
  type: 'signup' | 'restore';
}

interface ICreateAccountState {
  error?: {
    username: boolean;
    password: boolean;
    confirm: boolean;
  };
  username: string;
  password: string;
  confirm: string;
  agree?: boolean;
  checked?: boolean;
  repeat?: boolean;
}

export default class CreateAccount extends Component<ICreateAccountProps, ICreateAccountState> {
  static defaultProps: ICreateAccountInnerProps;
  state = {
    agree: false,
    error: {
      username: false,
      password: false,
      confirm: false,
    },
    repeat: false,
    username: '',
    password: '',
    confirm: '',
    checked: false,
  };
  onChange = (e, type: Type) => {
    this.setState({ [type]: e.target.value });
  };
  checkUser = () => {
    const { username, error } = this.state;

    // Check whether username is a combination of numbers and letters
    const re = /^[0-9a-zA-Z]*$/g;
    let isValid = re.test(username);

    // Check whether username is more than 3 letters
    if (username.length < 4) {
      isValid = false;
    }
    let repeat = false;
    const userList = getDecryptedItem('userList');
    if (userList) {
      userList.forEach(user => {
        if (user.username === username) {
          isValid = false;
          repeat = true;
        }
      });
    }
    this.setState({
      error: { ...error, username: !isValid },
      repeat,
    });
  };
  checkPassword = () => {
    const { password, error, confirm } = this.state;
    let isValid = true;

    // Check whether password is more than 5 letters
    if (password.length < 6) {
      isValid = false;
    }
    this.setState({
      error: { ...error, password: !isValid, confirm: confirm ? password !== confirm : false },
    });
  };
  checkConfirm = () => {
    const { password, confirm, error } = this.state;

    // Check whether confirm is same with password
    const isValid = confirm === password;
    this.setState({
      error: { ...error, confirm: !isValid },
      checked: isValid,
    });
  };

  onRegister = () => {
    const { next, type } = this.props;
    const { password, username } = this.state;
    let account: IAccount;
    if (type === 'signup') {
      const mnemonic = getMnemonic();
      const { ethAddr, revAddr, privateKey } = getAccountFromMnemonic(mnemonic);

      // TODO: 优化用户数据保存方式
      account = {
        username,
        pwd: password,
        address: revAddr,
        ethAddr,
        privateKey,
        mnemonic,
      };

      setEncryptedItem('mnemonic', mnemonic.split(' '));
    }

    if (type === 'restore') {
      // TODO: 完成基于私钥或者账户恢复的功能
      const restoreType = getItem('restore');
      if (restoreType === 'private') {
        const privateKey = getDecryptedItem('privateKey');
        const res = getAccountFromPrivateKey(privateKey);
        if (res) {
          const { address, ethAddr } = res;
          account = {
            username,
            pwd: password,
            address,
            ethAddr,
            privateKey,
          };
        }
        localStorage.removeItem('privateKey');
      }
      if (restoreType === 'phrase') {
        const mnemonic = getDecryptedItem('mnemonic');
        const { ethAddr, revAddr, privateKey } = getAccountFromMnemonic(mnemonic);
        account = {
          username,
          pwd: password,
          address: revAddr,
          ethAddr,
          privateKey,
          mnemonic,
        };
        localStorage.removeItem('mnemonic');
      }
      localStorage.removeItem('restore');
    }
    const userList = getDecryptedItem('userList') || [];
    setItem('currentUser', username);
    setEncryptedItem('userList', userList.concat(account));
    console.log(account);
    next();
  };

  render() {
    const { type } = this.props;

    const { agree, username, password, error, confirm, checked, repeat } = this.state;
    const clicked =
      checked && agree && !error.confirm && !error.password && !error.username && !repeat;
    return (
      <div className={styles.container}>
        <InputBlock
          value={username}
          label={'component.create-account.username'}
          type={'username'}
          placeholder={formatMessage({ id: 'component.create-account.username.placeholder' })}
          error={error.username}
          errorMsg={
            repeat
              ? 'component.create-account.username.repeated'
              : 'component.create-account.username.errorMsg'
          }
          onChange={e => this.onChange(e, 'username')}
          onBlur={this.checkUser}
        />
        <InputBlock
          value={password}
          label={'component.create-account.password'}
          type={'password'}
          placeholder={formatMessage({ id: 'component.create-account.password.placeholder' })}
          error={error.password}
          errorMsg={'component.create-account.password.errorMsg'}
          onChange={e => {
            this.onChange(e, 'password');
          }}
          onBlur={this.checkPassword}
        />
        <InputBlock
          value={confirm}
          label={'component.create-account.confirm'}
          type={'confirm'}
          error={error.confirm}
          errorMsg={'component.create-account.confirm.errorMsg'}
          onChange={e => {
            this.onChange(e, 'confirm');
          }}
          onBlur={this.checkConfirm}
        />
        <div
          className={styles.agree}
          onClick={() => {
            console.log(agree);
            this.setState({
              agree: !agree,
            });
          }}
        >
          <Checkbox
            checked={agree}
            onChange={e => {
              this.setState({ agree: e.target.checked });
            }}
            style={{ marginRight: 4 }}
          />
          <FormattedMessage
            id={'component.create-account.agreement'}
            values={{
              service: (
                <Link
                  target={'_blank'}
                  to={'/service'}
                  onClick={e => {
                    e.stopPropagation();
                  }}
                >
                  {formatMessage({ id: 'component.create-account.agreement.service' })}
                </Link>
              ),
            }}
          />
        </div>
        <Button
          type={'primary'}
          disabled={!clicked}
          className={styles.btn}
          onClick={this.onRegister}
        >
          {formatMessage({ id: 'component.create-account.button.' + type })}
        </Button>
      </div>
    );
  }
}
