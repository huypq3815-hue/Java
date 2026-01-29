import { useState } from 'react';
import { Card, Upload, Row, Col, Table, Button, message, Space, Tag, Input, Divider, Alert, Select, Empty } from 'antd';
import { InboxOutlined, CheckCircleOutlined, CloseCircleOutlined, SaveOutlined, FileImageOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';

const { Dragger } = Upload;
const { Option } = Select;

const OCRGrading = () => {
    const { examId } = useParams();
    const [imageUrl, setImageUrl] = useState(null);
    const [ocrResults, setOcrResults] = useState([]);
    const [studentId, setStudentId] = useState('');
    const [loading, setLoading] = useState(false);

    // Mock data
    const mockOCRResults = Array.from({ length: 20 }, (_, i) => ({
        questionId: i + 1,
        questionNumber: i + 1,
        studentAnswer: ['A','B','C','D'][Math.floor(Math.random()*4)],
        correctAnswer: ['A','B','C','D'][i % 4],
        isCorrect: false
    })).map(q => ({...q, isCorrect: q.studentAnswer === q.correctAnswer}));

    const uploadProps = {
        name: 'file',
        multiple: false,
        accept: 'image/*',
        showUploadList: false,
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error('Chỉ được upload file ảnh!');
                return false;
            }
            const reader = new FileReader();
            reader.onload = (e) => setImageUrl(e.target.result);
            reader.readAsDataURL(file);

            message.loading({ content: 'Đang phân tích bài làm...', key: 'ocr' });
            setTimeout(() => {
                setOcrResults(mockOCRResults);
                message.success({ content: 'Hoàn tất chấm điểm!', key: 'ocr' });
            }, 1500);
            return false; 
        },
    };

    const correctCount = ocrResults.filter(r => r.isCorrect).length;
    const score = ocrResults.length > 0 ? (correctCount / ocrResults.length) * 10 : 0;

    const columns = [
        { title: 'Câu', dataIndex: 'questionNumber', width: 60, align: 'center' },
        { 
            title: 'Đáp án HS', 
            dataIndex: 'studentAnswer',
            align: 'center',
            render: (text) => <Tag color="blue">{text}</Tag>
        },
        { 
            title: 'Đáp án Đúng', 
            dataIndex: 'correctAnswer', 
            align: 'center',
            render: (text) => <Tag color="green">{text}</Tag>
        },
        {
            title: 'Kết quả',
            dataIndex: 'isCorrect',
            align: 'center',
            render: (isCorrect) => isCorrect 
                ? <CheckCircleOutlined style={{ color: '#10b981' }} />
                : <CloseCircleOutlined style={{ color: '#ef4444' }} />
        }
    ];

    return (
        <div style={{ height: 'calc(100vh - 120px)' }}>
            <Row gutter={24} style={{ height: '100%' }}>
                {/* CỘT TRÁI: ẢNH BÀI LÀM */}
                <Col span={14} style={{ height: '100%' }}>
                    <Card 
                        title={<Space><FileImageOutlined /> Phiếu trả lời trắc nghiệm</Space>} 
                        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        bodyStyle={{ flex: 1, padding: 0, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
                    >
                        {imageUrl ? (
                            <img src={imageUrl} alt="Exam Paper" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        ) : (
                            <div style={{ width: '80%', height: '60%' }}>
                                <Dragger {...uploadProps} style={{ padding: '40px 0', background: 'white', borderRadius: 16, border: '2px dashed #0891b2' }}>
                                    <p className="ant-upload-drag-icon">
                                        <CloudUploadOutlined style={{ color: '#0891b2', fontSize: 64 }} />
                                    </p>
                                    <p className="ant-upload-text" style={{ fontSize: 18, fontWeight: 500 }}>
                                        Kéo thả hoặc nhấn để tải ảnh lên
                                    </p>
                                    <p className="ant-upload-hint">Hỗ trợ định dạng JPG, PNG. Tối đa 10MB.</p>
                                </Dragger>
                            </div>
                        )}
                    </Card>
                </Col>

                {/* CỘT PHẢI: KẾT QUẢ */}
                <Col span={10} style={{ height: '100%' }}>
                    <Card 
                        title="Kết quả chấm tự động" 
                        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        bodyStyle={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                        extra={<Button onClick={() => { setImageUrl(null); setOcrResults([]); }}>Làm mới</Button>}
                    >
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ fontWeight: 500 }}>Mã học sinh:</label>
                            <Input 
                                placeholder="Nhập SBD hoặc Tên..." 
                                value={studentId}
                                onChange={e => setStudentId(e.target.value)}
                                style={{ marginTop: 8 }}
                            />
                        </div>

                        {ocrResults.length > 0 ? (
                            <>
                                <Alert
                                    message={`ĐIỂM SỐ: ${score.toFixed(2)}`}
                                    description={`Đúng ${correctCount}/${ocrResults.length} câu.`}
                                    type={score >= 5 ? "success" : "warning"}
                                    showIcon
                                    style={{ marginBottom: 16 }}
                                />
                                <div style={{ flex: 1, overflow: 'auto' }}>
                                    <Table dataSource={ocrResults} columns={columns} rowKey="questionId" pagination={false} size="small" sticky />
                                </div>
                                <Button type="primary" size="large" icon={<SaveOutlined />} block style={{ marginTop: 16 }} loading={loading}>
                                    Lưu kết quả
                                </Button>
                            </>
                        ) : (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Vui lòng upload ảnh để bắt đầu chấm" />
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default OCRGrading;