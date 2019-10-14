import React, { ChangeEvent, Component, CSSProperties, StyleHTMLAttributes } from 'react';
import styles from './style.less';
import { Input, Icon } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

interface IInputBlockProps {
  type: 'username' | 'password' | 'confirm' | any;
  value: string;
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  style?: CSSProperties;
}

export default class InputBlock extends Component<IInputBlockProps> {
  static defaultProps: Partial<IInputBlockProps> = {};
  state = {
    visible: false,
  };
  handleVisible = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  };
  render() {
    const { value, type, label, onChange, style } = this.props;
    const { visible } = this.state;
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
          type={type === 'username' || visible ? undefined : 'password'}
          onChange={onChange}
        />
        <label style={{ userSelect: 'none' }} className={value ? styles.hover : null}>
          {formatMessage({ id: label })}
        </label>
      </div>
    );
  }
}
