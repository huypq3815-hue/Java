import { useState } from 'react';
import { Card, Upload, Row, Col, Table, Button, message, Space, Input, Divider, Alert, Select, Empty, Typography } from 'antd';
import { CloudUploadOutlined, CheckCircleOutlined, CloseCircleOutlined, SaveOutlined, FileImageOutlined, UserOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const { Option } = Select;
const { Title } = Typography;

const StandaloneOCR = () => {
    const [imageUrl, setImageUrl] = useState(null);
    const [ocrResults, setOcrResults] = useState([]);
    const [studentInfo, setStudentInfo] = useState({ id: '', name: '' });
    const [loading, setLoading] = useState(false);

    // Mock AI Analysis
    const processImage = (file) => {
        setLoading(true);
        const reader = new FileReader();
        reader.onload = (e) => setImageUrl(e.target.result);
        reader.readAsDataURL(file);

        setTimeout(() => {
            const mockData = Array.from({ length: 10 }, (_, i) => ({
                q: i + 1,
                studentAns: ['A','B','C','D'][Math.floor(Math.random() * 4)],
                correctAns: ['A','B','C','D'][i % 4],
            })).map(item => ({ ...item, isCorrect: item.studentAns === item.correctAns }));
            
            setOcrResults(mockData);
            setLoading(false);
            message.success('Phân tích bài làm thành công!');
        }, 1500);
        return false;
    };

    const handleResultChange = (index, field, value) => {
        const newResults = [...ocrResults];
        newResults[index][field] = value;
        if(field === 'studentAns' || field === 'correctAns') {
            newResults[index].isCorrect = newResults[index].studentAns === newResults[index].correctAns;
        }
        setOcrResults(newResults);
    };

    // 💾 LƯU KẾT QUẢ VÀO "DATABASE" (LocalStorage)
    const handleSaveResults = () => {
        if (!studentInfo.id || !studentInfo.name) {
            return message.error('Vui lòng nhập Mã và Tên học sinh!');
        }

        const score = parseFloat((ocrResults.filter(r => r.isCorrect).length / ocrResults.length * 10).toFixed(2));
        
        // Tạo object kết quả
        const newResult = {
            id: Date.now(),
            studentId: studentInfo.id,
            fullName: studentInfo.name,
            score: score,
            answers: ocrResults,
            examId: 'CHEM-MOCK-01' // Mặc định gán vào 1 mã đề để demo liên kết
        };

        // Lưu vào localStorage
        const currentResults = JSON.parse(localStorage.getItem('exam_results') || '[]');
        localStorage.setItem('exam_results', JSON.stringify([...currentResults, newResult]));

        message.success(`Đã lưu điểm số (${score}đ) vào hệ thống!`);
        
        // Reset form
        setImageUrl(null);
        setOcrResults([]);
        setStudentInfo({ id: '', name: '' });
    };

    const score = ocrResults.length ? (ocrResults.filter(r => r.isCorrect).length / ocrResults.length * 10).toFixed(2) : 0;

    const columns = [
        { title: 'Câu', dataIndex: 'q', align: 'center', width: 60 },
        { 
            title: 'Trò chọn', dataIndex: 'studentAns', align: 'center',
            render: (text, r, i) => <Select value={text} onChange={(val) => handleResultChange(i, 'studentAns', val)} style={{ width: 70 }} status={r.isCorrect ? '' : 'error'}>{['A','B','C','D'].map(o => <Option key={o} value={o}>{o}</Option>)}</Select>
        },
        { 
            title: 'Đáp án', dataIndex: 'correctAns', align: 'center',
            render: (text, r, i) => <Select value={text} onChange={(val) => handleResultChange(i, 'correctAns', val)} style={{ width: 70 }}>{['A','B','C','D'].map(o => <Option key={o} value={o}>{o}</Option>)}</Select>
        },
        { title: 'Đ/S', dataIndex: 'isCorrect', align: 'center', render: (val) => val ? <CheckCircleOutlined style={{ color: '#10b981' }} /> : <CloseCircleOutlined style={{ color: '#ef4444' }} /> }
    ];

    return (
        <div style={{ height: 'calc(100vh - 120px)', paddingBottom: 20 }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <Title level={4} style={{ margin: 0 }}>Chấm thi OCG (Optical Character Grading)</Title>
                {ocrResults.length > 0 && <Button onClick={() => { setImageUrl(null); setOcrResults([]); }}>Hủy</Button>}
            </div>

            <Row gutter={24} style={{ height: '100%' }}>
                <Col span={14} style={{ height: '100%' }}>
                    <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc', border: '1px dashed #d9d9d9' }} bodyStyle={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, overflow: 'hidden' }}>
                        {imageUrl ? <img src={imageUrl} alt="Exam" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /> : 
                            <Dragger name="file" multiple={false} beforeUpload={processImage} style={{ width: '80%', padding: 40, background: 'white' }}>
                                <p className="ant-upload-drag-icon"><CloudUploadOutlined style={{ color: '#0891b2', fontSize: 64 }} /></p>
                                <p className="ant-upload-text">Kéo thả ảnh bài thi vào đây</p>
                            </Dragger>
                        }
                    </Card>
                </Col>

                <Col span={10} style={{ height: '100%' }}>
                    <Card title="Kết quả chi tiết" style={{ height: '100%', display: 'flex', flexDirection: 'column' }} bodyStyle={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        {ocrResults.length > 0 ? (
                            <>
                                <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
                                    <Input placeholder="Mã học sinh (VD: HS001)" prefix={<UserOutlined />} value={studentInfo.id} onChange={e => setStudentInfo({...studentInfo, id: e.target.value})} />
                                    <Input placeholder="Tên học sinh" prefix={<UserOutlined />} value={studentInfo.name} onChange={e => setStudentInfo({...studentInfo, name: e.target.value})} />
                                    <Alert message={`ĐIỂM SỐ: ${score}`} type={score >= 5 ? 'success' : 'error'} showIcon style={{ fontWeight: 'bold' }} />
                                </Space>
                                <div style={{ flex: 1, overflow: 'auto' }}>
                                    <Table dataSource={ocrResults} columns={columns} pagination={false} size="small" rowKey="q" />
                                </div>
                                <Divider style={{ margin: '12px 0' }} />
                                <Button type="primary" icon={<SaveOutlined />} block size="large" onClick={handleSaveResults}>Lưu vào sổ điểm</Button>
                            </>
                        ) : <Empty description="Đang chờ ảnh bài thi..." style={{ marginTop: 60 }} />}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
export default StandaloneOCR;