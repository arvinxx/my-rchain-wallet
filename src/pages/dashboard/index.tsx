import React from 'react';
import { Card, Typography, Tag, Button, Avatar } from 'antd';
import styles from './style.less';
import { formatMessage } from 'umi-plugin-locale';
import Account from './components/Account';

const { Text } = Typography;

export default function() {
  return (
    <div className={styles.container}>
      <Account />
    </div>
  );
}
