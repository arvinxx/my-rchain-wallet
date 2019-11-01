import { MenuDataItem, getMenuData, getPageTitle, DefaultFooter } from '@ant-design/pro-layout';
import DocumentTitle from 'react-document-title';
import Link from 'umi/link';
import { Icon, Popconfirm } from 'antd';

import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

import SelectLang from '@/components/SelectLang';
import { ConnectProps, ConnectState } from '@/models/connect';
import logo from '../assets/logo-long.svg';
import styles from './UserLayout.less';
const page = location;
export interface UserLayoutProps extends ConnectProps {
  breadcrumbNameMap: { [path: string]: MenuDataItem };
}

const UserLayout: React.SFC<UserLayoutProps> = props => {
  const {
    route = {
      routes: [],
    },
    dispatch,
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const clean = () => {
    localStorage.removeItem('userList');
    dispatch({
      type: 'user/save',
      payload: { userList: [] },
    });
  };
  return (
    <DocumentTitle
      title={getPageTitle({
        pathname: location.pathname,
        breadcrumb,
        formatMessage,
        ...props,
      })}
    >
      <div className={styles.container}>
        <div className={styles.lang}>
          <Popconfirm
            title={formatMessage({ id: 'layout.user.clean' })}
            placement={'bottomLeft'}
            onConfirm={clean}
          >
            <Icon type="delete" className={styles.clean} />
          </Popconfirm>
          <SelectLang />
        </div>
        <div className={styles.wrapper}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
              </Link>
            </div>
            <div className={styles.desc}>{formatMessage({ id: 'user.layout.description' })}</div>
          </div>
          <div className={styles.content}>{children}</div>
        </div>
        <DefaultFooter
          links={[
            {
              key: 'about',
              href: '/about',
              title: 'About',
              blankTarget: true,
            },
          ]}
          copyright={` 2019 MyRChainWallet - ${formatMessage({ id: 'component.footer.rights' })}`}
        />
      </div>
    </DocumentTitle>
  );
};

export default connect(({ settings }: ConnectState) => ({
  ...settings,
}))(UserLayout);
