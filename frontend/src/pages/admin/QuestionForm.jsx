import { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Radio, Card, message, Space, Modal, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../../config/api';
import { RobotOutlined } from '@ant-design/icons';

const { Option } = Select;

const QuestionForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // AI States
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [aiLevel, setAiLevel] = useState('MEDIUM');
    const [prompts, setPrompts] = useState([]);
    const [topics, setTopics] = useState([]); // [NEW] Topic list
    const [selectedPrompt, setSelectedPrompt] = useState('question_generation_mcq');

    // Fetch Prompts & Topics on Mount
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [promptsRes, topicsRes] = await Promise.all([
                    api.get('/prompts'),
                    api.get('/topics')
                ]);
                setPrompts(promptsRes);
                setTopics(topicsRes);
            } catch (e) {
                console.error("Failed to load initial data", e);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (id) {
            fetchQuestionDetail(id);
        }
    }, [id]);

    const fetchQuestionDetail = async (questionId) => {
        try {
            const response = await api.get(`/questions/${questionId}`);

            // Map API structure to Form structure
            const formData = {
                topicId: response.topic?.id,
                content: response.content,
                level: response.level,
                answers: {},
                correctAnswer: null
            };

            // Map Answers Array -> Form Object { A: {...}, B: {...} }
            if (Array.isArray(response.answers)) {
                response.answers.forEach(ans => {
                    formData.answers[ans.code] = { content: ans.content };
                    if (ans.isCorrect) {
                        formData.correctAnswer = ans.code;
                    }
                });
            }

            form.setFieldsValue(formData);
        } catch (error) {
            message.error('Không thể tải thông tin câu hỏi!');
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            if (id) {
                await api.put(`/questions/${id}`, values);
                message.success('Cập nhật câu hỏi thành công!');
            } else {
                await api.post('/questions', values);
                message.success('Thêm câu hỏi thành công!');
            }
            navigate('/admin/questions');
        } catch (error) {
            console.error('❌ Submit error:', error);
            message.error('Lưu thất bại!');
        } finally {
            setLoading(false);
        }
    };

    // --- AI GENERATION HANDLER ---
    const handleAiGenerate = async () => {
        if (!aiTopic.trim()) {
            message.warning('Vui lòng nhập chủ đề câu hỏi!');
            return;
        }

        setAiLoading(true);
        try {
            // Call API
            const response = await api.post('/ai/generate-question', {
                topic: aiTopic,
                level: aiLevel,
                subject: 'Hóa học',
                grade: 'Lớp 10',
                promptName: selectedPrompt // Pass selected prompt
            });

            // Handle AI Response
            let data = response;
            if (typeof response === 'string') {
                try {
                    let jsonStr = response.replace(/^```json/, '').replace(/```$/, '');
                    data = JSON.parse(jsonStr);
                } catch (e) {
                    message.error("Lỗi format từ AI!");
                    return;
                }
            }

            // Fill Form
            form.setFieldsValue({
                content: data.question || data.content,
                level: aiLevel,
                answers: {
                    A: { content: data.A },
                    B: { content: data.B },
                    C: { content: data.C },
                    D: { content: data.D }
                },
                correctAnswer: data.correctAnswer
            });

            message.success('Đã tạo câu hỏi từ AI!');
            setIsAiModalOpen(false);

        } catch (error) {
            message.error('Tạo câu hỏi thất bại: ' + (error.response?.data?.message || error.message));
        } finally {
            setAiLoading(false);
        }
    };

    // --- QUILL MODULES ---
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['image', 'link'],
            ['clean'],
        ],
    };

    return (
        <Card title={id ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ level: 'EASY' }}
            >
                <Form.Item
                    label="Chủ đề"
                    name="topicId"
                    rules={[{ required: true, message: 'Vui lòng chọn chủ đề!' }]}
                >
                    <Select placeholder="Chọn chủ đề" size="large">
                        {topics.map(t => (
                            <Option key={t.id} value={t.id}>{t.title}</Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* AI BUTTON */}
                <div style={{ marginBottom: 16, textAlign: 'right' }}>
                    <Button
                        type="dashed"
                        icon={<RobotOutlined />}
                        onClick={() => setIsAiModalOpen(true)}
                    >
                        Tạo câu hỏi tự động với AI
                    </Button>
                </div>

                <Form.Item
                    label="Nội dung câu hỏi"
                    name="content"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi!' }]}
                >
                    <ReactQuill
                        theme="snow"
                        modules={modules}
                        placeholder="Nhập nội dung câu hỏi (hỗ trợ hình ảnh, công thức)..."
                        style={{ height: 200, marginBottom: 50 }}
                    />
                </Form.Item>

                <Form.Item
                    label="Độ khó"
                    name="level"
                    rules={[{ required: true, message: 'Vui lòng chọn độ khó!' }]}
                >
                    <Radio.Group>
                        <Radio value="EASY">Dễ</Radio>
                        <Radio value="MEDIUM">Trung bình</Radio>
                        <Radio value="HARD">Khó</Radio>
                    </Radio.Group>
                </Form.Item>

                {['A', 'B', 'C', 'D'].map((code) => (
                    <Form.Item
                        key={code}
                        label={`Đáp án ${code}`}
                        name={['answers', code, 'content']}
                        rules={[{ required: true, message: `Vui lòng nhập đáp án ${code}!` }]}
                    >
                        <Input placeholder={`Nhập đáp án ${code}`} size="large" />
                    </Form.Item>
                ))}

                <Form.Item
                    label="Đáp án đúng"
                    name="correctAnswer"
                    rules={[{ required: true, message: 'Vui lòng chọn đáp án đúng!' }]}
                >
                    <Radio.Group>
                        <Radio value="A">A</Radio>
                        <Radio value="B">B</Radio>
                        <Radio value="C">C</Radio>
                        <Radio value="D">D</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit" loading={loading} size="large">
                            {id ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                        <Button onClick={() => navigate('/admin/questions')} size="large">
                            Hủy
                        </Button>
                    </Space>
                </Form.Item>
            </Form>

            {/* AI MODAL */}
            <Modal
                title="Tạo câu hỏi tự động (Gemini Express)"
                open={isAiModalOpen}
                onCancel={() => setIsAiModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsAiModalOpen(false)}>Hủy</Button>,
                    <Button
                        key="generate"
                        type="primary"
                        icon={<RobotOutlined />}
                        onClick={handleAiGenerate}
                        loading={aiLoading}
                    >
                        Tạo
                    </Button>
                ]}
            >
                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8 }}>Chủ đề / Keyword:</label>
                    <Input
                        placeholder="Ví dụ: Axit Sulfuric, Hidrocacbon..."
                        value={aiTopic}
                        onChange={(e) => setAiTopic(e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8 }}>Mẫu Prompt (AI Personality):</label>
                    <Select
                        value={selectedPrompt}
                        onChange={setSelectedPrompt}
                        style={{ width: '100%' }}
                        placeholder="Chọn mẫu prompt..."
                    >
                        {prompts.map(p => (
                            <Option key={p.id} value={p.name}>{p.name}</Option>
                        ))}
                    </Select>
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8 }}>Độ khó:</label>
                    <Radio.Group value={aiLevel} onChange={(e) => setAiLevel(e.target.value)}>
                        <Radio value="EASY">Dễ</Radio>
                        <Radio value="MEDIUM">Trung bình</Radio>
                        <Radio value="HARD">Khó</Radio>
                    </Radio.Group>
                </div>
                {aiLoading && (
                    <div style={{ textAlign: 'center', margin: '20px 0' }}>
                        <Spin tip="AI đang suy nghĩ..." />
                    </div>
                )}
            </Modal>
        </Card>
    );
};

export default QuestionForm;