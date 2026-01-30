import { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Radio, Card, message, Space, Modal, Spin, Row, Col, Tag } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined, RobotOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../../config/api';
import MathRenderer from '../../components/MathRenderer';
import LoadingSpinner from '../../components/LoadingSpinner';
import { showErrorMessage, showSuccessMessage } from '../../utils/errorHandler';

const { Option } = Select;

const QuestionForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(id ? true : false);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Data states
    const [topics, setTopics] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [grades, setGrades] = useState([]);

    // AI Modal states
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [aiLevel, setAiLevel] = useState('MEDIUM');
    const [prompts, setPrompts] = useState([]);
    const [selectedPrompt, setSelectedPrompt] = useState('question_generation_mcq');

    // Preview state
    const [previewMode, setPreviewMode] = useState(false);

    // Fetch initial data (Topics, Subjects, Grades, Prompts)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [topicsRes, subjectsRes, gradesRes, promptsRes] = await Promise.all([
                    api.get('/topics').catch(() => []),
                    api.get('/subjects').catch(() => []),
                    api.get('/grades').catch(() => []),
                    api.get('/prompts').catch(() => []),
                ]);

                setTopics(Array.isArray(topicsRes) ? topicsRes : []);
                setSubjects(Array.isArray(subjectsRes) ? subjectsRes : []);
                setGrades(Array.isArray(gradesRes) ? gradesRes : []);
                setPrompts(Array.isArray(promptsRes) ? promptsRes : []);
            } catch (error) {
                console.error('Failed to load initial data: - QuestionForm.jsx:54', error);
            }
        };
        fetchData();
    }, []);

    // Fetch question detail if editing
    useEffect(() => {
        if (id) {
            fetchQuestionDetail(id);
        } else {
            setPageLoading(false);
        }
    }, [id]);

    const fetchQuestionDetail = async (questionId) => {
        setPageLoading(true);
        try {
            const response = await api.get(`/questions/${questionId}`);

            const formData = {
                topicId: response.topic?.id,
                content: response.content,
                level: response.level,
                answers: {},
                correctAnswer: null
            };

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
            showErrorMessage(error, 'Không thể tải thông tin câu hỏi!');
            navigate('/admin/questions');
        } finally {
            setPageLoading(false);
        }
    };

    const onFinish = async (values) => {
        // Validate answers
        const answers = values.answers || {};
        const answerEntries = Object.entries(answers).filter(([_, ans]) => ans?.content?.trim());

        if (answerEntries.length < 4) {
            message.error('Phải nhập đầy đủ 4 đáp án!');
            return;
        }

        if (!values.correctAnswer) {
            message.error('Phải chọn đáp án đúng!');
            return;
        }

        setSubmitLoading(true);
        try {
            // Fix payload: answers là Map { "A": {content: "..."}, "B": {...} }
            // correctAnswer là string "A", "B",...
            const payload = {
                topicId: values.topicId,
                content: values.content,
                level: values.level,
                answers: Object.fromEntries(
                    answerEntries.map(([code, ans]) => [code, { content: ans.content }])
                ),
                correctAnswer: values.correctAnswer  // Đúng theo backend QuestionRequest
            };

            if (id) {
                await api.put(`/questions/${id}`, payload);
                showSuccessMessage('Cập nhật câu hỏi thành công!');
            } else {
                await api.post('/questions', payload);
                showSuccessMessage('Thêm câu hỏi thành công!');
            }

            navigate('/admin/questions');
        } catch (error) {
            showErrorMessage(error, 'Lưu thất bại!');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = () => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc muốn xóa câu hỏi này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                setSubmitLoading(true);
                try {
                    await api.delete(`/questions/${id}`);
                    showSuccessMessage('Xóa câu hỏi thành công!');
                    navigate('/admin/questions');
                } catch (error) {
                    showErrorMessage(error, 'Xóa thất bại!');
                } finally {
                    setSubmitLoading(false);
                }
            }
        });
    };

    const handleAiGenerate = async () => {
        if (!aiTopic.trim()) {
            message.warning('Vui lòng nhập chủ đề câu hỏi!');
            return;
        }

        setAiLoading(true);
        try {
            const response = await api.post('/ai/generate-question', {
                topic: aiTopic,
                level: aiLevel,
                subject: 'Hóa học',
                grade: 'Lớp 10', // Có thể lấy từ form nếu cần
                promptName: selectedPrompt
            });

            let data = response;
            // Xử lý nếu AI trả về string JSON
            if (typeof response === 'string') {
                try {
                    let jsonStr = response.replace(/^```json/, '').replace(/```$/, '').trim();
                    data = JSON.parse(jsonStr);
                } catch (e) {
                    message.error('Lỗi format dữ liệu từ AI!');
                    return;
                }
            }

            // Điền form từ response AI
            form.setFieldsValue({
                content: data.question || data.content || '',
                level: aiLevel,
                answers: {
                    A: { content: data.A || data.a || '' },
                    B: { content: data.B || data.b || '' },
                    C: { content: data.C || data.c || '' },
                    D: { content: data.D || data.d || '' }
                },
                correctAnswer: data.correctAnswer || data.correct || 'A'
            });

            showSuccessMessage('Đã tạo câu hỏi từ AI!');
            setIsAiModalOpen(false);
        } catch (error) {
            showErrorMessage(error, 'Tạo câu hỏi từ AI thất bại!');
        } finally {
            setAiLoading(false);
        }
    };

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'formula'],
            [{ 'color': [] }, { 'background': [] }],
            ['clean']
        ]
    };

    if (pageLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <Card style={{ marginBottom: '24px' }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/admin/questions')}
                            style={{ marginRight: '16px' }}
                        >
                            Quay lại
                        </Button>
                        <span style={{ fontSize: '18px', fontWeight: '600' }}>
                            {id ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}
                        </span>
                    </Col>
                    <Space>
                        <Button onClick={() => setPreviewMode(!previewMode)}>
                            {previewMode ? 'Chế độ sửa' : 'Xem trước'}
                        </Button>
                        {id && (
                            <Button danger icon={<DeleteOutlined />} onClick={handleDelete} loading={submitLoading}>
                                Xóa
                            </Button>
                        )}
                    </Space>
                </Row>
            </Card>

            {/* Main Form */}
            {!previewMode ? (
                <Card style={{ marginBottom: '24px' }}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        {/* Topic Selection */}
                        <Form.Item
                            label="Chủ đề câu hỏi"
                            name="topicId"
                            rules={[{ required: true, message: 'Vui lòng chọn chủ đề!' }]}
                        >
                            <Select placeholder="Chọn chủ đề">
                                {topics.map(topic => (
                                    <Option key={topic.id} value={topic.id}>
                                        {topic.title}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* Question Content */}
                        <Form.Item
                            label="Nội dung câu hỏi"
                            name="content"
                            rules={[
                                { required: true, message: 'Vui lòng nhập nội dung câu hỏi!' },
                                { min: 10, message: 'Nội dung câu hỏi tối thiểu 10 ký tự!' }
                            ]}
                        >
                            <ReactQuill
                                modules={quillModules}
                                theme="snow"
                                style={{ minHeight: '200px', marginBottom: '16px' }}
                                placeholder="Nhập nội dung câu hỏi (hỗ trợ công thức hóa học)"
                            />
                        </Form.Item>

                        {/* Difficulty Level */}
                        <Form.Item
                            label="Độ khó"
                            name="level"
                            rules={[{ required: true, message: 'Vui lòng chọn độ khó!' }]}
                        >
                            <Radio.Group>
                                <Radio.Button value="EASY">Dễ</Radio.Button>
                                <Radio.Button value="MEDIUM">Trung bình</Radio.Button>
                                <Radio.Button value="HARD">Khó</Radio.Button>
                            </Radio.Group>
                        </Form.Item>

                        {/* Answers */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ fontWeight: '600', marginBottom: '12px', display: 'block' }}>
                                Các đáp án
                            </label>
                            {['A', 'B', 'C', 'D'].map(code => (
                                <Row key={code} gutter={16} style={{ marginBottom: '12px' }}>
                                    <Col span={2}>
                                        <Form.Item
                                            name={['answers', code, 'isCorrect']}
                                            style={{ marginBottom: 0 }}
                                        >
                                            <Checkbox>
                                                <strong>{code}</strong>
                                            </Checkbox>
                                        </Form.Item>
                                    </Col>
                                    <Col span={22}>
                                        <Form.Item
                                            name={['answers', code, 'content']}
                                            rules={[{ required: true, message: `Nhập đáp án ${code}!` }]}
                                            style={{ marginBottom: 0 }}
                                        >
                                            <Input
                                                placeholder={`Nhập nội dung đáp án ${code}`}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            ))}
                        </div>

                        {/* Correct Answer Indicator */}
                        <Form.Item
                            label="Đáp án đúng"
                            name="correctAnswer"
                            rules={[{ required: true, message: 'Vui lòng chọn đáp án đúng!' }]}
                        >
                            <Radio.Group>
                                <Radio.Button value="A">A</Radio.Button>
                                <Radio.Button value="B">B</Radio.Button>
                                <Radio.Button value="C">C</Radio.Button>
                                <Radio.Button value="D">D</Radio.Button>
                            </Radio.Group>
                        </Form.Item>

                        {/* Actions */}
                        <Form.Item>
                            <Space>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SaveOutlined />}
                                    loading={submitLoading}
                                    size="large"
                                >
                                    {id ? 'Cập nhật' : 'Thêm câu hỏi'}
                                </Button>
                                <Button
                                    icon={<RobotOutlined />}
                                    onClick={() => setIsAiModalOpen(true)}
                                >
                                    Tạo bằng AI
                                </Button>
                                <Button onClick={() => navigate('/admin/questions')}>
                                    Hủy
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>
            ) : (
                /* Preview Mode */
                <Card>
                    <h2>Xem trước câu hỏi</h2>
                    <div style={{ marginTop: '16px' }}>
                        <h3>Nội dung:</h3>
                        <MathRenderer content={form.getFieldValue('content') || ''} />

                        <h3 style={{ marginTop: '24px' }}>Đáp án:</h3>
                        {['A', 'B', 'C', 'D'].map(code => {
                            const answerContent = form.getFieldValue(['answers', code, 'content']);
                            const isCorrect = form.getFieldValue('correctAnswer') === code;
                            return (
                                <div key={code} style={{ marginBottom: '12px', padding: '8px', border: isCorrect ? '2px solid green' : '1px solid #ddd', borderRadius: '4px' }}>
                                    <strong>{code}. </strong>
                                    <MathRenderer content={answerContent || ''} inline />
                                    {isCorrect && <Tag color="green" style={{ marginLeft: '8px' }}>Đúng</Tag>}
                                </div>
                            );
                        })}
                    </div>
                </Card>
            )}

            {/* AI Modal */}
            <Modal
                title="Tạo câu hỏi bằng AI"
                open={isAiModalOpen}
                onCancel={() => setIsAiModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsAiModalOpen(false)}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" loading={aiLoading} onClick={handleAiGenerate}>
                        Tạo câu hỏi
                    </Button>
                ]}
            >
                <Form layout="vertical">
                    <Form.Item label="Chủ đề">
                        <Input
                            placeholder="VD: Halogen, Axit, Sunfat"
                            value={aiTopic}
                            onChange={e => setAiTopic(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Độ khó">
                        <Radio.Group value={aiLevel} onChange={e => setAiLevel(e.target.value)}>
                            <Radio.Button value="EASY">Dễ</Radio.Button>
                            <Radio.Button value="MEDIUM">Trung bình</Radio.Button>
                            <Radio.Button value="HARD">Khó</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Mẫu Prompt">
                        <Select value={selectedPrompt} onChange={setSelectedPrompt}>
                            {prompts.map(prompt => (
                                <Option key={prompt.id} value={prompt.name}>
                                    {prompt.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default QuestionForm;