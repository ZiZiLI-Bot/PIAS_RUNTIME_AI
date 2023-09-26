'use client';
import { Button, Typography } from 'antd';
import { NAV_LINKS } from '@/constants/HomePage.constant';
import Link from 'next/link';

const { Text } = Typography;

export default function NavBar() {
  return (
    <div className='fixed w-full top-0 left-0 h-[80px] flex items-center justify-between px-[5%] z-50'>
      <div className='absolute w-full h-full bg-white -z-10 opacity-90' />
      <Text className='text-3xl font-medium'>
        AI.
        <Text className='text-3xl font-medium text-red-600'>R</Text>
      </Text>
      <div className='flex items-center space-x-8'>
        {NAV_LINKS.map((link) => (
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
    </div>
  );
}
