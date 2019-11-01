import React, { Component } from 'react';
import styles from './style.less';
import { InputBlock } from '@/components';
import { Button } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';

interface ICheckPasswordInnerProps {}

interface ICheckPasswordProps extends ICheckPasswordInnerProps {
  password: string;
  next: Function;
}
export default class CheckPassword extends Component<ICheckPasswordProps> {
  static defaultProps: ICheckPasswordInnerProps;
  state = {
    value: '',
    error: false,
  };
  onChange = e => {
    this.setState({
      value: e.target.value,
    });
  };
  check = () => {
    const { value } = this.state;
    const { password, next } = this.props;

    if (value === password) {
      this.setState({
        error: false,
      });
      next();
    } else {
      this.setState({
        error: true,
      });
    }
  };
  render() {
    const { value, error } = this.state;
    return (
      <div className={styles.container}>
        <InputBlock
          label={'component.check-password.password'}
          value={value}
          error={error}
          errorMsg={'component.check-password.password.error'}
          onChange={this.onChange}
          onPressEnter={this.check}
          type={'password'}
        />
        <Button
          block
          onClick={this.check}
          size={'large'}
          type={'primary'}
          style={{
            height: 48,
            marginTop: 32,
          }}
        >
          <FormattedMessage id={'component.check-password.next'} />
        </Button>
      </div>
    );
  }
}
