import { useState } from 'react';
import { Steps, Card, Form, Input, InputNumber, Select, Button, Space, message, Table, Tag, Divider } from 'antd';
import { CheckCircleOutlined, FormOutlined, EyeOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';

const { Step } = Steps;
const { Option } = Select;

const ExamCreationWizard = () => {
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const [examData, setExamData] = useState({});
    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleStep1 = async (values) => {
        setExamData({ ...examData, ...values });
        setCurrent(1);
    };

    const handleStep2 = async (values) => {
        const fullData = { ...examData, ...values };
        setExamData(fullData);
        
        setPreviewData({
            ...fullData,
            totalQuestions: values.easy + values.medium + values.hard
        });
        setCurrent(2);
    };

    const handleFinalSubmit = async () => {
        setLoading(true);
        try {
            // CẬP NHẬT PAYLOAD ĐẦY ĐỦ
            const payload = {
                examName: examData.examName, // Tên đề
                topicId: examData.topicId,
                duration: examData.duration, // Thời gian
                easy: examData.easy,
                medium: examData.medium,
                hard: examData.hard
            };

            const response = await api.post('/exams/generate', payload);
            
            message.success(`Tạo đề thi thành công! Mã đề: ${response.examCode}`);
            navigate(`/teacher/exams/${response.id}`); // Chuyển ngay sang trang chi tiết để xem/in
        } catch (error) {
            console.error(error);
            message.error('Tạo đề thi thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        {
            title: 'Thông tin',
            icon: <FormOutlined />,
            content: (
                <Form form={form} layout="vertical" onFinish={handleStep1}>
                    <Form.Item label="Tên đề thi" name="examName" rules={[{ required: true, message: 'Vui lòng nhập tên đề thi' }]}>
                        <Input placeholder="VD: Kiểm tra 15 phút - Hóa Vô Cơ" size="large" />
                    </Form.Item>
                    <Form.Item label="Chủ đề" name="topicId" rules={[{ required: true, message: 'Vui lòng chọn chủ đề' }]}>
                        <Select placeholder="Chọn chủ đề" size="large">
                            {/* CẬP NHẬT DANH SÁCH CHỦ ĐỀ KHỚP DATABASE */}
                            <Option value={1}>Toán</Option>
                            <Option value={2}>Vật lí</Option>
                            <Option value={3}>Hóa học</Option>
                            <Option value={4}>Tiếng Anh</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Thời gian (phút)" name="duration" initialValue={15} rules={[{ required: true }]}>
                        <InputNumber min={5} max={180} style={{ width: '100%' }} size="large" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" size="large" block>Tiếp theo</Button>
                </Form>
            )
        },
        {
            title: 'Ma trận đề',
            icon: <CheckCircleOutlined />,
            content: (
                <Form form={form} layout="vertical" onFinish={handleStep2}>
                    <Card title="Cấu hình số lượng câu hỏi theo độ khó" style={{ marginBottom: 24 }}>
                        <Form.Item label="Câu dễ" name="easy" initialValue={5} rules={[{ required: true }]}>
                            <InputNumber min={0} max={50} style={{ width: '100%' }} size="large" addonAfter={<Tag color="green">EASY</Tag>} />
                        </Form.Item>
                        <Form.Item label="Câu trung bình" name="medium" initialValue={3} rules={[{ required: true }]}>
                            <InputNumber min={0} max={50} style={{ width: '100%' }} size="large" addonAfter={<Tag color="orange">MEDIUM</Tag>} />
                        </Form.Item>
                        <Form.Item label="Câu khó" name="hard" initialValue={2} rules={[{ required: true }]}>
                            <InputNumber min={0} max={50} style={{ width: '100%' }} size="large" addonAfter={<Tag color="red">HARD</Tag>} />
                        </Form.Item>
                    </Card>
                    <Space style={{ width: '100%' }} direction="vertical">
                        <Button type="primary" htmlType="submit" size="large" block>Xem trước</Button>
                        <Button onClick={() => setCurrent(0)} size="large" block>Quay lại</Button>
                    </Space>
                </Form>
            )
        },
        {
            title: 'Xem trước',
            icon: <EyeOutlined />,
            content: previewData && (
                <Card>
                    <h2>Xem trước cấu hình đề thi</h2>
                    <Divider />
                    <Table
                        dataSource={[
                            { key: '1', label: 'Tên đề', value: previewData.examName },
                            { key: '2', label: 'Chủ đề', value: `Topic ${previewData.topicId}` },
                            { key: '3', label: 'Thời gian', value: `${previewData.duration} phút` },
                            { key: '4', label: 'Câu dễ', value: previewData.easy },
                            { key: '5', label: 'Câu trung bình', value: previewData.medium },
                            { key: '6', label: 'Câu khó', value: previewData.hard },
                            { key: '7', label: 'Tổng câu', value: <Tag color="blue">{previewData.totalQuestions}</Tag> }
                        ]}
                        columns={[
                            { title: 'Thông tin', dataIndex: 'label', key: 'label' },
                            { title: 'Giá trị', dataIndex: 'value', key: 'value' }
                        ]}
                        pagination={false}
                        showHeader={false}
                    />
                    <Divider />
                    <Space style={{ width: '100%' }} direction="vertical">
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            size="large"
                            block
                            loading={loading}
                            onClick={handleFinalSubmit}
                        >
                            Tạo đề thi
                        </Button>
                        <Button onClick={() => setCurrent(1)} size="large" block>
                            Quay lại
                        </Button>
                    </Space>
                </Card>
            )
        }
    ];

    return (
        <Card>
            <Steps current={current} style={{ marginBottom: 32 }}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title} icon={item.icon} />
                ))}
            </Steps>
            <div style={{ marginTop: 24 }}>
                {steps[current].content}
            </div>
        </Card>
    );
};

export default ExamCreationWizard;