/* eslint-disable no-undef */
'use client';
import NavBar from '@/components/Navbar';
import AXClient from '@/utils/API';
import { Button, Col, Radio, Row, Space, Typography, Upload, message } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BiIdCard } from 'react-icons/bi';
import { formDataCCCD, formDataCMND } from '@/constants/HomePage.constant';

const { Text } = Typography;

export default function HomePage() {
  const [image, setImage] = useState(null);
  const [data, setData] = useState(formDataCCCD);
  const [loading, setLoading] = useState(false);
  const [typeCard, setTypeCard] = useState('frontCCCD');

  useEffect(() => {
    switch (typeCard) {
      case 'frontCCCD':
      case 'frontCCCD_old':
        setData(formDataCCCD);
        setImage(null);
        break;
      case 'frontCMND':
        setData(formDataCMND);
        setImage(null);
        break;
      default:
        setData(formDataCCCD);
        setImage(null);
        break;
    }
  }, [typeCard]);

  const fieldData = (data, typeCard) => {
    switch (typeCard) {
      case 'frontCCCD':
      case 'frontCCCD_old':
        return {
          'Số căn cước': data.ID,
          'Họ và tên': data.name,
          'Giới tính': data.gender,
          'Ngày sinh': data.date_of_birth,
          'Quê quán': data.origin,
          'Nơi thường chú': data.residence,
        };
      case 'frontCMND':
        return {
          'Số CMND': data.ID,
          'Họ và tên': data.name,
          'Ngày sinh': data.date_of_birth,
          'Nguyên quán': data.origin,
          'Nơi thường chú': data.residence,
        };
      default:
        break;
    }
  };

  const props = {
    name: 'file',
    multiple: false,
    action: process.env.NEXT_PUBLIC_URL_API + '/upload/',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file);
      }
      if (status === 'done') {
        if (info.file.response.success) {
          console.log(info.file.response);
          setImage({ url: URL.createObjectURL(info.file.originFileObj) });
          detectImage(info.file.response.data.name);
          message.success(`${info.file.name} file uploaded successfully.`);
        } else {
          message.error('Error: Failed to upload file');
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };
  const detectImage = async (imageName) => {
    setLoading(true);
    const data = {
      imageName,
      typeCard,
    };
    const res = await AXClient.post('/detect', data);
    if (res.success) {
      console.log(res.data);
      setImage({ name: 'detect', url: res.data.imgOutUrl });
      const detectData = fieldData(res.data, typeCard);
      setData(detectData);
    } else {
      console.log(res);
      message.error('Error');
    }
    setLoading(false);
  };
  return (
    <main>
      <NavBar />
      <div className='w-full h-screen'>
        <Row className='container mx-auto w-full h-full'>
          <Col span={12} className='flex items-center justify-center'>
            <div className='w-full'>
              <Text className='text-4xl font-medium'>
                AI-<Text className='text-4xl text-red-600'>Read</Text>
              </Text>
              <Text className='block text-7xl font-bold HomeText'>Extract identification paper data</Text>
              <Space size='middle' className='mt-6'>
                <Link href='/demo'>
                  <Button className='w-32 shadow-md shadow-blue-600/50' size='large' type='primary'>
                    <Text className='text-base font-medium text-white'>Demo</Text>
                  </Button>
                </Link>
                <Button className='w-32' size='large' type='default'>
                  Get Contacts
                </Button>
              </Space>
            </div>
          </Col>
          <Col span={12} className='w-full h-full flex items-center justify-center'>
            <div className='w-3/4 h-2/3 bg-slate-50 rounded-md shadow-xl shadow-slate-300 p-6'>
              <div className='flex flex-col space-y-2 mb-2'>
                <Text className='block text-base font-medium'>Quick demo:</Text>
                <Radio.Group onChange={(e) => setTypeCard(e.target.value)} value={typeCard}>
                  <Radio value='frontCCCD'>CCCD gắn chip</Radio>
                  <Radio value='frontCCCD_old'>CCCD cũ</Radio>
                  <Radio value='frontCMND'>Chứng minh nhân dân</Radio>
                </Radio.Group>
              </div>
              {!image ? (
                <Upload.Dragger {...props} accept='image/*' height='30%'>
                  <p className='ant-upload-drag-icon'>
                    <BiIdCard className='inline text-blue-400' size={50} />
                  </p>
                  <Text className='block'>Click or drag image to this area to upload</Text>
                  <Text className='text-xs text-gray-400'>File size less than 20Mb, formats .jpg, .jpeg, .png</Text>
                </Upload.Dragger>
              ) : (
                <div className='relative w-2/3 h-1/3 flex items-center justify-center'>
                  {loading && (
                    <div className='w-full h-full absolute top-0 left-0 z-10'>
                      <div className='w-full h-full flex flex-col items-center justify-center ScanEffect'>
                        <Text className='text-white text-base'>On Scan</Text>
                      </div>
                    </div>
                  )}
                  <Image
                    fill
                    className={`rounded-md ${loading && 'grayscale'}`}
                    loading='lazy'
                    src={image.url}
                    alt='DETECT DEMO'
                    sizes='100vw'
                  />
                </div>
              )}
              <Text className='block text-base my-2 font-medium'>Results:</Text>
              <div>
                {Object.keys(data).map((key) => {
                  const value = data[key];
                  return (
                    <Row key={key} className='border-b py-1'>
                      <Col span={9} className='text-base mb-1 font-bold'>
                        {key}: &nbsp;
                      </Col>
                      <Col span={15} className='text-base mb-1'>
                        {value}
                      </Col>
                    </Row>
                  );
                })}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </main>
  );
}
