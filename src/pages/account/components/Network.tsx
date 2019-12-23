import React, { FC } from 'react';
import styles from './Network.less';
import { Button, Select, Radio, Typography } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import { DispatchProps } from '@/models/connect';
import { INetwork } from '@/models/global';
import { RadioChangeEvent } from 'antd/lib/radio';

const { Title, Text } = Typography;

const { Option } = Select;
interface INetworkInnerProps extends DispatchProps {}

interface INetworkProps extends INetworkInnerProps {
  network: string;
  node: string;
  networkList: INetwork[];
}

const Network: FC<INetworkProps> = ({ network, node, networkList, dispatch }) => {
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
    </div>
  );
};
export default Network;
