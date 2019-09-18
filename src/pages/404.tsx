import { Button, Result } from 'antd';
import React from 'react';
import router from 'umi/router';
import { formatMessage } from 'umi-plugin-locale';
import { ReactComponent as Error } from '@/assets/404.svg';

const NoFoundPage: React.FC<{}> = () => (
  <Result
    // status="404"
    icon={<Error />}
    title={'404'}
    subTitle={formatMessage({ id: 'errors.404.description' })}
    extra={
      <Button type="primary" onClick={() => router.push('/')}>
        {formatMessage({ id: 'errors.404.button' })}
      </Button>
    }
  />
);

export default NoFoundPage;
