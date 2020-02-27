import React, { FC } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Button, Select, Radio, Typography, Row, Col, Input, Form } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import { INetwork } from '@/models/global';
import { RadioChangeEvent } from 'antd/lib/radio';
import { useDispatch } from 'dva';
import styles from './Network.less';

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
    dispatch({
      type: 'global/changeNetwork',
      payload: e.target.value,
    });
  };

  const handleSubmit = values => {};
  const handleReset = () => {};

  const selected = networkList.find(n => n.name === network);

  const disabled = selected!.readOnly;
  const formItemLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

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
        <Row gutter={24}>
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
            <Form
              {...formItemLayout}
              onFinish={handleSubmit}
              onReset={handleReset}
              className={styles.form}
              initialValues={{
                name: selected!.name,
                observer: selected!.observer,
                validator: selected!.validator,
              }}
            >
              <Item
                name={'name'}
                label={formatMessage({ id: 'account.components.network.form.name' })}
              >
                <Input
                  disabled={disabled || selected!.name === 'localhost'}
                  className={styles.formInput}
                />
              </Item>
              <Item
                name={'observer'}
                label={formatMessage({ id: 'account.components.network.form.observer' })}
              >
                <Input
                  disabled={disabled}
                  defaultValue={selected!.observer}
                  className={styles.formInput}
                />
              </Item>
              <Item
                name={'validator'}
                label={formatMessage({ id: 'account.components.network.form.validator' })}
              >
                <Input disabled={disabled} className={styles.formInput} />
              </Item>
              <Item className={styles.formAction}>
                <Row justify={'space-between'} gutter={12}>
                  <Col span={12}>
                    <Button
                      htmlType={'reset'}
                      disabled={disabled}
                      block
                      className={styles.formButton}
                    >
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
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default Network;
