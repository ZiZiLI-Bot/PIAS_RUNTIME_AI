import { createElement } from 'react';
import { RxIdCard } from 'react-icons/rx';
import { Typography } from 'antd';
const { Title } = Typography;

const MENU_ITEMS = [
  {
    key: 'cccd',
    label: (
      <Title level={5} style={{ margin: 0 }}>
        CCCD
      </Title>
    ),
    icon: createElement(RxIdCard, { size: 20 }),
  },
  {
    key: 'cmnd',
    label: (
      <Title level={5} style={{ margin: 0 }}>
        CMND
      </Title>
    ),
    icon: createElement(RxIdCard, { size: 20 }),
  },
];

export { MENU_ITEMS };
