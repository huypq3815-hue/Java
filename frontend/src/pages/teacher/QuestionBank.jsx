import { useState, useEffect } from 'react';
import { 
    Card, Table, Button, Space, Tag, Modal, Form, Input, 
    Select, Radio, message, Row, Col, Tooltip, Popconfirm, Badge 
} from 'antd';
import { 
    PlusOutlined, EditOutlined, DeleteOutlined, 
    SearchOutlined, ReloadOutlined 
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../../config/api';

const { Option } = Select;

// Helper: Loại bỏ thẻ HTML để tìm kiếm text thuần
const stripHtml = (html) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
};

const QuestionBank = () => {
    // --- STATE ---
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState({ level: null });
    
    // Mock data topics (vì DataSeeder đã tạo chủ đề theo tên môn)
    const [topics, setTopics] = useState([
        { id: 1, title: 'Toán' },
        { id: 2, title: 'Vật lí' },
        { id: 3, title: 'Hóa học' },
        { id: 4, title: 'Tiếng anh' },
    ]);

    const [form] = Form.useForm();

    // --- FETCH DATA ---
    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/questions');
            setQuestions(response || []);
        } catch (error) {
            console.error('Lỗi tải dữ liệu: - QuestionBank.jsx:54', error);
            message.error('Không thể tải ngân hàng câu hỏi!');
        } finally {
            setLoading(false);
        }
    };

    // --- HANDLERS ---
    const handleFilterChange = (val) => {
        setFilters({ level: val });
    };

    const showAddModal = () => {
        setEditingQuestion(null);
        form.resetFields();
        form.setFieldsValue({
            answers: [
                { code: 'A', content: '', isCorrect: true },
                { code: 'B', content: '', isCorrect: false },
                { code: 'C', content: '', isCorrect: false },
                { code: 'D', content: '', isCorrect: false },
            ],
            level: 'EASY'
        });
        setIsModalVisible(true);
    };

    const showEditModal = (record) => {
        setEditingQuestion(record);
        form.setFieldsValue({
            content: record.content,
            topicId: record.topic?.id,
            level: record.level,
            answers: record.answers.map(a => ({
                id: a.id,
                code: a.code,
                content: a.content,
                isCorrect: a.isCorrect
            })),
            correctAnswerCode: record.answers.find(a => a.isCorrect)?.code || 'A'
        });
        setIsModalVisible(true);
    };

    const handleFormSubmit = async (values) => {
        try {
            const formattedAnswers = values.answers.map(ans => ({
                ...ans,
                isCorrect: ans.code === values.correctAnswerCode
            }));

            const payload = {
                content: values.content,
                level: values.level,
                topicId: values.topicId,
                answers: formattedAnswers
            };

            if (editingQuestion) {
                await api.put(`/questions/${editingQuestion.id}`, payload);
                message.success('Cập nhật thành công!');
            } else {
                await api.post('/questions', payload);
                message.success('Thêm mới thành công!');
            }

            setIsModalVisible(false);
            fetchInitialData();
        } catch (error) {
            message.error('Có lỗi xảy ra!');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/questions/${id}`);
            message.success('Đã xóa câu hỏi!');
            setQuestions(prev => prev.filter(q => q.id !== id));
        } catch (error) {
            message.error('Xóa thất bại!');
        }
    };

    // --- FILTER LOGIC (SEARCH) ---
    const filteredQuestions = questions.filter(q => {
        const plainContent = stripHtml(q.content).toLowerCase();
        const keyword = searchText.toLowerCase().trim();
        
        // Tìm theo Nội dung HOẶC Tên chủ đề
        const matchesSearch = plainContent.includes(keyword) || 
                              (q.topic?.title && q.topic.title.toLowerCase().includes(keyword));
        
        const matchesLevel = filters.level ? q.level === filters.level : true;
        
        return matchesSearch && matchesLevel;
    });

    // --- COLUMNS ---
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 60,
            align: 'center',
        },
        {
            title: 'Nội dung câu hỏi',
            dataIndex: 'content',
            key: 'content',
            render: (html) => (
                <div 
                    dangerouslySetInnerHTML={{ __html: html }} 
                    style={{ maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                />
            )
        },
        {
            title: 'Chủ đề',
            dataIndex: ['topic', 'title'],
            key: 'topic',
            width: 150,
            render: (text) => <Tag color="blue">{text || 'Chưa rõ'}</Tag>
        },
        {
            title: 'Độ khó',
            dataIndex: 'level',
            key: 'level',
            width: 100,
            align: 'center',
            render: (level) => {
                let color = level === 'EASY' ? 'green' : level === 'MEDIUM' ? 'orange' : 'red';
                return <Tag color={color}>{level}</Tag>;
            }
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Sửa">
                        <Button type="text" icon={<EditOutlined style={{ color: '#1890ff' }} />} onClick={() => showEditModal(record)} />
                    </Tooltip>
                    <Popconfirm title="Xóa?" onConfirm={() => handleDelete(record.id)}>
                        <Tooltip title="Xóa">
                            <Button type="text" icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 0 }}>
            <Card bordered={false} style={{ marginBottom: 16, borderRadius: 8 }}>
                <Row gutter={[16, 16]} align="middle" justify="space-between">
                    <Col xs={24} md={12}>
                        <Space>
                            {/* THANH TÌM KIẾM */}
                            <Input 
                                placeholder="Tìm kiếm câu hỏi..." 
                                prefix={<SearchOutlined />} 
                                onChange={e => setSearchText(e.target.value)}
                                style={{ width: 250 }}
                                allowClear
                            />
                            <Select 
                                placeholder="Lọc độ khó" 
                                style={{ width: 120 }}
                                allowClear
                                onChange={handleFilterChange}
                            >
                                <Option value="EASY">Dễ</Option>
                                <Option value="MEDIUM">Trung bình</Option>
                                <Option value="HARD">Khó</Option>
                            </Select>
                        </Space>
                    </Col>
                    <Col xs={24} md={12} style={{ textAlign: 'right' }}>
                        <Space>
                            <Button icon={<ReloadOutlined />} onClick={fetchInitialData}>Làm mới</Button>
                            <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
                                Thêm câu hỏi
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            <Card bordered={false} style={{ borderRadius: 8 }} bodyStyle={{ padding: '0' }}>
                <Table 
                    columns={columns} 
                    dataSource={filteredQuestions} 
                    rowKey="id" 
                    loading={loading}
                    pagination={{ pageSize: 8 }}
                />
            </Card>

            {/* MODAL GIỮ NGUYÊN NHƯ CŨ */}
            <Modal
                title={editingQuestion ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={800}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="topicId" label="Chủ đề" rules={[{ required: true }]}>
                                <Select>
                                    {topics.map(t => <Option key={t.id} value={t.id}>{t.title}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="level" label="Mức độ" rules={[{ required: true }]}>
                                <Select>
                                    <Option value="EASY">Dễ</Option>
                                    <Option value="MEDIUM">Trung bình</Option>
                                    <Option value="HARD">Khó</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="content" label="Nội dung" rules={[{ required: true }]}>
                        <ReactQuill theme="snow" style={{ height: 150, marginBottom: 50 }} />
                    </Form.Item>
                    <Form.Item label="Danh sách đáp án" required style={{ marginTop: 60 }}>
                        <Form.List name="answers">
                            {(fields) => (
                                <Form.Item name="correctAnswerCode" initialValue="A" style={{ marginBottom: 0 }}>
                                    <Radio.Group style={{ width: '100%' }}>
                                        {fields.map((field, index) => {
                                            const code = String.fromCharCode(65 + index);
                                            return (
                                                <Row key={field.key} gutter={8} align="middle" style={{ marginBottom: 12 }}>
                                                    <Col flex="40px" style={{ textAlign: 'center' }}>
                                                        <Radio value={code}><Badge count={code} style={{ backgroundColor: '#1890ff' }} /></Radio>
                                                    </Col>
                                                    <Col flex="auto">
                                                        <Form.Item {...field} name={[field.name, 'content']} rules={[{ required: true }]} noStyle>
                                                            <Input placeholder={`Đáp án ${code}`} />
                                                        </Form.Item>
                                                        <Form.Item name={[field.name, 'code']} initialValue={code} hidden><Input /></Form.Item>
                                                    </Col>
                                                </Row>
                                            );
                                        })}
                                    </Radio.Group>
                                </Form.Item>
                            )}
                        </Form.List>
                    </Form.Item>
                    <Row justify="end" gutter={16} style={{ marginTop: 24 }}>
                        <Col><Button onClick={() => setIsModalVisible(false)}>Hủy</Button></Col>
                        <Col><Button type="primary" htmlType="submit" icon={<PlusOutlined />}>Lưu</Button></Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default QuestionBank;