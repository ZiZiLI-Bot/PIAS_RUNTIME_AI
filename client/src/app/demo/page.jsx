'use client';
import { Card, Typography } from 'antd';
import Link from 'next/link';

const supportList = [
  {
    key: 0,
    name: 'Căn cước công dân',
    href: '/demo/cccd',
  },
  {
    key: 1,
    name: 'Căn cước công dân cũ',
    href: '/demo/cccd_old',
  },
  {
    key: 2,
    name: 'Chứng minh nhân dân',
    href: '/demo/cmnd',
  },
];

const { Text } = Typography;
export default function IndexPage() {
  return (
    <main className='px-10 py-6 w-full'>
      <div className='flex flex-col space-y-3'>
        <Text className='text-4xl font-medium block'>
          AI-<Text className='text-4xl text-red-600'>Read</Text>
        </Text>
        <Text>
          PIAS AI READ là một dịch vụ cho phép người dùng nhận diện và trích xuất thông tin dữ liệu giấy tờ tùy thân tại
          khu vực Việt Nam. Dịch vụ này được xây dựng dựa trên nền tảng công nghệ nhận diện hình ảnh và xử lý ngôn ngữ
          được tinh chỉnh với các bộ dữ liệu dành riêng cho khu vực Việt Nam.
          <br />
          Dịch vụ này có thể sử dụng hỗi trợ bổ xung cho các hệ thống đăng ký tài khoản, đăng ký dịch vụ, xác minh danh
          tính, đăng ký tích hợp EKYC.
        </Text>
      </div>
      <div className='mt-8 w-full'>
        <Text className='text-2xl font-medium'>Các loại giấy tờ hỗ trợ</Text>
        <div className='grid gap-4 grid-cols-3 mt-8'>
          {supportList.map((item) => (
            <Link href={item.href} key={item.key}>
              <Card
                title={item.name}
                className='cursor-pointer relative hover:shadow-xl transition-shadow duration-500 ease-in-out'
              ></Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
