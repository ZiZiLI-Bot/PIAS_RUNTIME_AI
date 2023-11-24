import XLSMExport from '@/lib/XLSMExport';
import { Button, Modal, Result, Typography } from 'antd';
import PropTypes from 'prop-types';
import { TbDownload } from 'react-icons/tb';

const { Text } = Typography;
export default function ModalExportFile({ open, setOpen, data }) {
  return (
    <Modal title='Xuất file dữ liệu:' centered open={open} onCancel={() => setOpen(false)} footer={[]}>
      <Result status='success' title='Dữ liệu đã sẵn sàng!' subTitle='Chọn định dạng file muốn xuất dữ liệu.' />
      <div className='flex flex-col space-y-3'>
        <div className='flex items-center justify-between'>
          <Text className='text-base'>Tập tin Excel (.xlsx):</Text>
          <Button
            onClick={() => XLSMExport(data, 'xlsx')}
            className='w-40'
            icon={<TbDownload className='inline mb-1' size={16} />}
          >
            Download .xlsm
          </Button>
        </div>
        <div className='flex items-center justify-between'>
          <Text className='text-base'>Tập tin CSV (.csv):</Text>
          <Button
            onClick={() => XLSMExport(data, 'csv')}
            className='w-40'
            icon={<TbDownload className='inline mb-1' size={16} />}
          >
            Download .csv
          </Button>
        </div>
        <div className='flex items-center justify-between'>
          <Text className='text-base'>Tập tin JSON (.json):</Text>
          <Button
            onClick={() => XLSMExport(data, 'json')}
            className='w-40'
            icon={<TbDownload className='inline mb-1' size={16} />}
          >
            Download .json
          </Button>
        </div>
      </div>
    </Modal>
  );
}

ModalExportFile.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  data: PropTypes.object,
};
