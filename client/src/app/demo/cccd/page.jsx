/* eslint-disable no-undef */
'use client';
import { Col, Row, Typography, Upload, message } from 'antd';
import { useState } from 'react';
import { BiIdCard } from 'react-icons/bi';

const { Text, Title } = Typography;
export default function CCCD_Detect() {
  const [image, setImage] = useState(null);
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
          // detectImage(info.file.response.data[0].url);
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
  return (
    <main>
      <Row>
        <Col span={12} className='p-3'>
          <Title level={4}>Mặt trước CCCD gắn chip</Title>
          <Upload.Dragger {...props} accept='image/*' height={200}>
            <p className='ant-upload-drag-icon'>
              <BiIdCard className='inline text-blue-400' size={50} />
            </p>
            <Text className='block'>Click or drag image to this area to upload</Text>
            <Text className='text-xs text-gray-400'>File size less than 20Mb, formats .jpg, .jpeg, .png</Text>
          </Upload.Dragger>
        </Col>
        <Col span={12} className='p-3'>
          <Title level={4}>Mặt sau CCCD gắn chip</Title>
          <Upload.Dragger {...props} accept='image/*' height={200}>
            <p className='ant-upload-drag-icon'>
              <BiIdCard className='inline text-blue-400' size={50} />
            </p>
            <Text className='block'>Click or drag image to this area to upload</Text>
            <Text className='text-xs text-gray-400'>File size less than 20Mb, formats .jpg, .jpeg, .png</Text>
          </Upload.Dragger>
        </Col>
      </Row>
    </main>
  );
}
