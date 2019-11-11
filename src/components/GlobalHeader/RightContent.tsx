import React from 'react';
import { Icon, Tooltip, Select, Typography } from 'antd';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import { ConnectState, DispatchProps } from '@/models/connect';

import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import SelectLang from '../SelectLang';
import styles from './index.less';
import { INetList } from '@/models/global';
const { Text } = Typography;
export type SiderTheme = 'light' | 'dark';
export interface GlobalHeaderRightProps extends DispatchProps {
  theme?: SiderTheme;
  layout: 'sidemenu' | 'topmenu';
  network: string;
  netList: INetList;
}

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = props => {
  const { theme, layout, netList, network, dispatch } = props;
  const { testNetList } = netList;
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }
  const changeNetwork = (network: string) => {
    dispatch({
      type: 'global/save',
      payload: {
        network,
      },
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
      <div>
        <Text type={'secondary'} style={{ marginRight: 4 }}>
          <FormattedMessage id={`component.globalHeader.network.desc`} />
        </Text>
        <Select value={network} className={styles.network} onChange={changeNetwork}>
          {testNetList.map((net, index) => (
            <Select.Option key={index} value={`https://testnet-${index}.grpc.rchain.isotypic.com`}>
              {net}
            </Select.Option>
          ))}
        </Select>
      </div>
      <Avatar />
      <SelectLang className={styles.action} />
    </div>
  );
};

export default connect(({ settings, global }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  network: global.network,
  netList: global.netList,
}))(GlobalHeaderRight);
