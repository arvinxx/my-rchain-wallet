import React, { FC } from 'react';
import { Select, Typography } from 'antd';
import { connect } from 'dva';
import { ConnectState, DispatchProps } from '@/models/connect';

import Avatar from './AvatarDropdown';
import SelectLang from '../SelectLang';
import styles from './index.less';
import { INetwork } from '@/models/global';
const { Text } = Typography;
export type SiderTheme = 'light' | 'dark';
export interface GlobalHeaderRightProps extends DispatchProps {
  theme?: SiderTheme;
  layout: 'sidemenu' | 'topmenu';
  network: string;
  networkList: INetwork[];
}

const GlobalHeaderRight: FC<GlobalHeaderRightProps> = props => {
  const { theme, layout, networkList, dispatch } = props;
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
      {/*<div>*/}
      {/*  <Text type={'secondary'} style={{ marginRight: 4 }}>*/}
      {/*    <FormattedMessage id={`component.globalHeader.network.desc`} />*/}
      {/*  </Text>*/}
      {/*  <Select value={network} className={styles.network} onChange={changeNetwork}>*/}
      {/*    {testNetList.map((net, index) => (*/}
      {/*      <Select.Option key={index} value={`https://testnet-${index}.grpc.rchain.isotypic.com`}>*/}
      {/*        {net}*/}
      {/*      </Select.Option>*/}
      {/*    ))}*/}
      {/*    <Select.Option value={'http://localhost:54401'}>localhost</Select.Option>*/}
      {/*  </Select>*/}
      {/*</div>*/}
      <Avatar />
      <SelectLang className={styles.action} />
    </div>
  );
};

export default connect(({ settings, global }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  network: global.network,
  networkList: global.networkList,
}))(GlobalHeaderRight);
