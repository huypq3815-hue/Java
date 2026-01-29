import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Space, Alert } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../config/api';

const { TextArea } = Input;

const PromptForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // If ID exists -> Edit Mode
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchPromptDetail(id);
        }
    }, [id]);

    const fetchPromptDetail = async (promptId) => {
        try {
            // For now, let's assume /api/prompts sends all data and I filter. 
            const response = await api.get('/prompts');
            const prompt = response.find(p => p.id === parseInt(promptId));
            if (prompt) {
                form.setFieldsValue(prompt);
            } else {
                message.error('Không tìm thấy prompt!');
            }
        } catch (error) {
            message.error('Lỗi khi tải dữ liệu!');
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            if (id) {
                await api.put(`/prompts/${id}`, values);
                message.success('Cập nhật Prompt thành công!');
            } else {
                await api.post('/prompts', values);
                message.success('Thêm Prompt thành công!');
            }
            navigate('/admin/prompts');
        } catch (error) {
            console.error('Submit error:', error);
            message.error('Lưu thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title={id ? 'Chỉnh sửa Prompt' : 'Tạo Prompt mới'}>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="Tên Prompt (Unique Key)"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên prompt (VD: question_generation_mcq)!' }]}
                    help="Dùng tên này để gọi trong code (VD: 'question_generation_mcq')"
                >
                    <Input placeholder="VD: question_generation_mcq" disabled={!!id} />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                >
                    <Input placeholder="Mô tả ngắn gọn về chức năng của prompt này" />
                </Form.Item>

                <Form.Item
                    label="Nội dung Prompt"
                    name="content"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                >
                    <TextArea
                        rows={10}
                        placeholder="Nhập nội dung prompt... Sử dụng {placeholder} để thay thế giá trị động."
                        style={{ fontFamily: 'monospace' }}
                    />
                </Form.Item>

                <Alert
                    message="Hướng dẫn"
                    description="Sử dụng các biến như {topic}, {level}, {subject}, {grade} trong nộiunng. AI sẽ tự động thay thế khi chạy."
                    type="info"
                    showIcon
                    style={{ marginBottom: 24 }}
                />

                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit" loading={loading} size="large">
                            {id ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                        <Button onClick={() => navigate('/admin/prompts')} size="large">
                            Hủy
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default PromptForm;
