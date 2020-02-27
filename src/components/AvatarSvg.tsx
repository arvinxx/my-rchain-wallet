import React, { FC } from 'react';
import Icon from '@ant-design/icons';
import { generateAvatar } from '@/utils/utils';
import { useSelector } from 'dva';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';

interface AvatarSvgProps {
  string?: string;
  size: number;
}
const AvatarSvg: FC<AvatarSvgProps> = ({ string, size = 32 }) => {
  const { address, username, uid } = useSelector<ConnectState, CurrentUser>(
    state => state.user.currentUser,
  );
  return (
    <Icon
      component={() => (
        <span
          dangerouslySetInnerHTML={{
            __html: generateAvatar(string ? string : uid + address + username, size),
          }}
        />
      )}
    />
  );
};

export default AvatarSvg;
