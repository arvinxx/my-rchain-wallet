import React, { Component, Fragment } from 'react';
import styles from './style.less';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

import { Button, Typography, Checkbox, Input, Divider, message } from 'antd';
import { Link, router } from 'umi';
import { LabelSelector } from './components';
import { CreateAccount, PhraseBox } from '@/components';
import { copyToClipboard, getDecryptedItem, setItem } from '@/utils/utils';
import { accountLogin } from '@/services/login';
import { connect } from 'dva';
import { DispatchProps } from '@/models/connect';

const { Title, Text } = Typography;

interface ISignUpProps extends DispatchProps {}
@connect()
export default class SignUp extends Component<ISignUpProps> {
  static defaultProps: ISignUpProps;
  state = {
    clear: false,
    step: 0,
    verified: false,
  };

  goNext = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1,
    });
  };
  copy = () => {
    const mnemonic = getDecryptedItem('mnemonic');
    let string = '';
    mnemonic.forEach((word: string) => {
      string += word + ' ';
    });
    const flag = copyToClipboard(string);
    this.props.dispatch({
      type: 'analytics',
      meta: {
        mixpanel: {
          event: '复制助记词',
        },
      },
    });

    if (flag) {
      message.success(formatMessage({ id: 'component.phrase-box.copy.success' }), 0.3);
    } else {
      message.error(formatMessage({ id: 'sign-up.phrase.copy.error' }));
    }
  };

  verify = () => {
    const { verified, clear } = this.state;
    if (verified) {
      this.finish();
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

  finish = () => {
    localStorage.removeItem('mnemonic');
    const userList = getDecryptedItem('userList');
    const { username } = userList[userList.length - 1];
    accountLogin(username);
    router.push('/');
  };

  render() {
    const { step, verified, clear } = this.state;
    const phrase = getDecryptedItem('mnemonic');
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
                  <Link to={'/user/restore'}>
                    {formatMessage({ id: 'sign-up.description.restore' })}
                  </Link>
                ),
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
          <>
            <CreateAccount type={'signup'} next={this.goNext} />
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
          </>
        ) : (
          <Fragment>
            <FormattedMessage id={step === 1 ? 'sign-up.phrase.info' : 'sign-up.verify.info'} />
            {step === 1 ? (
              <Fragment>
                <Button type={'link'} onClick={this.copy}>
                  <FormattedMessage id={'sign-up.phrase.copy'} />
                </Button>
                <PhraseBox phrase={phrase} />
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

            <Button type={'link'} onClick={this.finish}>
              <FormattedMessage id={'sign-up.phrase.skip'} />
            </Button>
          </Fragment>
        )}
      </div>
    );
  }
}
