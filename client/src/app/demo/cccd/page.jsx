/* eslint-disable no-undef */
'use client';
import { Col, Row, Typography, Upload, message, Descriptions, Button, notification } from 'antd';
import { useState } from 'react';
import { BiIdCard } from 'react-icons/bi';
import { formDataCCCD } from '@/constants/HomePage.constant';
import { TbFileExport } from 'react-icons/tb';
import Image from 'next/image';
import AXClient from '@/utils/API';

const renObjItem = (item) => {
  item = { ...item };
  return Object.keys(item).map((key, idx) => {
    const value = item[key];
    return {
      key: idx,
      label: key,
      children: value,
    };
  });
};

const { Text, Title } = Typography;
export default function CCCD_Detect() {
  const [imageFront, setImageFront] = useState(null);
  const [imageBack, setImageBack] = useState(null);
  const [onLoadFront, setOnLoadFront] = useState(false);
  const [onLoadBack, setOnLoadBack] = useState(false);
  const [dataRes, setDataRes] = useState(null);
  const props = {
    name: 'file',
    multiple: false,
    action: process.env.NEXT_PUBLIC_URL_API + '/upload',
    accept: 'image/*',
    height: 200,
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const handleChange = async (info, typeCard) => {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      if (info.file.response.success) {
        if (typeCard === 'frontCCCD') {
          setOnLoadFront(true);
          setImageFront(URL.createObjectURL(info.file.originFileObj));
          const res = await handleDetect(info.file.response.data.name, typeCard);
          if (res.success) {
            setDataRes((prev) => ({ ...res.data, ...prev }));
            console.log(res.data);
            setImageFront(res.data.imgOutUrl);
            notification.success({
              message: 'Success',
              description: 'Dữ liệu CCCD đã cập nhật!',
            });
            setOnLoadFront(false);
          } else {
            console.log(res);
            message.error('Error!');
          }
        } else {
          setOnLoadBack(true);
          setImageBack(URL.createObjectURL(info.file.originFileObj));
          const res = await handleDetect(info.file.response.data.name, typeCard);
          if (res.success) {
            setDataRes((prev) => ({ ...prev, ...res.data }));
            console.log(res.data);
            setImageBack(res.data.imgOutUrl);
            notification.success({
              message: 'Success',
              description: 'Dữ liệu CCCD đã cập nhật!',
            });
            setOnLoadBack(false);
          } else {
            console.log(res);
            message.error('Error!');
          }
        }
      }
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleDetect = async (imageName, typeCard) => {
    const data = {
      imageName,
      typeCard,
    };
    return await AXClient.post('/detect', data);
  };

  return (
    <main>
      <Row className='h-[260px]'>
        <Col span={12} className='p-3'>
          <Title level={4}>Mặt trước CCCD gắn chip</Title>
          {imageFront ? (
            <div className='w-full h-full flex items-center justify-center relative'>
              {onLoadFront && (
                <div className='w-full h-full absolute top-0 left-0 z-10'>
                  <div className='w-full h-full flex flex-col items-center justify-center ScanEffect'>
                    <Text className='text-white text-base'>On Scan</Text>
                  </div>
                </div>
              )}
              <Image
                src={imageFront}
                fill
                alt='frontCCCD'
                objectFit='contain'
                className={`${onLoadFront && 'grayscale'}`}
              />
            </div>
          ) : (
            <Upload.Dragger {...props} onChange={(info) => handleChange(info, 'frontCCCD')}>
              <p className='ant-upload-drag-icon'>
                <BiIdCard className='inline text-blue-400' size={50} />
              </p>
              <Text className='block'>Chọn hoặc thả hình ảnh vào đây để tải lên</Text>
              <Text className='text-xs text-gray-400'>Hình ảnh tối đa 20Mb, định dạng hỗi trợ .jpg, .jpeg, .png</Text>
            </Upload.Dragger>
          )}
        </Col>
        <Col span={12} className='p-3'>
          <Title level={4}>Mặt sau CCCD gắn chip</Title>
          {imageBack ? (
            <div className='w-full h-full flex items-center justify-center relative'>
              {onLoadBack && (
                <div className='w-full h-full absolute top-0 left-0 z-10'>
                  <div className='w-full h-full flex flex-col items-center justify-center ScanEffect'>
                    <Text className='text-white text-base'>On Scan</Text>
                  </div>
                </div>
              )}
              <Image
                src={imageBack}
                fill
                alt='backCCCD'
                objectFit='contain'
                className={`${onLoadBack && 'grayscale'}`}
              />
            </div>
          ) : (
            <Upload.Dragger {...props} onChange={(info) => handleChange(info, 'backCCCD')}>
              <p className='ant-upload-drag-icon'>
                <BiIdCard className='inline text-blue-400' size={50} />
              </p>
              <Text className='block'>Chọn hoặc thả hình ảnh vào đây để tải lên</Text>
              <Text className='text-xs text-gray-400'>Hình ảnh tối đa 20Mb, hỗi trợ định dạng .jpg, .jpeg, .png</Text>
            </Upload.Dragger>
          )}
        </Col>
      </Row>
      <div className='p-3 mt-5'>
        <Descriptions title='Thông tin CCCD' bordered items={renObjItem(formDataCCCD)} />
        <Button
          type='primary'
          className='mt-8 float-right'
          size='large'
          icon={<TbFileExport className='inline' size={16} />}
          disabled
        >
          Xuất dữ liệu
        </Button>
      </div>
    </main>
  );
}
