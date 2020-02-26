import React, { FC, FormEventHandler } from 'react';
import { Button, Select, Radio, Typography, Row, Col, Form, Input } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import { INetwork } from '@/models/global';
import { RadioChangeEvent } from 'antd/lib/radio';
import { useDispatch } from 'dva';

import styles from './Network.less';
import { WrappedFormInternalProps } from 'antd/es/form/Form';

const { Title, Text } = Typography;
const { Item } = Form;
const { Option } = Select;

interface INetworkProps {
  network: string;
  node: string;
  networkList: INetwork[];
}

const Network: FC<INetworkProps> = ({ network, node, networkList }) => {
  const dispatch = useDispatch();
  const onRadioChange = (e: RadioChangeEvent) => {
    console.log(e);
    dispatch({
      type: 'global/changeNetwork',
      payload: e.target.value,
    });
  };

  const NetworkForm: FC<WrappedFormInternalProps> = ({ form }) => {
    const { getFieldDecorator, validateFields, resetFields } = form;
    const handleSubmit = () => {
      validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    };
    const handleReset = () => {
      resetFields();
    };

    const selected = networkList.find(n => n.name === network);

    const disabled = selected!.readOnly;
    return (
      <Form onSubmit={handleSubmit} onReset={handleReset} className={styles.form}>
        <Item label={formatMessage({ id: 'account.components.network.form.name' })}>
          {getFieldDecorator('name', { initialValue: selected!.name })(
            <Input disabled={disabled} className={styles.formInput} />,
          )}
        </Item>
        <Item label={formatMessage({ id: 'account.components.network.form.observer' })}>
          {getFieldDecorator('observer', { initialValue: selected!.observer })(
            <Input disabled={disabled} className={styles.formInput} />,
          )}
        </Item>
        <Item label={formatMessage({ id: 'account.components.network.form.validator' })}>
          {getFieldDecorator('validator', { initialValue: selected!.validator })(
            <Input disabled={disabled} className={styles.formInput} />,
          )}
        </Item>
        <Item className={styles.formAction}>
          <Row type={'flex'} justify={'space-between'} gutter={12}>
            <Col span={12}>
              <Button htmlType={'reset'} disabled={disabled} block className={styles.formButton}>
                <FormattedMessage id={'account.components.network.form.reset'} />
              </Button>
            </Col>
            <Col span={12}>
              <Button
                type={'primary'}
                disabled={disabled}
                htmlType={'submit'}
                block
                className={styles.formButton}
              >
                <FormattedMessage id={'account.components.network.form.save'} />
              </Button>
            </Col>
          </Row>
        </Item>
      </Form>
    );
  };

  const WrappedNetworkForm = Form.create({ name: 'network' })(NetworkForm);
  return (
    <div className={styles.container}>
      <div className={styles.block}>
        <div className={styles.title}>
          <Title level={3}>
            <FormattedMessage id={'account.components.network.title'} />
          </Title>
          <Text type={'secondary'}>
            <FormattedMessage id={`account.components.network.desc`} />
          </Text>
        </div>
      </div>

      <div className={styles.block}>
        <Row type={'flex'} gutter={24}>
          <Col span={4}>
            <Title level={4}>
              <FormattedMessage id={'account.components.network.list.title'} />
            </Title>
            <div>
              <Radio.Group onChange={onRadioChange} value={network}>
                {networkList.map((item, index) => (
                  <Radio key={index} className={styles.radio} value={item.name}>
                    <FormattedMessage id={`account.components.network.title.${item.name}`} />
                  </Radio>
                ))}
              </Radio.Group>
            </div>
            <Button block style={{ marginTop: 12, height: 36 }}>
              <FormattedMessage id={'account.components.network.list.add-network'} />
            </Button>
          </Col>
          <Col span={10} style={{ marginLeft: 80 }}>
            <Title level={4}>
              <FormattedMessage id={'account.components.network.form.title'} />
            </Title>
            <WrappedNetworkForm />
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default Network;
