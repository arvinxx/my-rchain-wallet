import React, { useEffect } from 'react';
import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
import Link from 'umi/link';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { Layout, Row, Col, Typography } from 'antd';
import { Unlock } from '@/components';
import { getItem } from '@/utils/utils';
import moment from 'moment';

import { formatMessage } from 'umi-plugin-react/locale';

import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import styles from './BasicLayout.less';

import rectLogo from '../assets/logo-long.svg';
import circleLogo from '../assets/logo-circle.svg';

const { Footer } = Layout;
const { Text } = Typography;
export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  settings: Settings;
  locked: boolean;
  dispatch: Dispatch;
}

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
    <div>
      <Text type={'secondary'}>
        2019-{moment().year()} © MyRChainWallet - {formatMessage({ id: 'component.footer.rights' })}
      </Text>
    </div>
    <Row type={'flex'} gutter={8}>
      <Col>
        <a target={'_blank'} href={'https://rchain.coop/'}>
          <Text type={'secondary'}>{formatMessage({ id: 'component.footer.rchain' })}</Text>
        </a>
      </Col>
      <Col>
        <a target={'_blank'} href={'/'}>
          <Text type={'secondary'}>{formatMessage({ id: 'component.footer.about-us' })}</Text>
        </a>
      </Col>
    </Row>
  </Footer>
);

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const { dispatch, collapsed, children, settings, locked } = props;

  const checkLocked = () => {
    const autoLogin = getItem('autoLogin');

    const lastLogin = localStorage.getItem('lastLogin') as string;
    const dueTime = 30 * 60 * 1000; // lock after 30 mins
    const duration = new Date().valueOf() - Number(lastLogin);

    if (duration > dueTime) {
      if (autoLogin) {
        dispatch({
          type: 'global/save',
          payload: { locked: true },
        });
      } else {
        dispatch({ type: 'user/logout' });
      }
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
    dispatch({
      type: 'user/fetchCurrent',
    });

    dispatch({ type: 'global/initNetwork' });
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
            return <Link to={menuItemProps.path || '/'}>{defaultDom}</Link>;
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
          rightContentRender={() => <RightContent />}
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
