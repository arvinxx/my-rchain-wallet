import React from 'react';
import { Card, Typography, Tag, Button, Avatar } from 'antd';
import styles from './Account.less';
import identicon from 'identicon.js';
import { formatMessage } from 'umi-plugin-locale';

const data = new identicon('d3b07384d113123edec492eaa6238ad5ff00').toString();
const avatar = `data:image/png;base64,${data}`;

const { Text } = Typography;

export default function() {
  return (
    <Card
      title={formatMessage({ id: 'dashboard.account.title' })}
      bordered={false}
      style={{ maxWidth: 550 }}
    >
      <div className={styles.account}>
        <div className={styles.user}>
          <Avatar src={avatar} className={styles.avatar} />

          <Text style={{ fontSize: 16, marginTop: 8 }}>name</Text>
          <Text type={'secondary'} style={{ marginTop: 4, marginBottom: 16 }}>
            Address
          </Text>
          <Tag className={styles.view}>{formatMessage({ id: 'dashboard.account.view' })}</Tag>
        </div>
        <div className={styles.operation}>
          <div className={styles.money}>
            <Text> {formatMessage({ id: 'dashboard.account.balance' })}</Text>
            <div className={styles.balance}>1,016,100 REV</div>
            <Text type={'secondary'}>$ 16,100 USD</Text>
          </div>
          <div className={styles.button}>
            <Button type={'primary'} className={styles.receive}>
              {formatMessage({ id: 'dashboard.account.button.receive' })}
            </Button>
            <Button type={'primary'} className={styles.send}>
              {formatMessage({ id: 'dashboard.account.button.send' })}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
