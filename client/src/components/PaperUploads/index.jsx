/* eslint-disable no-undef */
import { Col, Row, Typography, Upload } from 'antd';
import Image from 'next/image';
import { BiIdCard } from 'react-icons/bi';

const { Text, Title } = Typography;

const uploadOptions = {
  name: 'file',
  multiple: false,
  action: process.env.NEXT_PUBLIC_URL_API + '/upload',
  accept: 'image/*',
  height: 200,
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

export default function PaperUploads({
  imageFront,
  imageBack,
  onLoadFront,
  onLoadBack,
  handleChange,
  titles,
  typeCard,
}) {
  return (
    <Row className='h-[500px] lg:h-[250px]'>
      <Col xs={24} lg={12} className='p-3'>
        <Title level={4}>{titles[0]}</Title>
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
              alt={`front${typeCard}`}
              objectFit='contain'
              className={`${onLoadFront && 'grayscale'}`}
            />
          </div>
        ) : (
          <Upload.Dragger {...uploadOptions} onChange={(info) => handleChange(info, `front${typeCard}`)}>
            <p className='ant-upload-drag-icon'>
              <BiIdCard className='inline text-blue-400' size={50} />
            </p>
            <Text className='block'>Chọn hoặc thả hình ảnh vào đây để tải lên</Text>
            <Text className='text-xs text-gray-400'>Hình ảnh tối đa 20Mb, định dạng hỗi trợ .jpg, .jpeg, .png</Text>
          </Upload.Dragger>
        )}
      </Col>
      <Col xs={24} lg={12} className='p-3'>
        <Title level={4}>{titles[1]}</Title>
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
              alt={`back${typeCard}`}
              objectFit='contain'
              className={`${onLoadBack && 'grayscale'}`}
            />
          </div>
        ) : (
          <Upload.Dragger {...uploadOptions} onChange={(info) => handleChange(info, `back${typeCard}`)}>
            <p className='ant-upload-drag-icon'>
              <BiIdCard className='inline text-blue-400' size={50} />
            </p>
            <Text className='block'>Chọn hoặc thả hình ảnh vào đây để tải lên</Text>
            <Text className='text-xs text-gray-400'>Hình ảnh tối đa 20Mb, hỗi trợ định dạng .jpg, .jpeg, .png</Text>
          </Upload.Dragger>
        )}
      </Col>
    </Row>
  );
}
