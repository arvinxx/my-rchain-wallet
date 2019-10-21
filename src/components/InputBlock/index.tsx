import React, { ChangeEvent, Component, CSSProperties, StyleHTMLAttributes } from 'react';
import styles from './style.less';
import { Input, Icon, Typography } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

const { Text } = Typography;

interface IInputBlockProps {
  type: 'username' | 'password' | 'confirm' | any;
  value: string;
  label: string;
  placeholder: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorMsg?: string;
  style?: CSSProperties;
}

export default class InputBlock extends Component<IInputBlockProps> {
  static defaultProps: Partial<IInputBlockProps>;
  state = {
    visible: false,
    focused: false,
  };
  handleVisible = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  };
  onBlur = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      focused: false,
    });
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur(e);
    }
  };

  render() {
    const { value, type, label, onChange, placeholder, style, error, errorMsg } = this.props;
    const { visible, focused } = this.state;
    return (
      <div className={styles.block} style={style}>
        <Input
          className={styles.input}
          value={value}
          suffix={
            type === 'username' ? (
              undefined
            ) : (
              <div style={{ cursor: 'pointer' }} onClick={this.handleVisible}>
                <Icon type={`eye${visible ? '-invisible' : ''}`} />
              </div>
            )
          }
          onFocus={() => {
            this.setState({
              focused: true,
            });
          }}
          placeholder={focused && !value ? placeholder : undefined}
          type={type === 'username' || visible ? undefined : 'password'}
          onChange={onChange}
          onBlur={this.onBlur}
        />
        <label style={{ userSelect: 'none' }} className={focused || value ? styles.hover : null}>
          {formatMessage({ id: label })}
        </label>
        {error && errorMsg ? <Text type={'danger'}>{formatMessage({ id: errorMsg })}</Text> : null}
      </div>
    );
  }
}
