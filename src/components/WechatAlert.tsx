import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';

const WechatAlert = () => {
  const [isWechat, setIsWechat] = useState(false);
  useEffect(() => {
    const isInWeChat = /(micromessenger|webbrowser)/.test(navigator.userAgent.toLocaleLowerCase());
    setIsWechat(isInWeChat);
  }, []);
  return (
    <Modal visible={isWechat} centered footer={false} width={350} closable={false}>
      <FormattedMessage id={'component.wechat-alert.text'} />
    </Modal>
  );
};

export default WechatAlert;
