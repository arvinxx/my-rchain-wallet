import { Form } from 'antd';
import React, { Component } from 'react';
import { FormComponentProps } from 'antd/es/form';
import classNames from 'classnames';
import { LoginItemProps } from './Item';

import LoginSubmit from './LoginSubmit';
import styles from './index.less';

export interface UserFieldProps {
  defaultActiveKey?: string;
  style?: React.CSSProperties;
  onSubmit?: (error: any, values: any) => void;
  className?: string;
  help?: string;
  form: FormComponentProps['form'];
  children: React.ReactElement[];
}

interface UserFieldState {
  tabs?: string[];
  type?: string;
  active?: { [key: string]: any[] };
}

class UserField extends Component<UserFieldProps, UserFieldState> {
  public static Submit = LoginSubmit;

  public static UserName: React.FunctionComponent<LoginItemProps>;

  public static Password: React.FunctionComponent<LoginItemProps>;

  public static Mobile: React.FunctionComponent<LoginItemProps>;

  public static Captcha: React.FunctionComponent<LoginItemProps>;

  static defaultProps = {
    className: '',
    defaultActiveKey: '',
    onTabChange: () => {},
    onSubmit: () => {},
  };

  constructor(props: UserFieldProps) {
    super(props);
    this.state = {
      type: props.defaultActiveKey,
      tabs: [],
      active: {},
    };
  }

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { active = {}, type = '' } = this.state;
    const { form, onSubmit } = this.props;
    const activeFields = active[type] || [];
    if (form) {
      form.validateFields(activeFields, { force: true }, (err, values) => {
        if (onSubmit) {
          onSubmit(err, values);
        }
      });
    }
  };

  render() {
    const { className, children } = this.props;

    console.log(children);
    return (
      <div className={classNames(className, styles.login)}>
        <Form onSubmit={this.handleSubmit}>{children}</Form>
      </div>
    );
  }
}

export default Form.create<UserFieldProps>()(UserField);
