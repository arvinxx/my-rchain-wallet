import React, { Component, Fragment } from 'react';
import styles from './style.less';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { IconFont, InputBlock, CreateAccount } from '@/components';

import { Typography, Button, Divider, Input } from 'antd';
import { Link } from 'umi';
import router from 'umi/router';
import { getItem, setEncryptedItem, setItem } from '@/utils/utils';
import { isValidMnemonic, isValidPrivateKey } from '@/utils/blockchain';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default class Restore extends Component {
  state = {
    step: 0,
    method: '',
    phrase: '',
    privateKey: '',
    error: '',
  };
  handleStep = (method?: string) => {
    const { step, phrase, privateKey, method: way } = this.state;
    if (method) {
      this.setState({ step: step + 1, method });
    } else {
      setItem('restore', way);
      if (way === 'mnemonic') {
        const cleanPhrase = phrase.replace(/(^\s*)|(\s*$)/g, '');
        const valid = isValidMnemonic(cleanPhrase);
        if (valid) {
          setEncryptedItem('mnemonic', cleanPhrase);
          this.setState({ step: step + 1 });
        } else {
          this.setState({
            error: 'mnemonic',
          });
        }
      } else if (way === 'private') {
        const validPrivateKey = isValidPrivateKey(privateKey);
        if (validPrivateKey !== '') {
          this.setState({ step: step + 1 });
          setEncryptedItem('privateKey', validPrivateKey);
        } else {
          this.setState({
            error: 'private',
          });
        }
      }
    }
  };

  goBack = () => {
    const { step } = this.state;
    this.setState({ step: step - 1 });
  };
  finish = () => {
    router.push('/');
  };

  render() {
    const { method, phrase, step, privateKey, error } = this.state;
    return (
      <div className={styles.container}>
        <Title level={2} style={{ marginBottom: 0 }}>
          {formatMessage({
            id: `user-restore.title`,
          })}
        </Title>
        <Text type={'secondary'} className={styles.description}>
          <FormattedMessage
            id={
              method
                ? `user-restore.method.${method}.description`
                : 'user-restore.title.description'
            }
          />
        </Text>
        <Divider dashed className={styles.divider} />

        {step === 1 ? (
          method === 'mnemonic' ? (
            <div className={styles.phrase}>
              <div>
                <FormattedMessage id={'user-restore.method.mnemonic.input.info'} />
              </div>
              <Text type={'secondary'} style={{ fontSize: 12 }}>
                <FormattedMessage id={'user-restore.method.mnemonic.input.description'} />
              </Text>
              <div className={styles.inputWrapper}>
                <TextArea
                  className={styles.textArea}
                  value={phrase}
                  onChange={e => {
                    this.setState({
                      phrase: e.target.value,
                    });
                  }}
                  placeholder={formatMessage({
                    id: 'user-restore.method.mnemonic.input.placeholder',
                  })}
                />
                {error === 'mnemonic' ? (
                  <Text type={'danger'} className={styles.error}>
                    <FormattedMessage id={'user-restore.method.mnemonic.error'} />
                  </Text>
                ) : null}
              </div>
              <Button
                disabled={!phrase}
                type={'primary'}
                className={styles.button}
                onClick={() => this.handleStep()}
              >
                <FormattedMessage id={'user-restore.method.continue'} />
              </Button>
            </div>
          ) : (
            <div className={styles.private}>
              <div>
                <FormattedMessage id={'user-restore.method.private.input.info'} />
              </div>

              <div className={styles.inputWrapper}>
                <Input
                  value={privateKey}
                  className={styles.input}
                  onChange={e => {
                    this.setState({
                      privateKey: e.target.value,
                    });
                  }}
                  placeholder={formatMessage({
                    id: 'user-restore.method.private.input.placeholder',
                  })}
                />
                {error === 'private' ? (
                  <Text type={'danger'} className={styles.error}>
                    <FormattedMessage id={'user-restore.method.private.input.error'} />
                  </Text>
                ) : null}
              </div>
              <Button
                disabled={!privateKey}
                type={'primary'}
                className={styles.button}
                onClick={() => this.handleStep()}
              >
                <FormattedMessage id={'user-restore.method.continue'} />
              </Button>
            </div>
          )
        ) : step === 2 ? (
          <>
            <CreateAccount next={this.finish} type={'restore'} />
          </>
        ) : null}
        {step === 0 ? (
          <>
            <div className={styles.method} onClick={() => this.handleStep('private')}>
              <IconFont className={styles.icon} type={'mrw-password'} />
              <div className={styles.card}>
                <Title level={4}>
                  <FormattedMessage id={'user-restore.method.private'} />
                </Title>
                <Text type={'secondary'}>
                  <FormattedMessage id={'user-restore.method.private.description'} />
                </Text>
              </div>
            </div>
            <div className={styles.method} onClick={() => this.handleStep('mnemonic')}>
              <IconFont className={styles.icon} type={'mrw-brain'} />
              <div className={styles.card}>
                <Title level={4}>
                  <FormattedMessage id={'user-restore.method.mnemonic'} />
                </Title>
                <Text type={'secondary'}>
                  <FormattedMessage id={'user-restore.method.mnemonic.description'} />
                </Text>
              </div>
            </div>
          </>
        ) : (
          <Button type={'link'} onClick={() => this.goBack()}>
            <FormattedMessage id={'user-restore.method.return'} />
          </Button>
        )}
        <Divider dashed className={styles.divider} />
        <FormattedMessage
          id={'user-restore.other'}
          values={{
            sign: (
              <Link to={'/user/login'}>{formatMessage({ id: 'user-restore.other.sign' })}</Link>
            ),
            create: (
              <Link to={'/user/signup'}>{formatMessage({ id: 'user-restore.other.create' })}</Link>
            ),
          }}
        />
      </div>
    );
  }
}
