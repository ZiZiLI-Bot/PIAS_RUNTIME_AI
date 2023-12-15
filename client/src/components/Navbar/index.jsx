'use client';
import { Button, Typography, Grid, Drawer } from 'antd';
import { CiMenuFries } from 'react-icons/ci';
import { NAV_LINKS } from '@/constants/HomePage.constant';
import Link from 'next/link';
import { useState } from 'react';

const { Text } = Typography;
const { useBreakpoint } = Grid;

export default function NavBar() {
  const screens = useBreakpoint();
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <div className='fixed w-full top-0 left-0 h-[80px] flex items-center justify-between px-[5%] z-50'>
      <div className='absolute w-full h-full bg-white -z-10 opacity-90' />
      <div className='flex items-center space-x-2'>
        {!screens.lg && <Button onClick={() => setOpenMenu(true)} icon={<CiMenuFries className='inline' />} />}
        <Text className='text-3xl font-medium'>
          AI.
          <Text className='text-3xl font-medium text-red-600'>R</Text>
        </Text>
      </div>
      <div className='flex items-center space-x-8'>
        {screens.lg &&
          NAV_LINKS.map((link) => (
            <Link key={link.path} href={link.path}>
              <Text className='text-lg font-medium'>{link.title}</Text>
            </Link>
          ))}
        <Link href='/login'>
          <Button type='default' size='large' className='w-32'>
            Login
          </Button>
        </Link>
      </div>
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
          <div className='flex flex-col space-y-4'>
            {NAV_LINKS.map((link) => (
              <Link key={link.path} href={link.path}>
                <Text className='text-lg font-medium'>{link.title}</Text>
              </Link>
            ))}
          </div>
        </Drawer>
      )}
    </div>
  );
}
