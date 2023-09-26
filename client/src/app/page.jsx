/* eslint-disable no-undef */
'use client';
import NavBar from '@/components/Navbar';
import { axiosDetect } from '@/utils/API';
import { Button, Col, Row, Space, Typography, Upload, message } from 'antd';
import Image from 'next/image';
import { useState } from 'react';
import { BiIdCard } from 'react-icons/bi';

const { Text } = Typography;
const formData = {
  ID_Number: '',
  Name: '',
  Gender: '',
  Date_Of_Birth: '',
  Hometown: '',
  Residence: '',
};
export default function HomePage() {
  const [image, setImage] = useState(null);
  const [data, setData] = useState(formData);
  const [loading, setLoading] = useState(false);
  const props = {
    name: 'file',
    multiple: false,
    action: process.env.NEXT_PUBLIC_API_DATA + '/uploads',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        if (info.file.response.success) {
          setImage(info.file.response.data[0]);
          detectImage(info.file.response.data[0].url);
        }
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };
  const detectImage = async (urlImg) => {
    setLoading(true);
    const data = {
      url_img: urlImg,
    };
    const res = await axiosDetect.post('/detect', data);
    if (res.success) {
      console.log(res.data);
      setImage({ name: 'detect', url: res.data.imgDetect });
      const detectData = {
        ID_Number: res.data.IDCard,
        Name: res.data.name,
        Gender: res.data.gender,
        Date_Of_Birth: res.data.dateOfBirth,
        Hometown: res.data.origin,
        Residence: res.data.residence,
      };
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
                <Button className='w-32 shadow-md shadow-blue-600/50' size='large' type='primary'>
                  <Text className='text-base font-medium text-white'>Demo</Text>
                </Button>
                <Button className='w-32' size='large' type='default'>
                  Get Contacts
                </Button>
              </Space>
            </div>
          </Col>
          <Col span={12} className='w-full h-full flex items-center justify-center'>
            <div className='w-3/4 h-2/3 bg-slate-50 rounded-md shadow-xl shadow-slate-300 p-6'>
              <Text className='block text-base mb-2 font-medium'>Quick demo:</Text>
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
