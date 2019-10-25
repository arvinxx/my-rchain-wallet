import React, { Component, Fragment } from 'react';
import styles from './style.less';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

import { Button, Typography, Checkbox, Input, Divider, message } from 'antd';
import { Link, router } from 'umi';
import { LabelSelector } from './components';
import { CreateAccount } from '@/components';
import { copyToClipboard, getDecryptedItem, setItem } from '@/utils/utils';

const { Title, Text } = Typography;

interface ISignUpProps {}

export default class SignUp extends Component<ISignUpProps> {
  static defaultProps: ISignUpProps = {};
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
    if (flag) {
      message.success(formatMessage({ id: 'sign-up.phrase.copy.success' }), 0.3);
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
    setItem('currentUser', username);
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
                <div className={styles.phrase}>
                  {phrase.map((item: string) => (
                    <span key={item} className={styles.word}>
                      {item}
                    </span>
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

            <Button type={'link'} onClick={this.finish}>
              <FormattedMessage id={'sign-up.phrase.skip'} />
            </Button>
          </Fragment>
        )}
      </div>
    );
  }
}
