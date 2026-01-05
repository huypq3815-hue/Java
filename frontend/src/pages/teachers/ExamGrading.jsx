import React, { useState } from 'react';
import { Upload, message, Card, Row, Col, Table, Tag, Select, Button, Image, Typography, Space, Spin } from 'antd';
import { InboxOutlined, CheckCircleOutlined, CloseCircleOutlined, SaveOutlined } from '@ant-design/icons';

import examService from '../../services/examService';

const { Dragger } = Upload;
const { Title } = Typography;

const ExamGrading = () => {
  const [fileList, setFileList] = useState([]);
  const [isGraded, setIsGraded] = useState(false);
  const [gradingResults, setGradingResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');


  const handleUpload = async (file) => {
    try {
        setLoading(true);
        
        const objectUrl = URL.createObjectURL(file);
        setPreviewImage(objectUrl);

        const response = await examService.gradeExamPaper(file);
        
        const formattedData = response.data.map((item, index) => ({
        key: index + 1,
        question: item.questionNo,
        studentAns: item.studentChoice,
        correctAns: item.correctChoice,
        status: item.isCorrect
        }));

        setGradingResults(formattedData);
        setIsGraded(true);
        message.success('Chấm điểm thành công!');

    } catch (error) {
        console.error("Lỗi OCR: - ExamGrading.jsx:40", error);
        message.error('Lỗi khi xử lý hình ảnh. Vui lòng thử lại!');
        setFileList([]);
    } finally {
        setLoading(false);
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    fileList,
    beforeUpload: (file) => {
      setFileList([file]);

      handleUpload(file); 
      return false;
    },
    onRemove: () => {
      setFileList([]);
      setIsGraded(false);
      setPreviewImage('');
    },
  };

  const handleManualChange = (key, newAns) => {
    const newData = gradingResults.map((item) => {
      if (item.key === key) {
        const isNowCorrect = newAns === item.correctAns;
        return { ...item, studentAns: newAns, status: isNowCorrect };
      }
      return item;
    });
    setGradingResults(newData);
    message.info(`Đã sửa câu ${key} thành ${newAns}`);
  };

  const columns = [
    { title: 'Câu', dataIndex: 'question', key: 'question', width: 60 },
    { 
      title: 'Đáp án HS', 
      dataIndex: 'studentAns', 
      key: 'studentAns',
      render: (text, record) => (
        <Select 
          defaultValue={text} 
          value={text}
          style={{ width: 70 }} 
          onChange={(val) => handleManualChange(record.key, val)}
          status={record.status ? '' : 'error'}
        >
          {['A', 'B', 'C', 'D', ''].map(opt => (
            <Select.Option key={opt} value={opt}>{opt || 'Trống'}</Select.Option>
          ))}
        </Select>
      )
    },
    { title: 'Đáp án Đúng', dataIndex: 'correctAns', key: 'correctAns', width: 100 },
    { 
      title: 'Kết quả', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Tag color={status ? 'success' : 'error'} icon={status ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {status ? 'Đúng' : 'Sai'}
        </Tag>
      )
    },
  ];

  const totalScore = gradingResults.filter(r => r.status).length;

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Chấm thi tự động (OCR)</Title>
      
      <Spin spinning={loading} tip="Đang phân tích bài làm..." size="large">
        
        {!isGraded && (
          <Card style={{ marginTop: 20 }}>
            <Dragger {...uploadProps} style={{ padding: 40 }} disabled={loading}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: '#1890ff' }} />
              </p>
              <p className="ant-upload-text">Kéo thả hoặc nhấp để tải ảnh phiếu bài làm lên</p>
              <p className="ant-upload-hint">Hệ thống sẽ tự động nhận diện và chấm điểm.</p>
            </Dragger>
          </Card>
        )}

        {isGraded && (
          <Row gutter={24} style={{ marginTop: 20 }}>
            <Col span={12}>
              <Card title="Ảnh bài làm" bordered={false}>
                <Image
                  width="100%"
                  src={previewImage}
                  alt="Exam Paper"
                  style={{ border: '1px solid #ddd', borderRadius: 8 }}
                />
              </Card>
            </Col>

            <Col span={12}>
              <Card 
                title={<Space><CheckCircleOutlined /> Kết quả máy chấm</Space>} 
                extra={<Button type="primary" icon={<SaveOutlined />}>Lưu kết quả</Button>}
              >
                <div style={{ marginBottom: 16, textAlign: 'center' }}>
                  <Title level={4}>Tổng điểm: <span style={{ color: '#52c41a' }}>{totalScore} / {gradingResults.length}</span></Title>
                </div>
                
                <Table 
                  dataSource={gradingResults} 
                  columns={columns} 
                  pagination={false} 
                  scroll={{ y: 400 }} 
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        )}
      </Spin>
    </div>
  );
};

export default ExamGrading;