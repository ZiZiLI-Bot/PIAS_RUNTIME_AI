'use client';
import { MENU_ITEMS } from '@/constants/Demo.constants';
import { Layout, Menu, Typography } from 'antd';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
const { Header, Content, Sider } = Layout;
const { Text } = Typography;

const DemoLayout = ({ children }) => {
  const pathname = usePathname();
  const navigate = useRouter();
  const [current, setCurrent] = useState(pathname.split('/')[2]);

  const handleChangeMenu = (e) => {
    setCurrent(e.key);
    navigate.push(`/demo/${e.key}`);
  };
  return (
    <Layout className='w-full min-h-screen'>
      <Header className='flex items-center bg-white'>
        <div>
          <Link href='/' className='mb-6'>
            <Text className='text-3xl font-medium'>
              AI.
              <Text className='text-3xl font-medium text-red-600'>R</Text>
            </Text>
          </Link>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className='bg-white pt-6'>
          <Menu
            onClick={handleChangeMenu}
            selectedKeys={[current]}
            mode='inline'
            className='w-full border-r-0'
            items={MENU_ITEMS}
          />
        </Sider>
        <Layout className='p-2'>
          <Content className='bg-white rounded-md p-4'>{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default DemoLayout;

DemoLayout.propTypes = {
  children: PropTypes.node,
  params: PropTypes.object,
};
