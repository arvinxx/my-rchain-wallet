import React, { PropsWithChildren } from 'react';
import { passwordProgressMap, passwordStatusMap } from './passwordStatusMap';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { Popover, Progress } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import styles from './style.less';
interface PasswordCheckerProps extends FormComponentProps {
  visible: boolean;
} 
export default (props: PropsWithChildren<PasswordCheckerProps>) => {
  const { children, form, visible } = props;
  const getPasswordStatus = () => {
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };
  return (
    <Popover
      getPopupContainer={node => {
        if (node && node.parentNode) {
          return node.parentNode as HTMLElement;
        }
        return node;
      }}
      content={
        <div style={{ padding: '4px 0' }}>
          {passwordStatusMap[getPasswordStatus()]}
          {renderPasswordProgress()}
          <div style={{ marginTop: 10 }}>
            <FormattedMessage id="register.strength.msg" />
          </div>
        </div>
      }
      overlayStyle={{ width: 240 }}
      placement="right"
      visible={visible}
    >
      {children}
    </Popover>
  );
};
