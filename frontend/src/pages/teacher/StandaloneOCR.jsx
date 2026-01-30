// src/pages/teacher/StandaloneOCR.jsx
import { useState } from 'react';
import { Card, Upload, Row, Col, Table, Button, message, Space, InputNumber, Divider, Alert, Tag, Spin, Empty, Typography, } from 'antd';
import { InboxOutlined, CheckCircleOutlined, CloseCircleOutlined, SaveOutlined, FileImageOutlined, UserOutlined, ReloadOutlined,} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/api';

const { Dragger } = Upload;
const { Title, Text } = Typography;

const StandaloneOCR = () => {
  const { examId } = useParams(); // Lấy examId từ URL (nếu có)
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null);
  const [ocrResults, setOcrResults] = useState([]); // [{questionId, questionNumber, studentAnswer, correctAnswer, isCorrect}]
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Upload props
  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: 'image/*',
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Chỉ được upload file ảnh (JPG, PNG)!');
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Ảnh phải nhỏ hơn 5MB!');
        return false;
      }

      // Preview ảnh ngay
      const reader = new FileReader();
      reader.onload = (e) => setImageUrl(e.target.result);
      reader.readAsDataURL(file);

      // Gọi API chấm bài
      handleUploadOCR(file);
      return false; // Không upload mặc định của antd
    },
  };

  // Gọi API chấm OCR
  const handleUploadOCR = async (file) => {
    if (!examId) {
      message.error('Không tìm thấy mã đề thi!');
      return;
    }
    if (!studentId) {
      message.warning('Vui lòng nhập mã học sinh trước khi upload!');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post(
        `/exams/${examId}/grade-ocr?studentId=${studentId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      // Giả sử backend trả về { answers: [...] }
      const answers = response.answers || [];
      if (answers.length === 0) {
        message.warning('Không nhận diện được đáp án nào từ ảnh!');
      } else {
        setOcrResults(answers);
        message.success(`Đã chấm xong! Tìm thấy ${answers.length} câu trả lời.`);
      }
    } catch (error) {
      console.error('OCR upload error: - StandaloneOCR.jsx:82', error);
      message.error('Chấm bài thất bại! Vui lòng thử lại hoặc kiểm tra ảnh.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle sửa đúng/sai thủ công
  const toggleCorrect = (questionId) => {
    setOcrResults((prev) =>
      prev.map((r) =>
        r.questionId === questionId ? { ...r, isCorrect: !r.isCorrect } : r
      )
    );
  };

  // Sửa đáp án HS thủ công
  const handleStudentAnswerChange = (questionId, value) => {
    setOcrResults((prev) =>
      prev.map((r) =>
        r.questionId === questionId
          ? { ...r, studentAnswer: value, isCorrect: value === r.correctAnswer }
          : r
      )
    );
  };

  // Lưu kết quả vào backend (submitExam)
  const handleSaveResults = async () => {
    if (!studentId) {
      return message.error('Vui lòng nhập mã học sinh!');
    }
    if (ocrResults.length === 0) {
      return message.warning('Chưa có dữ liệu bài làm để lưu!');
    }

    setSubmitting(true);
    try {
      const payload = {
        examId: parseInt(examId),
        studentId: parseInt(studentId),
        answers: ocrResults.map((r) => ({
          questionId: r.questionId,
          selectedCode: r.studentAnswer,
        })),
      };

      await api.post('/exams/submit', payload);
      message.success(`Đã lưu kết quả thành công! Điểm: ${score.toFixed(2)}`);
      
      // Reset form sau khi lưu
      setImageUrl(null);
      setOcrResults([]);
      setStudentId(null);
    } catch (error) {
      console.error('Save results error: - StandaloneOCR.jsx:137', error);
      message.error('Lưu kết quả thất bại!');
    } finally {
      setSubmitting(false);
    }
  };

  // Tính điểm
  const correctCount = ocrResults.filter((r) => r.isCorrect).length;
  const totalQuestions = ocrResults.length;
  const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 10 : 0;

  const columns = [
    {
      title: 'Câu',
      dataIndex: 'questionNumber',
      key: 'questionNumber',
      width: 60,
      align: 'center',
    },
    {
      title: 'Đáp án HS',
      dataIndex: 'studentAnswer',
      key: 'studentAnswer',
      width: 140,
      align: 'center',
      render: (text, record, index) => (
        <Select
          value={text}
          onChange={(val) => handleStudentAnswerChange(record.questionId, val)}
          style={{ width: 80 }}
          size="small"
        >
          <Option value="A">A</Option>
          <Option value="B">B</Option>
          <Option value="C">C</Option>
          <Option value="D">D</Option>
        </Select>
      ),
    },
    {
      title: 'Đáp án đúng',
      dataIndex: 'correctAnswer',
      key: 'correctAnswer',
      width: 120,
      align: 'center',
      render: (text) => <Tag color="green">{text}</Tag>,
    },
    {
      title: 'Kết quả',
      dataIndex: 'isCorrect',
      key: 'isCorrect',
      width: 100,
      align: 'center',
      render: (isCorrect, record) => (
        <Button
          type="text"
          icon={isCorrect ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
          onClick={() => toggleCorrect(record.questionId)}
        >
          {isCorrect ? 'Đúng' : 'Sai'}
        </Button>
      ),
    },
  ];

  return (
    <Card
      title={
        <Space>
          <FileImageOutlined /> Chấm bài trắc nghiệm bằng OCR
        </Space>
      }
      extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => {
            setImageUrl(null);
            setOcrResults([]);
            setStudentId(null);
          }}>
            Làm mới
          </Button>
        </Space>
      }
    >
      <Row gutter={24} style={{ minHeight: '60vh' }}>
        {/* Cột trái: Ảnh bài thi */}
        <Col xs={24} lg={14}>
          <Card
            title="Ảnh phiếu trả lời"
            bordered={false}
            bodyStyle={{
              padding: 0,
              background: '#f8fafc',
              minHeight: '500px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Phiếu trả lời"
                style={{
                  maxWidth: '100%',
                  maxHeight: '600px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                }}
              />
            ) : (
              <Dragger {...uploadProps} style={{ width: '90%', padding: '60px 0' }}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ fontSize: 64, color: '#1890ff' }} />
                </p>
                <p className="ant-upload-text" style={{ fontSize: 18 }}>
                  Kéo thả hoặc nhấn để tải ảnh lên
                </p>
                <p className="ant-upload-hint">
                  Hỗ trợ JPG, PNG. Tối đa 5MB. Ảnh rõ nét, không bị mờ.
                </p>
              </Dragger>
            )}
          </Card>
        </Col>

        {/* Cột phải: Kết quả & Điều khiển */}
        <Col xs={24} lg={10}>
          <Card
            title="Kết quả chấm tự động"
            bordered={false}
            bodyStyle={{ minHeight: '500px', display: 'flex', flexDirection: 'column' }}
          >
            <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
              <div>
                <Text strong>Mã học sinh: </Text>
                <InputNumber
                  placeholder="Nhập mã HS (bắt buộc)"
                  style={{ width: '180px', marginLeft: 8 }}
                  value={studentId}
                  onChange={setStudentId}
                  min={1}
                  disabled={loading}
                />
              </div>

              {ocrResults.length > 0 && (
                <Alert
                  message={
                    <Space>
                      <strong>ĐIỂM SỐ:</strong> {score.toFixed(2)} / 10
                    </Space>
                  }
                  description={`Đúng ${correctCount}/${totalQuestions} câu`}
                  type={score >= 5 ? 'success' : score >= 3.5 ? 'warning' : 'error'}
                  showIcon
                />
              )}
            </Space>

            {loading ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spin tip="Đang phân tích ảnh bài làm..." size="large" />
              </div>
            ) : ocrResults.length > 0 ? (
              <>
                <div style={{ flex: 1, overflow: 'auto' }}>
                  <Table
                    columns={columns}
                    dataSource={ocrResults}
                    rowKey="questionId"
                    pagination={false}
                    size="small"
                    scroll={{ y: 400 }}
                  />
                </div>

                <Divider style={{ margin: '16px 0' }} />

                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  size="large"
                  block
                  loading={submitting}
                  onClick={handleSaveResults}
                  disabled={submitting || !studentId}
                >
                  Lưu kết quả vào hệ thống
                </Button>
              </>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Space direction="vertical" align="center">
                    <Text>Chưa có dữ liệu bài làm</Text>
                    <Text type="secondary">Vui lòng upload ảnh phiếu trả lời để bắt đầu</Text>
                  </Space>
                }
                style={{ marginTop: 100 }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default StandaloneOCR;