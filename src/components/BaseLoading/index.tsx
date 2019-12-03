import React from 'react';
import { Spin } from 'antd';

interface Loading {
  loading: boolean;
}

const BaseLoading: React.FC<Loading> = ({ loading, children }) =>
  loading ? <Spin /> : <>{children}</>;
export default BaseLoading;
