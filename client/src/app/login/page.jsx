'use client';
import { RULE_INPUT } from '@/constants/LoginPage.constant';
import { Button, Checkbox, Divider, Form, Input, Space, Typography } from 'antd';
import Link from 'next/link';
import { BsMicrosoft } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';
import { MdLockOutline, MdOutlineEmail } from 'react-icons/md';

const { Text } = Typography;

export default function LoginPage() {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className='w-[360px] h-3/4'>
        <Link href='/' className='mb-6'>
          <Text className='text-3xl font-medium'>
            AI.
            <Text className='text-3xl font-medium text-red-600'>R</Text>
          </Text>
        </Link>
        <div className='my-6'>
          <Text className='block text-gray-400 text-base'>WELCOME BACK!</Text>
          <Text className='text-3xl font-medium'>Continue to your account!</Text>
        </div>
        <div className='my-4 flex flex-col justify-center space-y-4'>
          <div className='w-full h-14 rounded-full shadow-md shadow-blue-100 bg-blue-100/80 flex items-center justify-center cursor-pointer transition-colors hover:bg-blue-200'>
            <Space size='large'>
              <FcGoogle size={28} />
              <Text className='text-base font-medium '>Continue with Google</Text>
            </Space>
          </div>
          <div className='w-full h-14 rounded-full shadow-md shadow-blue-100 bg-blue-100/60 flex items-center justify-center cursor-pointer transition-colors hover:bg-blue-200'>
            <Space size='large'>
              <BsMicrosoft size={25} color='blue' />
              <Text className='text-base font-medium '>Continue with Microsoft</Text>
            </Space>
          </div>
        </div>
        <Divider className='text-gray-400 my-3'>Or use Email</Divider>
        <div>
          <Form
            layout='vertical'
            requiredMark={false}
            initialValues={{
              remember: true,
            }}
          >
            <Form.Item name='email' label='EMAIL:' className='font-medium text-base' rules={RULE_INPUT.EMAIL}>
              <Input
                size='large'
                name='email'
                className='text-sm font-normal'
                prefix={<MdOutlineEmail size={20} className='text-gray-500 inline' />}
                placeholder='Enter your email'
              />
            </Form.Item>
            <Form.Item name='password' label='PASSWORD:' className='font-medium text-base' rules={RULE_INPUT.PASSWORD}>
              <Input.Password
                size='large'
                name='password'
                type='password'
                className='text-sm font-normal'
                prefix={<MdLockOutline size={20} className='text-gray-500 inline' />}
                placeholder='Enter your password'
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name='remember' valuePropName='checked' noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link className='login-form-forgot' href=''>
                Forgot password
              </Link>
            </Form.Item>
            <Form.Item>
              <Button shape='round' type='primary' htmlType='submit' size='large' className='w-full'>
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
