import React from 'react';
import { Card, Typography, Tag, Button, Avatar } from 'antd';
import styles from './style.less';
import identicon from 'identicon.js';
import { formatMessage } from 'umi-plugin-locale';
import Account from './components/Account';

const data = new identicon('d3b07384d113123edec492eaa6238ad5ff00').toString();
const avatar = `data:image/png;base64,${data}`;

const { Text } = Typography;

export default function() {
  return (
    <div className={styles.container}>
      <Account />
    </div>
  );
}
