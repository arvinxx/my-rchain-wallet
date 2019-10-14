import React, { Component, Fragment } from 'react';
import styles from './style.less';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

import { Button, Typography, Checkbox, Input, Divider, message } from 'antd';
import { Link, router } from 'umi';
import LabelSelector from './components/LabelSelector';
import { InputBlock } from '@/components';

const { Title, Text } = Typography;
const phrase = [
  'absurd',
  'state',
  'pet',
  'another',
  'rack',
  'valve',
  'marble',
  'bullet',
  'garlic',
  'lion',
  'plunge',
  'custom',
];

interface ISignUpProps {}

export default class SignUp extends Component<ISignUpProps> {
  static defaultProps: ISignUpProps = {};
  state = {
    agree: false,
    username: '',
    password: '',
    clear: false,
    confirm: '',
    step: 0,
    verified: false,
  };
  onRegister = () => {
    this.setState({
      step: 1,
    });
  };

  copy = () => {
    message.success(formatMessage({ id: 'sign-up.phrase.copy.success' }), 0.3);
  };
  verify = () => {
    const { verified, clear } = this.state;
    if (verified) {
      router.push('/');
    } else {
      this.setState({
        clear: !clear,
      });
    }
  };
  onContinue = () => {
    this.setState({
      step: 2,
    });
  };
  verified = () => {
    console.log(this.state.verified);
    this.setState({ verified: true });
  };

  render() {
    const { agree, username, password, step, verified, confirm, clear } = this.state;
    return (
      <div className={styles.container}>
        <Title level={2} style={{ marginBottom: 0 }}>
          {formatMessage({ id: `sign-up.title.${step}` })}
        </Title>
        <Text type={'secondary'} className={styles.description}>
          {step === 0 ? (
            <FormattedMessage
              id={'sign-up.description'}
              values={{
                restore: (
                  <Link target={'_blank'} to={'/user/restore'}>
                    {formatMessage({ id: 'sign-up.description.restore' })}
                  </Link>
                ),
                // TODO: wait for umi-locale update react-intl to 3.x
                // a: msg => (
                //   <Link target={'_blank'} to={'/user/restore'}>
                //     {msg}
                //   </Link>
                // ),
              }}
            />
          ) : step === 1 ? (
            <FormattedMessage id={'sign-up.description.phrase'} />
          ) : step === 2 ? (
            <FormattedMessage
              id={'sign-up.description.verify'}
              values={{
                back: (
                  <a
                    onClick={() => {
                      this.setState({
                        step: 1,
                      });
                    }}
                  >
                    {formatMessage({ id: 'sign-up.description.verify.back' })}
                  </a>
                ),
              }}
            />
          ) : null}
        </Text>
        <Divider dashed className={styles.divider} />
        {step === 0 ? (
          <Fragment>
            <InputBlock
              value={username}
              label={'sign-up.username'}
              type={'username'}
              onChange={e => {
                this.setState({ username: e.target.value });
              }}
            />
            <InputBlock
              value={password}
              label={'sign-up.password'}
              type={'password'}
              onChange={e => {
                this.setState({ password: e.target.value });
              }}
            />
            <InputBlock
              value={confirm}
              label={'sign-up.confirm'}
              type={'confirm'}
              onChange={e => {
                this.setState({ confirm: e.target.value });
              }}
            />
            <div
              className={styles.agree}
              onClick={() => {
                console.log(agree);
                this.setState({
                  agree: !agree,
                });
              }}
            >
              <Checkbox
                checked={agree}
                onChange={agree => {
                  this.setState({
                    agree,
                  });
                }}
                style={{ marginRight: 4 }}
              />
              <FormattedMessage
                id={'sign-up.agreement'}
                values={{
                  service: (
                    <Link
                      target={'_blank'}
                      to={'/service'}
                      onClick={e => {
                        e.stopPropagation();
                      }}
                    >
                      {formatMessage({ id: 'sign-up.agreement.service' })}
                    </Link>
                  ),
                }}
              />
            </div>
            <Button
              type={'primary'}
              disabled={!agree}
              className={styles.btn}
              onClick={this.onRegister}
            >
              {formatMessage({ id: 'sign-up.button' })}
            </Button>
            <FormattedMessage
              id={'sign-up.sign-in'}
              values={{
                sign: (
                  <Link
                    to={'/user/login'}
                    onClick={e => {
                      e.stopPropagation();
                    }}
                  >
                    {formatMessage({ id: 'sign-up.sign-in.sign' })}
                  </Link>
                ),
              }}
            />
          </Fragment>
        ) : (
          <Fragment>
            <FormattedMessage id={step === 1 ? 'sign-up.phrase.info' : 'sign-up.verify.info'} />
            {step === 1 ? (
              <Fragment>
                <Button type={'link'} onClick={this.copy}>
                  <FormattedMessage id={'sign-up.phrase.copy'} />
                </Button>
                <div className={styles.phrase}>
                  {phrase.map(item => (
                    <span className={styles.word}>{item}</span>
                  ))}
                </div>
                <Button type={'primary'} className={styles.btn} onClick={this.onContinue}>
                  {formatMessage({ id: 'sign-up.phrase.button' })}
                </Button>
              </Fragment>
            ) : (
              <Fragment>
                <LabelSelector labels={phrase} clear={clear} verified={this.verified} />
                <Button type={'primary'} className={styles.btn} onClick={this.verify}>
                  {formatMessage({
                    id: verified ? 'sign-up.verify.button.true' : 'sign-up.verify.button.wrong',
                  })}
                </Button>
              </Fragment>
            )}

            <Link to={'/'}>
              <FormattedMessage id={'sign-up.phrase.skip'} />
            </Link>
          </Fragment>
        )}
      </div>
    );
  }
}
