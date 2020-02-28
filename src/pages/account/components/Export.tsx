import React, { Component } from 'react';
import styles from './Export.less';
import { PhraseBox, CheckPassword } from '@/components';
import { ExclamationCircleFilled, CopyOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button, message, Typography, Modal, Card, Alert } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';

import { copyToClipboard, getDecryptedItem } from '@/utils/utils';
import { connect } from 'dva';
import { DispatchProps } from '@/models/connect';

const { Title, Text } = Typography;

interface IExportProps extends DispatchProps {
  visible: boolean;
  mnemonic: string;
  pwd: string;
}

export default class Export extends Component<IExportProps> {
  state = {
    checked: false,
  };
  close = () => {
    this.props.dispatch({
      type: 'global/save',
      payload: { exports: false },
    });
  };

  copy = () => {
    const { mnemonic } = this.props;

    const flag = copyToClipboard(mnemonic);
    if (flag) {
      message.success(formatMessage({ id: 'component.phrase-box.copy.success' }), 0.3);
    } else {
      message.error(formatMessage({ id: 'component.phrase-box.copy.error' }));
    }
  };
  exportToCSV = () => {
    const { mnemonic } = this.props;

    if (mnemonic) {
      const blob = new Blob([mnemonic], { type: 'text/csv;charset=utf8;' });
      const a = document.createElement('a');
      a.download = 'phrase.csv';
      a.href = URL.createObjectURL(blob);
      a.click();
    } else {
      message.error(formatMessage({ id: 'component.phrase-box.export.error' }));
    }
  };
  handleCheck = () => {
    this.setState({
      checked: true,
    });
  };
  render() {
    const { visible, mnemonic, pwd } = this.props;

    const phrase = mnemonic.split(' ');
    const { checked } = this.state;
    return (
      <Modal
        title={
          <div style={{ marginRight: 8 }}>
            <Title level={3}>
              <FormattedMessage id={'account.components.export.modal.title'} />
            </Title>
            <Text type={'secondary'} style={{ fontWeight: 'normal' }}>
              <FormattedMessage id={'account.components.export.modal.desc'} />
            </Text>
          </div>
        }
        centered
        visible={visible}
        footer={null}
        onCancel={this.close}
      >
        <div className={styles.container}>
          {checked ? (
            <>
              <Alert
                type={'error'}
                showIcon
                banner
                icon={<ExclamationCircleFilled />}
                message={<FormattedMessage id={'account.components.export.alert.title'} />}
                description={<FormattedMessage id={'account.components.export.alert.desc'} />}
                className={styles.alert}
              />
              <div className={styles.body}>
                <div style={{ marginBottom: 8 }}>
                  <Text>
                    <FormattedMessage id={'account.components.export.body.desc'} />
                  </Text>
                </div>
                <Card
                  actions={[
                    <Button size={'large'} type={'link'} onClick={this.copy}>
                      <CopyOutlined />
                      <FormattedMessage id={'account.components.export.copy'} />
                    </Button>,
                    <Button size={'large'} type={'link'} onClick={this.exportToCSV}>
                      <DownloadOutlined />
                      <FormattedMessage id={'account.components.export.csv'} />
                    </Button>,
                  ]}
                >
                  <PhraseBox
                    phrase={phrase}
                    classname={styles.phrase}
                    wordClassname={styles.word}
                  />
                </Card>
              </div>
              <Button
                block={true}
                size={'large'}
                onClick={this.close}
                style={{ height: 48, marginTop: 8 }}
              >
                <FormattedMessage id={'account.components.export.close'} />
              </Button>
            </>
          ) : (
            <CheckPassword next={this.handleCheck} password={pwd} />
          )}
        </div>
      </Modal>
    );
  }
}
