/* eslint-disable no-undef */
'use client';
import ModalExportFile from '@/components/ModalExportFile';
import AXClient from '@/utils/API';
import { Button, Col, Descriptions, Row, Tooltip, Typography, Upload, message, notification } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { BiIdCard } from 'react-icons/bi';
import { TbFileExport, TbInfoCircleFilled, TbReload } from 'react-icons/tb';

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
  const [RenData, setRenData] = useState(null);
  const [dataReady, setDataReady] = useState(false);
  const [exportModal, setExportModal] = useState(false);

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

  useEffect(() => {
    const data = {
      'Số căn cước': dataRes?.ID || '',
      'Họ và tên': dataRes?.name || '',
      'Giới tính': dataRes?.gender || '',
      'Ngày sinh': dataRes?.date_of_birth || '',
      'Quê quán': dataRes?.origin || '',
      'Nơi thường chú': dataRes?.residence || '',
      'Ngày cấp': dataRes?.date || '',
    };
    setRenData(data);
  }, [dataRes]);

  const handleChange = async (info, typeCard) => {
    const { status } = info.file;
    // if (status !== 'uploading') {
    //   console.log(info.file, info.fileList);
    // }
    if (status === 'done') {
      if (info.file.response.success) {
        if (typeCard === 'frontCCCD') {
          setOnLoadFront(true);
          setImageFront(URL.createObjectURL(info.file.originFileObj));
          const res = await handleDetect(info.file.response.data.name, typeCard);
          if (res.success) {
            setDataRes((prev) => ({ ...res.data, ...prev }));
            setImageFront(res.data.imgOutUrl);
            notification.success({
              message: 'Success',
              description: 'Dữ liệu CCCD đã cập nhật!',
            });
            setDataReady(true);
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
            setImageBack(res.data.imgOutUrl);
            notification.success({
              message: 'Success',
              description: 'Dữ liệu CCCD đã cập nhật!',
            });
            setDataReady(true);
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

  const handleReset = () => {
    setImageFront(null);
    setImageBack(null);
    setDataRes(null);
    setDataReady(false);
    message.success('Reset success!');
  };

  return (
    <main>
      <div className='flex items-center justify-between space-x-1 px-2'>
        <div className='flex items-center space-x-1'>
          <TbInfoCircleFilled className='inline text-blue-400 mt-[2px]' size={16} />
          <Text className='text-gray-400 text-sm'>Hình ảnh cần chụp thẳng đứng, không bị mờ nét!</Text>
        </div>
        <Tooltip title='Làm mới'>
          <Button onClick={handleReset} icon={<TbReload className='inline mb-1' size={18} />} />
        </Tooltip>
      </div>
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
        <Descriptions title='Thông tin CCCD' bordered items={renObjItem(RenData)} />
        <Button
          type='primary'
          className='mt-8 float-right'
          size='large'
          icon={<TbFileExport className='inline mb-1' size={16} />}
          disabled={!dataReady}
          onClick={() => setExportModal(true)}
        >
          Xuất dữ liệu
        </Button>
      </div>
      <ModalExportFile open={exportModal} setOpen={setExportModal} data={RenData} />
    </main>
  );
}
