import { useState } from 'react';
import { Steps, Card, Form, Input, InputNumber, Select, Button, message, Table, Tag, Divider, Row, Col, Slider, Typography, Alert } from 'antd';
import { FormOutlined, AppstoreAddOutlined, EyeOutlined, SaveOutlined, ArrowLeftOutlined, ArrowRightOutlined, DatabaseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';

const { Option } = Select;
const { Title, Text } = Typography;

const ExamCreationWizard = () => {
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const [examData, setExamData] = useState({ easy: 5, medium: 3, hard: 2 });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleStep1 = async (values) => { setExamData({ ...examData, ...values }); setCurrent(1); };
    const handleStep2 = async (values) => { setExamData({ ...examData, ...values }); setCurrent(2); };

    const handleFinalSubmit = async () => {
        setLoading(true);
        message.loading({ content: 'Đang trích xuất câu hỏi từ Ngân hàng dữ liệu...', key: 'create' });
        
        try {
            // Giả lập API delay
            setTimeout(() => {
                message.success({ content: 'Tạo đề thành công! Đã lưu vào danh sách.', key: 'create' });
                navigate('/teacher/exams');
            }, 2000);
        } catch (error) {
            message.error('Lỗi khi tạo đề!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <Card bordered={false} style={{ borderRadius: 16 }}>
                <Steps current={current} items={[{ title: 'Thiết lập', icon: <FormOutlined /> }, { title: 'Ma trận', icon: <AppstoreAddOutlined /> }, { title: 'Xem trước', icon: <EyeOutlined /> }]} style={{ marginBottom: 40 }} />

                {current === 0 && (
                    <Form form={form} layout="vertical" onFinish={handleStep1} initialValues={examData}>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item label="Tên đề thi" name="examName" rules={[{ required: true }]}>
                                    <Input placeholder="VD: Kiểm tra 1 tiết Hóa" size="large" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Chủ đề kiến thức" name="topicId" rules={[{ required: true }]}>
                                    <Select placeholder="Chọn chủ đề lấy câu hỏi" size="large">
                                        <Option value="Cấu tạo chất">Cấu tạo chất</Option>
                                        <Option value="Phản ứng hóa học">Phản ứng hóa học</Option>
                                        <Option value="Hóa học hữu cơ">Hóa học hữu cơ</Option>
                                        <Option value="Hóa học vô cơ">Hóa học vô cơ</Option>
                                        <Option value="Tổng hợp">Tổng hợp</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Thời gian (phút)" name="duration" initialValue={45}>
                                    <InputNumber min={5} style={{ width: '100%' }} size="large" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <div style={{ textAlign: 'right', marginTop: 20 }}>
                            <Button type="primary" htmlType="submit" size="large" icon={<ArrowRightOutlined />}>Tiếp theo</Button>
                        </div>
                    </Form>
                )}

                {current === 1 && (
                    <Form form={form} layout="vertical" onFinish={handleStep2} initialValues={examData}>
                        <Alert message="Hệ thống sẽ lấy ngẫu nhiên câu hỏi từ Ngân hàng theo cấu hình này." type="info" showIcon icon={<DatabaseOutlined />} style={{ marginBottom: 24 }} />
                        <div style={{ background: '#f8fafc', padding: 24, borderRadius: 12 }}>
                            <Form.Item label="Dễ" name="easy"><Slider max={20} /></Form.Item>
                            <Form.Item label="Trung bình" name="medium"><Slider max={20} /></Form.Item>
                            <Form.Item label="Khó" name="hard"><Slider max={20} /></Form.Item>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                            <Button onClick={() => setCurrent(0)}>Quay lại</Button>
                            <Button type="primary" htmlType="submit">Xem trước</Button>
                        </div>
                    </Form>
                )}

                {current === 2 && (
                    <div>
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <Title level={3}>{examData.examName}</Title>
                            <Text strong>Chủ đề: {examData.topicId} </Text> | <Text> Thời gian: {examData.duration} phút</Text>
                        </div>
                        <Alert message="Sẵn sàng sinh đề từ Ngân hàng câu hỏi" type="success" showIcon style={{ marginBottom: 20 }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button onClick={() => setCurrent(1)}>Sửa lại</Button>
                            <Button type="primary" onClick={handleFinalSubmit} loading={loading} icon={<SaveOutlined />}>Lưu & Sinh đề</Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};
export default ExamCreationWizard;