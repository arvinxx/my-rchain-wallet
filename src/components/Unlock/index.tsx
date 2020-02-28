import React, { FC, useState } from 'react';
import { LockOutlined, ArrowRightOutlined } from '@ant-design/icons';

import { Modal, Input, Typography, Button } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { useSelector, useDispatch } from 'dva';
import { ReactComponent as UnlockIcon } from '@/assets/img/unlock.svg';
import styles from './style.less';
import { ConnectState } from '@/models/connect';
import { IAccount } from '@/services/account';
import { getDecryptedItem, getItem, setItem } from '@/utils/utils';

const { Text, Title } = Typography;

const Unlock: FC = ({ children }) => {
  const [password, handlePassword] = useState('');
  const [error, handleError] = useState(false);
  const dispatch = useDispatch();
  const visible = useSelector<ConnectState, boolean>(state => state.global.locked);
  const check = () => {
    const userList: IAccount[] = getDecryptedItem('userList');
    const username = getItem('currentUser');
    const user = userList.find(user => user.uid === username);
    if (user && user.pwd === password) {
      setItem('lastLogin', new Date().valueOf());
      dispatch({
        type: 'global/save',
        payload: { locked: false },
      });
    } else {
      handleError(true);
    }
  };
  const handleInput = e => {
    handlePassword(e.target.value);
  };

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
            prefix={<LockOutlined className={styles.icon} />}
            value={password}
            onPressEnter={check}
            suffix={
              <Button
                size={'small'}
                icon={<ArrowRightOutlined />}
                type={'primary'}
                className={styles.button}
                onClick={check}
              />
            }
            onChange={handleInput}
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
};

export default Unlock;
