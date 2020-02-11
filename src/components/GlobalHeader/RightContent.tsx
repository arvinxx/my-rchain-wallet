import React, { FC } from 'react';
import { Select, Typography } from 'antd';
import { useDispatch, useSelector } from 'dva';
import { ConnectState } from '@/models/connect';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';

import Avatar from './AvatarDropdown';
import SelectLang from '../SelectLang';
import styles from './index.less';

const { Text } = Typography;

const GlobalHeaderRight: FC = () => {
  const dispatch = useDispatch(),
    { global, settings } = useSelector<ConnectState, ConnectState>(state => state),
    { navTheme: theme, layout } = settings,
    { networkList, network } = global;
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }
  const changeNetwork = (network: string) => {
    dispatch({
      type: 'global/changeNetwork',
      payload: network,
    });
  };

  const NetMenuItem: FC = () => {
    const { Option } = Select;
    return (
      <Select value={network} className={styles.network} onChange={changeNetwork}>
        {networkList.map((net, index) => (
          <Option key={index} value={net.name}>
            {net.name}
          </Option>
        ))}
      </Select>
    );
  };

  return (
    <div className={className}>
      {/*<HeaderSearch*/}
      {/*  className={`${styles.action} ${styles.search}`}*/}
      {/*  placeholder={formatMessage({*/}
      {/*    id: 'component.globalHeader.search',*/}
      {/*  })}*/}
      {/*  dataSource={[*/}
      {/*    formatMessage({*/}
      {/*      id: 'component.globalHeader.search.example1',*/}
      {/*    }),*/}
      {/*    formatMessage({*/}
      {/*      id: 'component.globalHeader.search.example2',*/}
      {/*    }),*/}
      {/*    formatMessage({*/}
      {/*      id: 'component.globalHeader.search.example3',*/}
      {/*    }),*/}
      {/*  ]}*/}
      {/*  onSearch={value => {*/}
      {/*    console.log('input', value);*/}
      {/*  }}*/}
      {/*  onPressEnter={value => {*/}
      {/*    console.log('enter', value);*/}
      {/*  }}*/}
      {/*/>*/}
      {/* TODO 帮助中心 */}
      {/*<Tooltip*/}
      {/*  title={formatMessage({*/}
      {/*    id: 'component.globalHeader.help',*/}
      {/*  })}*/}
      {/*>*/}
      {/*  <a*/}
      {/*    target="_blank"*/}
      {/*    href="https://pro.ant.design/docs/getting-started"*/}
      {/*    rel="noopener noreferrer"*/}
      {/*    className={styles.action}*/}
      {/*  >*/}
      {/*    <Icon type="question-circle-o" />*/}
      {/*  </a>*/}
      {/*</Tooltip>*/}
      <div>
        <Text type={'secondary'} style={{ marginRight: 4 }}>
          <FormattedMessage id={`component.globalHeader.network.desc`} />
        </Text>
        <NetMenuItem />
      </div>
      <Avatar />
      <SelectLang className={styles.action} />
    </div>
  );
};

export default GlobalHeaderRight;
