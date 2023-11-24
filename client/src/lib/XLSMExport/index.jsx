import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';

const XLSMExport = async (data, type) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'PIAS_AI.R';
  workbook.created = dayjs();
  const sheet = workbook.addWorksheet('INFO', {
    headerFooter: { firstHeader: 'Hello Exceljs', firstFooter: 'Hello World' },
  });

  sheet.columns = Object.keys(data).map((key) => ({
    header: key,
    key,
    width: 32,
  }));

  sheet.addRow(data);

  const headerRow = sheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
  });

  const exportXLSM = async () => {
    const buf = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `DataInfo${dayjs().format('DD_MM_YYYY_HH:mm:ss')}.xlsx`);
  };

  const exportCSV = async () => {
    const buffer = await workbook.csv.writeBuffer();
    const blob = new Blob(['\uFEFF' + buffer], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `DataInfo${dayjs().format('DD_MM_YYYY_HH:mm:ss')}.csv`);
  };

  const exportJSON = async () => {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    saveAs(blob, `DataInfo${dayjs().format('DD_MM_YYYY_HH:mm:ss')}.json`);
  };

  if (type === 'xlsx') await exportXLSM();
  if (type === 'csv') await exportCSV();
  if (type === 'json') await exportJSON();

  return;
};

export default XLSMExport;
