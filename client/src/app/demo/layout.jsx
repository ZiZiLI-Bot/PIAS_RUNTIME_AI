'use client';
import { MENU_ITEMS } from '@/constants/Demo.constants';
import { Breadcrumb, Layout, Menu, Typography } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { HiOutlineHome } from 'react-icons/hi';
const { Header, Content, Sider } = Layout;
const { Text } = Typography;

const DemoLayout = ({ children }) => {
  const pathname = usePathname();
  const navigate = useRouter();
  const [listPathName, setListPathName] = useState(pathname.split('/'));
  const [current, setCurrent] = useState(pathname.split('/')[2]);

  useEffect(() => {
    setListPathName(pathname.split('/'));
    setCurrent(pathname.split('/')[2]);
  }, [pathname]);

  const handleChangeMenu = (e) => {
    setCurrent(e.key);
    navigate.push(`/demo/${e.key}`);
  };

  const genItemsBreadcrumb = (listPathName) => {
    listPathName = listPathName.filter((item) => item !== '');
    const items = [
      {
        key: 'home',
        title: (
          <Link href='/'>
            <HiOutlineHome className='inline mb-1' size={14} />
          </Link>
        ),
      },
    ];
    const itemsBreadcrumb = listPathName.map((item, idx) => {
      if (idx !== listPathName.length - 1) {
        return {
          key: item,
          title: (
            <Link href={`/${item}`}>
              <span>{item}</span>
            </Link>
          ),
        };
      } else {
        return {
          key: item,
          title: <span>{item}</span>,
        };
      }
    });
    return [...items, ...itemsBreadcrumb];
  };
  return (
    <Layout className='w-full h-screen'>
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
        <Sider width={200} className='bg-white'>
          <Menu
            onClick={handleChangeMenu}
            selectedKeys={[current]}
            mode='inline'
            className='w-full border-r-0'
            items={MENU_ITEMS}
          />
        </Sider>
        <Layout className='px-5 pb-5 w-full'>
          <Breadcrumb className='my-2' items={genItemsBreadcrumb(listPathName)} />
          <Content className='bg-white rounded-md p-4 overflow-auto'>{children}</Content>
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
