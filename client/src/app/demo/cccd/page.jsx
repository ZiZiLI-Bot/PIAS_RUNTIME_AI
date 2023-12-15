/* eslint-disable no-undef */
'use client';
import ModalExportFile from '@/components/ModalExportFile';
import PaperUploads from '@/components/PaperUploads';
import AXClient from '@/utils/API';
import { Button, Descriptions, Tooltip, Typography, message, notification } from 'antd';
import { useEffect, useState } from 'react';
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

const { Text } = Typography;
export default function CCCD_Detect() {
  const [imageFront, setImageFront] = useState(null);
  const [imageBack, setImageBack] = useState(null);
  const [onLoadFront, setOnLoadFront] = useState(false);
  const [onLoadBack, setOnLoadBack] = useState(false);
  const [dataRes, setDataRes] = useState(null);
  const [RenData, setRenData] = useState(null);
  const [dataReady, setDataReady] = useState(false);
  const [exportModal, setExportModal] = useState(false);

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
          message.success(`${info.file.name} file uploaded successfully.`);
          setOnLoadFront(true);
          setImageFront(URL.createObjectURL(info.file.originFileObj));
          const res = await handleDetect(info.file.response.data.name, typeCard);
          if (res.success) {
            console.log(res);
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
          message.success(`${info.file.name} file uploaded successfully.`);
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
      <PaperUploads
        imageFront={imageFront}
        imageBack={imageBack}
        onLoadFront={onLoadFront}
        onLoadBack={onLoadBack}
        titles={['Mặt trước CCCD', 'Mặt sau CCCD']}
        handleChange={handleChange}
        typeCard='CCCD'
      />
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
