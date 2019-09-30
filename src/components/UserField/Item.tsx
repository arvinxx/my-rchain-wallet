import { Button, Col, Form, Input, Row } from 'antd';
import React, { Component } from 'react';

import { FormComponentProps } from 'antd/es/form';
import ItemMap from './map';
import styles from './index.less';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type WrappedLoginItemProps = Omit<LoginItemProps, 'form' | 'type'>;
export type LoginItemKeyType = keyof typeof ItemMap;
export interface LoginItemType {
  UserName: React.FC<WrappedLoginItemProps>;
  Password: React.FC<WrappedLoginItemProps>;
  Mobile: React.FC<WrappedLoginItemProps>;
  Captcha: React.FC<WrappedLoginItemProps>;
}

export interface LoginItemProps {
  name?: string;
  rules?: any[];
  style?: React.CSSProperties;
  onGetCaptcha?: (event?: MouseEvent) => void | Promise<any> | false;
  placeholder?: string;
  buttonText?: React.ReactNode;
  onPressEnter?: (e: any) => void;
  countDown?: number;
  type?: string;
  defaultValue?: string;
  form?: FormComponentProps['form'];
  customProps?: { [key: string]: any };
  onChange?: (e: any) => void;
  tabUtil?: any;
  help?: string;
}

interface LoginItemState {
  count: number;
}

const FormItem = Form.Item;

class WrapFormItem extends Component<LoginItemProps, LoginItemState> {
  static defaultProps = {};

  interval: number | undefined = undefined;

  constructor(props: LoginItemProps) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  componentDidMount() {}

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getFormItemOptions = ({ onChange, defaultValue, customProps = {}, rules }: LoginItemProps) => {
    const options: {
      rules?: any[];
      onChange?: LoginItemProps['onChange'];
      initialValue?: LoginItemProps['defaultValue'];
    } = {
      rules: rules || customProps.rules,
    };
    if (onChange) {
      options.onChange = onChange;
    }
    if (defaultValue) {
      options.initialValue = defaultValue;
    }
    return options;
  };

  render() {
    const { count } = this.state;

    // 这么写是为了防止restProps中 带入 onChange, defaultValue, rules props tabUtil
    const {
      onChange,
      customProps,
      defaultValue,
      rules,
      name,
      type,
      form,
      tabUtil,
      help,
      ...restProps
    } = this.props;
    // if (!name) {
    //   return null;
    // }
    // if (!form) {
    //   return null;
    // }
    const { getFieldDecorator } = form;
    // get getFieldDecorator props
    const options = this.getFormItemOptions(this.props);
    const otherProps = restProps || {};

    return (
      <FormItem help={help}>
        {getFieldDecorator(name, options)(
          <Input className={styles.input} {...customProps} {...otherProps} />,
        )}
      </FormItem>
    );
  }
}

const LoginItem: Partial<LoginItemType> = {};

Object.keys(ItemMap).forEach(key => {
  const item = ItemMap[key];
  LoginItem[key] = (props: LoginItemProps) => (
    <WrapFormItem customProps={item.props} rules={item.rules} {...props} type={key} />
  );
});

export default LoginItem as LoginItemType;
