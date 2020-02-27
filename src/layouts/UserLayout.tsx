import { MenuDataItem, getMenuData, getPageTitle, DefaultFooter } from '@ant-design/pro-layout';
import DocumentTitle from 'react-document-title';
import Link from 'umi/link';
import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';

import React, { FC } from 'react';
import { useSelector, useDispatch } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

import SelectLang from '@/components/SelectLang';
import { ConnectState, Route } from '@/models/connect';
import logo from '../assets/logo-long.svg';
import styles from './UserLayout.less';
import moment from 'moment';

export interface UserLayoutProps extends Route {
  breadcrumbNameMap: { [path: string]: MenuDataItem };
}

const UserLayout: FC<UserLayoutProps> = props => {
  const { settings } = useSelector<ConnectState, ConnectState>(state => state);
  const dispatch = useDispatch();
  const { route = { routes: [] }, children, location = { pathname: '' } } = props;
  const { routes = [] } = route;
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
        ...settings,
      })}
      children={
        <div className={styles.container}>
          <div className={styles.lang}>
            <Popconfirm
              title={formatMessage({ id: 'layout.user.clean' })}
              placement={'bottomLeft'}
              onConfirm={clean}
            >
              <DeleteOutlined className={styles.clean} />
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
                key: 'rchain',
                href: 'https://rchain.coop/',
                title: 'RChain',
                blankTarget: true,
              },
              {
                key: 'about',
                href: '/about',
                title: 'About',
                blankTarget: true,
              },
            ]}
            copyright={` 2019-${moment().year()} MyRChainWallet - ${formatMessage({
              id: 'component.footer.rights',
            })}`}
          />
        </div>
      }
    />
  );
};

export default UserLayout;
