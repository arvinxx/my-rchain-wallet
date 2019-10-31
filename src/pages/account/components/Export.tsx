import React, { Component } from 'react';
import styles from './Export.less';
import { PhraseBox } from '@/components';
import { Button, message, Typography, Modal, Card, Icon, Alert } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';

import { copyToClipboard, getDecryptedItem } from '@/utils/utils';
import { connect } from 'dva';
import { DispatchProps } from '@/models/connect';

const { Title, Text } = Typography;

interface IExportInnerProps extends DispatchProps {}

interface IExportProps extends IExportInnerProps {
  visible: boolean;
}

@connect()
export default class Export extends Component<IExportProps> {
  static defaultProps: IExportInnerProps;
  close = () => {
    this.props.dispatch({
      type: 'global/save',
      payload: { exports: false },
      meta: {
        mixpanel: {
          event: '关闭导出助记词窗口',
        },
      },
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
  exportToCSV = () => {
    const mnemonic = getDecryptedItem('mnemonic');
    console.log(mnemonic);

    let csvString = '';
    mnemonic.forEach((word: string) => {
      csvString += word + ',';
    });
    console.log(csvString);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf8;' });

    const a = document.createElement('a');
    a.download = 'phrase.csv';
    a.href = URL.createObjectURL(blob);
    a.click();
    this.props.dispatch({
      type: 'analytics',
      meta: {
        mixpanel: {
          event: '导出CSV',
        },
      },
    });
  };

  render() {
    const { visible } = this.props;
    const phrase = getDecryptedItem('mnemonic');

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
          <Alert
            type={'error'}
            showIcon
            banner
            icon={<Icon type="exclamation-circle" theme="filled" />}
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
                  <Icon type={'copy'} />
                  <FormattedMessage id={'account.components.export.copy'} />
                </Button>,
                <Button size={'large'} type={'link'} onClick={this.exportToCSV}>
                  <Icon type={'download'} />
                  <FormattedMessage id={'account.components.export.csv'} />
                </Button>,
              ]}
            >
              <PhraseBox phrase={phrase} classname={styles.phrase} wordClassname={styles.word} />
            </Card>
          </div>
          <Button
            block={true}
            size={'large'}
            onClick={this.close}
            style={{ height: 48, marginTop: 24 }}
          >
            <FormattedMessage id={'account.components.export.close'} />
          </Button>
        </div>
      </Modal>
    );
  }
}
