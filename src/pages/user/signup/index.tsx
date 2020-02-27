import React, { FC, Fragment, useState } from 'react';
import styles from './style.less';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

import { Button, Typography, Checkbox, Input, Divider, message } from 'antd';
import { Link, router } from 'umi';
import { LabelSelector } from './components';
import { CreateAccount, PhraseBox } from '@/components';
import { getDecryptedItem } from '@/utils/utils';
import copyFn from 'copy-to-clipboard';
import { useDispatch } from 'dva';

const { Title, Text } = Typography;

const SignUp: FC = () => {
  const dispatch = useDispatch();

  const [step, handleStep] = useState<number>(0);
  const [clear, handleClear] = useState<boolean>(false);
  const [verified, handleVerified] = useState<boolean>(false);

  const goNext = () => {
    handleStep(step + 1);
  };

  const copy = () => {
    const mnemonic = getDecryptedItem('mnemonic');
    let string = '';
    mnemonic.forEach((word: string) => {
      string += word + ' ';
    });
    const flag = copyFn(string);
    if (flag) {
      message.success(formatMessage({ id: 'component.phrase-box.copy.success' }), 0.3);
    } else {
      message.error(formatMessage({ id: 'component.phrase-box.copy.error' }));
    }
  };

  const verify = () => {
    if (verified) finish();
    else handleClear(!clear);
  };

  const onContinue = () => {
    handleStep(2);
  };

  const onVerified = () => {
    handleVerified(true);
  };

  const finish = () => {
    localStorage.removeItem('mnemonic');
    const userList = getDecryptedItem('userList');
    const { uid } = userList[userList.length - 1];
    dispatch({
      type: 'user/register',
      payload: { uid },
    });
    router.push('/');
  };

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
                    handleStep(1);
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
          <CreateAccount type={'signup'} next={goNext} />
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
              <Button type={'link'} onClick={copy}>
                <FormattedMessage id={'sign-up.phrase.copy'} />
              </Button>
              <PhraseBox phrase={phrase} />
              <Button type={'primary'} className={styles.btn} onClick={onContinue}>
                {formatMessage({ id: 'sign-up.phrase.button' })}
              </Button>
            </Fragment>
          ) : (
            <Fragment>
              <LabelSelector labels={phrase} clear={clear} verified={onVerified} />
              <Button type={'primary'} className={styles.btn} onClick={verify}>
                {formatMessage({
                  id: onVerified ? 'sign-up.verify.button.true' : 'sign-up.verify.button.wrong',
                })}
              </Button>
            </Fragment>
          )}

          <Button type={'link'} onClick={finish}>
            <FormattedMessage id={'sign-up.phrase.skip'} />
          </Button>
        </Fragment>
      )}
    </div>
  );
};
export default SignUp;
