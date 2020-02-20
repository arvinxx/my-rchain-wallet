import { getUID } from '@/utils/utils';
import mixpanel, { Mixpanel } from 'mixpanel-browser';
let device = localStorage.getItem('deviceId');
if (!device) {
  device = getUID();
  localStorage.setItem('deviceId', device);
}
const mix = mixpanel.init(
  process.env.NODE_ENV === 'development'
    ? '4771b865f831aef3b956830cb0a862e3'
    : '22d6bf31b037baadb74830f3e3e5b59d',
);
mix.identify(device);

export default mix;
