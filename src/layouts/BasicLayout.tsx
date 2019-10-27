import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import Link from 'umi/link';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { Layout } from 'antd';

import { formatMessage } from 'umi-plugin-react/locale';

import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import styles from './BasicLayout.less';

import rectLogo from '../assets/logo-long.svg';
import circleLogo from '../assets/logo-circle.svg';
import { Unlock } from '@/components';

const { Footer } = Layout;

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  settings: Settings;
  locked: boolean;
  dispatch: Dispatch;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};

/**
 * use Authorized check all menu item
 */
const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map(item => ({
    ...item,
    children: item.children ? menuDataRender(item.children) : [],
  }));

export const footerRender: BasicLayoutProps['footerRender'] = () => (
  <Footer className={styles.footer}>
    <div>© 2019 MyRChainWallet - {formatMessage({ id: 'component.footer.rights' })}</div>
    <div>{formatMessage({ id: 'component.footer.about-us' })}</div>
  </Footer>
);

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const { dispatch, collapsed, children, settings, locked } = props;
  /**
   * constructor
   */
  const checkLocked = () => {
    const lastLogin = localStorage.getItem('lastLogin') as string;
    const dueTime = 30 * 60 * 1000;
    const duration = new Date().valueOf() - lastLogin;

    if (duration > dueTime) {
      dispatch({
        type: 'global/save',
        payload: { locked: true },
      });
    }
  };

  window.onfocus = () => {
    checkLocked();
  };

  /**
   * init variables
   */
  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  useEffect(() => {
    checkLocked();
  }, []);

  return (
    <div className={`${styles.layout} ${locked ? styles.blur : ''}`}>
      <Unlock>
        <ProLayout
          logo={circleLogo}
          menuHeaderRender={() => (
            <img className={styles.logo} src={collapsed ? circleLogo : rectLogo} alt="MRW" />
          )}
          onCollapse={handleMenuCollapse}
          menuItemRender={(menuItemProps, defaultDom) => {
            if (menuItemProps.isUrl) {
              return defaultDom;
            }
            return <Link to={menuItemProps.path}>{defaultDom}</Link>;
          }}
          breadcrumbRender={(routers = []) => [
            {
              path: '/',
              breadcrumbName: formatMessage({
                id: 'menu.home',
                defaultMessage: 'Home',
              }),
            },
            ...routers,
          ]}
          itemRender={(route, params, routes, paths) => {
            const first = routes.indexOf(route) === 0;
            return first ? (
              <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
            ) : (
              <span>{route.breadcrumbName}</span>
            );
          }}
          footerRender={footerRender}
          menuDataRender={menuDataRender}
          formatMessage={formatMessage}
          rightContentRender={rightProps => <RightContent {...rightProps} />}
          {...props}
          {...settings}
        >
          {children}
        </ProLayout>
      </Unlock>
    </div>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  locked: global.locked,
  settings,
}))(BasicLayout);
