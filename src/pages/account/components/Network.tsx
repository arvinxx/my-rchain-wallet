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
    dispatch({
      type: 'global/changeNetwork',
      payload: e.target.value,
    });
  };
  const onSelectChange = (value: string) => {
    dispatch({
      type: 'global/save',
      payload: { node: value },
    });
  };

  const [testnet, ...networks] = networkList;

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

    let selected = networkList.find(n => n.name === network);

    // 如果是测试网节点
    if (selected && selected.nodes) {
      selected = selected.nodes.find(n => n.name === node);
    }

    const readOnly = ['node0', 'node1', 'node2', 'node3', 'node4'].indexOf(selected!.name) > -1;
    return (
      <Form onSubmit={handleSubmit} onReset={handleReset} className={styles.form}>
        <Item label={formatMessage({ id: 'account.components.network.form.name' })}>
          {getFieldDecorator('name', { initialValue: selected!.name })(
            <Input
              disabled={readOnly || selected!.name === 'localhost'}
              className={styles.formInput}
            />,
          )}
        </Item>
        <Item label={formatMessage({ id: 'account.components.network.form.http' })}>
          {getFieldDecorator('http', { initialValue: selected!.http })(
            <Input disabled={readOnly} className={styles.formInput} />,
          )}
        </Item>
        <Item label={formatMessage({ id: 'account.components.network.form.grpc' })}>
          {getFieldDecorator('grpc', { initialValue: selected!.grpc })(
            <Input disabled={readOnly} className={styles.formInput} />,
          )}
        </Item>
        <Item className={styles.formAction}>
          <Row type={'flex'} justify={'space-between'} gutter={12}>
            <Col span={12}>
              <Button htmlType={'reset'} block className={styles.formButton}>
                重置
              </Button>
            </Col>
            <Col span={12}>
              <Button type={'primary'} htmlType={'submit'} block className={styles.formButton}>
                保存
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
        <Row type={'flex'} justify={'space-between'}>
          <Col>
            <Title level={4}>
              <FormattedMessage id={'account.components.network.list.title'} />
            </Title>
            <div>
              <Radio.Group onChange={onRadioChange} value={network}>
                <Radio value={testnet.name} className={styles.radio}>
                  <FormattedMessage id={`account.components.network.title.${testnet.name}`} />
                  <Select
                    defaultValue={testnet.nodes && testnet.nodes[0].name}
                    value={node}
                    onChange={onSelectChange}
                    style={{ marginLeft: 8 }}
                  >
                    {testnet.nodes &&
                      testnet.nodes.map((node, index) => (
                        <Option key={index} value={node.name}>
                          {node.name}
                        </Option>
                      ))}
                  </Select>
                </Radio>
                {networks.map((item, index) => (
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
          <Col span={12}>
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
