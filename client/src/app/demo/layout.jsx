'use client';
import { MENU_ITEMS } from '@/constants/Demo.constants';
import { Breadcrumb, Button, Drawer, Grid, Layout, Menu, Typography } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { CiMenuFries } from 'react-icons/ci';
import { HiOutlineHome } from 'react-icons/hi';
const { Header, Content, Sider } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const DemoLayout = ({ children }) => {
  const screens = useBreakpoint();
  const pathname = usePathname();
  const navigate = useRouter();
  const [listPathName, setListPathName] = useState(pathname.split('/'));
  const [current, setCurrent] = useState(pathname.split('/')[2]);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    setListPathName(pathname.split('/'));
    setCurrent(pathname.split('/')[2]);
  }, [pathname]);

  const handleChangeMenu = (e) => {
    setOpenMenu(false);
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
        <div className='flex -translate-x-8 lg:translate-x-0 items-center space-x-2'>
          {!screens.lg && <Button onClick={() => setOpenMenu(true)} icon={<CiMenuFries className='inline' />} />}
          <Link href='/'>
            <Text className='text-3xl font-medium block'>
              AI.
              <Text className='text-3xl font-medium text-red-600'>R</Text>
            </Text>
          </Link>
        </div>
      </Header>
      <Layout>
        <Sider
          width={200}
          className='bg-white'
          breakpoint='lg'
          collapsedWidth='0'
          zeroWidthTriggerStyle={{
            display: 'none',
          }}
        >
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
          <Content className='bg-white rounded-md py-4 lg:px-4 overflow-auto'>{children}</Content>
        </Layout>
      </Layout>
      {!screens.lg && (
        <Drawer
          title={
            <Text className='text-xl font-medium block'>
              AI-<Text className='text-xl text-red-600'>Read</Text>
            </Text>
          }
          placement='left'
          width={300}
          onClose={() => setOpenMenu(false)}
          open={openMenu}
        >
          <Menu
            onClick={handleChangeMenu}
            selectedKeys={[current]}
            mode='inline'
            className='w-full border-r-0'
            items={MENU_ITEMS}
          />
        </Drawer>
      )}
    </Layout>
  );
};
export default DemoLayout;

DemoLayout.propTypes = {
  children: PropTypes.node,
  params: PropTypes.object,
};
