import React, { FC, useEffect, useState } from 'react';
import { Button, Select, Divider, Typography, Avatar, Checkbox } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

import { router, Link } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { AvatarSvg, InputBlock } from '@/components';
import { ConnectState } from '@/models/connect';
import { showHiddenAddress } from '@/utils/blockchain';
import { ReactComponent as NewAccount } from '@/assets/img/new_account.svg';
import styles from './style.less';
import { setItem } from '@/utils/utils';

const { Text, Title } = Typography;
const { Option } = Select;

const Login: FC = () => {
  const dispatch = useDispatch();

  const [password, handlePassword] = useState('');
  const [autoLogin, handleAutoLogin] = useState(false);
  const [userKey, handleUserKey] = useState('');

  const { user, login } = useSelector<ConnectState, ConnectState>(state => state);
  const { userList } = user;

  useEffect(() => {
    dispatch({ type: 'user/fetchAll' });
  }, []);

  const signup = () => {
    router.push('/user/signup');
  };
  const loginFn = () => {
    let username = userKey;
    if (!userKey && userList) {
      username = userList[0].username;
    }
    dispatch({
      type: 'login/login',
      payload: { username, password },
    });
  };
  const chooseUser = (user: string) => {
    handleUserKey(user);
  };

  const { status } = login;

  return (
    <div className={styles.container}>
      {!userList || userList.length === 0 ? (
        <>
          <NewAccount className={styles.img} />
          <div>
            <Text type={'secondary'}>{formatMessage({ id: 'user-login.login.none-account' })}</Text>
          </div>
          <Button className={styles.newBtn} type={'primary'} onClick={signup}>
            {formatMessage({ id: 'user-login.login.create-account' })}
          </Button>
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
          <Select
            defaultValue={userList[0].username}
            size={'large'}
            onChange={chooseUser}
            className={styles.account}
          >
            {userList.map(user => {
              const { address, username, uid } = user;
              return (
                <Option value={username} key={address}>
                  <div className={styles.option}>
                    <Avatar
                      icon={<AvatarSvg string={uid + address + username} size={32} />}
                      className={styles.avatar}
                    />

                    <div className={styles.text}>
                      <div>{username}</div>
                      <Text type={'secondary'} style={{ fontSize: 12 }}>
                        {showHiddenAddress(address, 8)}
                      </Text>
                    </div>
                  </div>
                </Option>
              );
            })}
          </Select>
          <InputBlock
            label={'user-login.login.input.password'}
            onChange={e => {
              handlePassword(e.target.value);
            }}
            type={'password'}
            onPressEnter={loginFn}
            error={status === 'error'}
            errorMsg={'user-login.login.input.password.errorMsg'}
            value={password}
          />
          <div className={styles.autoLogin}>
            <Checkbox
              checked={autoLogin}
              onChange={() => {
                setItem('autoLogin', !autoLogin);
                handleAutoLogin(!autoLogin);
              }}
            >
              <FormattedMessage id="user-login.auto-login" />
            </Checkbox>
          </div>
          <Button type={'primary'} size={'large'} className={styles.button} block onClick={loginFn}>
            {formatMessage({ id: 'user-login.login.login' })}
          </Button>
        </>
      )}
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
    </div>
  );
};
export default Login;
