import { useState, useEffect } from 'react';
import {
    Table, Button, Space, Tag, Input, Select, message, Popconfirm, Card, Row, Col, Badge,
    Modal, Empty, Tooltip
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined,
    EyeOutlined, ExportOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import MathRenderer from '../../components/MathRenderer';
import LoadingSpinner from '../../components/LoadingSpinner';
import { showErrorMessage, showSuccessMessage } from '../../utils/errorHandler';

const { Search } = Input;
const { Option } = Select;

const QuestionList = () => {
    const navigate = useNavigate();

    // State management
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // Filters
    const [filters, setFilters] = useState({
        topicId: null,
        level: null
    });

    // Related data
    const [topics, setTopics] = useState([]);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    // Fetch topics on mount
    useEffect(() => {
        fetchTopics();
    }, []);

    // Fetch questions when filters/search/pagination changes
    useEffect(() => {
        fetchQuestions();
    }, [filters, searchText, pagination.current, pagination.pageSize]);

    const fetchTopics = async () => {
        try {
            const res = await api.get('/topics');
            setTopics(Array.isArray(res) ? res : []);
        } catch (error) {
            console.error('Error fetching topics:', error);
        }
    };

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            // Build query params
            const params = {
                page: pagination.current - 1,
                size: pagination.pageSize,
                ...(filters.topicId && { topicId: filters.topicId }),
                ...(filters.level && { level: filters.level }),
                ...(searchText && { search: searchText })
            };

            const response = await api.get('/questions', { params });

            // Handle different response formats
            let data = [];
            let total = 0;

            if (Array.isArray(response)) {
                data = response;
                total = response.length;
            } else if (response.content) {
                data = response.content;
                total = response.totalElements || response.content.length;
            }

            setQuestions(data);
            setPagination({
                ...pagination,
                total
            });
        } catch (error) {
            showErrorMessage(error, 'Không thể tải danh sách câu hỏi!');
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/questions/${id}`);
            showSuccessMessage('Xóa câu hỏi thành công!');
            fetchQuestions();
        } catch (error) {
            showErrorMessage(error, 'Xóa thất bại!');
        }
    };

    const handlePreview = (record) => {
        setSelectedQuestion(record);
        setPreviewModalOpen(true);
    };

    const handleFilterChange = (key, value) => {
        setFilters({
            ...filters,
            [key]: value
        });
        setPagination({ ...pagination, current: 1 }); // Reset to first page
    };

    const handleSearch = (value) => {
        setSearchText(value);
        setPagination({ ...pagination, current: 1 }); // Reset to first page
    };

    const handleReset = () => {
        setFilters({ topicId: null, level: null });
        setSearchText('');
        setPagination({ current: 1, pageSize: 10, total: 0 });
    };

    // Calculate statistics
    const stats = {
        total: questions.length,
        easy: questions.filter(q => q.level === 'EASY').length,
        medium: questions.filter(q => q.level === 'MEDIUM').length,
        hard: questions.filter(q => q.level === 'HARD').length
    };

    // Table columns
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 60,
            sorter: (a, b) => a.id - b.id,
            defaultSortOrder: 'descend'
        },
        {
            title: 'Nội dung câu hỏi',
            dataIndex: 'content',
            key: 'content',
            width: 300,
            render: (text) => (
                <div
                    style={{
                        maxWidth: '300px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                    title={text?.replace(/<[^>]*>/g, '')}
                >
                    <MathRenderer content={text} inline={true} />
                </div>
            )
        },
        {
            title: 'Chủ đề',
            dataIndex: ['topic', 'title'],
            key: 'topic',
            width: 150,
            render: (text) => text || '-'
        },
        {
            title: 'Độ khó',
            dataIndex: 'level',
            key: 'level',
            width: 100,
            render: (level) => {
                const colors = { EASY: 'green', MEDIUM: 'orange', HARD: 'red' };
                const labels = { EASY: 'Dễ', MEDIUM: 'Trung bình', HARD: 'Khó' };
                return <Tag color={colors[level]}>{labels[level]}</Tag>;
            },
            filters: [
                { text: 'Dễ', value: 'EASY' },
                { text: 'Trung bình', value: 'MEDIUM' },
                { text: 'Khó', value: 'HARD' }
            ],
            onFilter: (value, record) => record.level === value
        },
        {
            title: 'Số đáp án',
            dataIndex: 'answers',
            key: 'answers',
            width: 80,
            render: (answers) => <Badge count={Array.isArray(answers) ? answers.length : 0} />
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Xem trước">
                        <Button
                            type="text"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => handlePreview(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Sửa">
                        <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/admin/questions/edit/${record.id}`)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa câu hỏi"
                        description="Bạn có chắc muốn xóa câu hỏi này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button type="text" danger size="small" icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    if (loading && questions.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <div style={{ padding: '24px' }}>
            {/* Header */}
            <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
                <Col>
                    <h1>Quản lý câu hỏi</h1>
                </Col>
                <Space>
                    <Button icon={<ReloadOutlined />} onClick={fetchQuestions} loading={loading}>
                        Làm mới
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/admin/questions/new')}
                    >
                        Thêm câu hỏi
                    </Button>
                </Space>
            </Row>

            {/* Statistics */}
            <Card style={{ marginBottom: '24px' }}>
                <Row gutter={16}>
                    <Col xs={6}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0891b2' }}>
                                {stats.total}
                            </div>
                            <div style={{ color: '#666' }}>Tổng cộng</div>
                        </div>
                    </Col>
                    <Col xs={6}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                                {stats.easy}
                            </div>
                            <div style={{ color: '#666' }}>Dễ</div>
                        </div>
                    </Col>
                    <Col xs={6}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                                {stats.medium}
                            </div>
                            <div style={{ color: '#666' }}>Trung bình</div>
                        </div>
                    </Col>
                    <Col xs={6}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
                                {stats.hard}
                            </div>
                            <div style={{ color: '#666' }}>Khó</div>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Filters */}
            <Card style={{ marginBottom: '24px' }}>
                <Row gutter={16} align="middle">
                    <Col xs={24} sm={12} md={6}>
                        <Search
                            placeholder="Tìm kiếm câu hỏi..."
                            onSearch={handleSearch}
                            onChange={(e) => handleSearch(e.target.value)}
                            enterButton={<SearchOutlined />}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Chọn chủ đề"
                            allowClear
                            value={filters.topicId}
                            onChange={(value) => handleFilterChange('topicId', value)}
                            style={{ width: '100%' }}
                        >
                            {topics.map(topic => (
                                <Option key={topic.id} value={topic.id}>
                                    {topic.title}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Chọn độ khó"
                            allowClear
                            value={filters.level}
                            onChange={(value) => handleFilterChange('level', value)}
                            style={{ width: '100%' }}
                        >
                            <Option value="EASY">Dễ</Option>
                            <Option value="MEDIUM">Trung bình</Option>
                            <Option value="HARD">Khó</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Button block onClick={handleReset}>
                            Đặt lại bộ lọc
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Table */}
            <Card>
                {questions.length === 0 ? (
                    <Empty
                        description={searchText || Object.values(filters).some(v => v) ? 'Không tìm thấy câu hỏi' : 'Chưa có câu hỏi nào'}
                        style={{ padding: '40px' }}
                    />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={questions}
                        loading={loading}
                        rowKey="id"
                        pagination={{
                            ...pagination,
                            onChange: (page, pageSize) => {
                                setPagination({ ...pagination, current: page, pageSize });
                            }
                        }}
                        scroll={{ x: 1200 }}
                    />
                )}
            </Card>

            {/* Preview Modal */}
            <Modal
                title="Xem trước câu hỏi"
                open={previewModalOpen}
                onCancel={() => setPreviewModalOpen(false)}
                footer={null}
                width={700}
            >
                {selectedQuestion && (
                    <div>
                        <div style={{ marginBottom: '16px' }}>
                            <strong>Nội dung:</strong>
                            <MathRenderer content={selectedQuestion.content} />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <strong>Chủ đề:</strong> {selectedQuestion.topic?.title || '-'}
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <strong>Độ khó:</strong>
                            <Tag color={selectedQuestion.level === 'EASY' ? 'green' : selectedQuestion.level === 'MEDIUM' ? 'orange' : 'red'}>
                                {selectedQuestion.level === 'EASY' ? 'Dễ' : selectedQuestion.level === 'MEDIUM' ? 'Trung bình' : 'Khó'}
                            </Tag>
                        </div>

                        <div>
                            <strong>Đáp án:</strong>
                            {Array.isArray(selectedQuestion.answers) && selectedQuestion.answers.map(ans => (
                                <div key={ans.id} style={{ marginTop: '8px', padding: '8px', backgroundColor: ans.isCorrect ? '#e6f7ff' : '#f5f5f5', borderRadius: '4px' }}>
                                    <strong>{ans.code}.</strong> {ans.content}
                                    {ans.isCorrect && <Tag color="green" style={{ marginLeft: '8px' }}>Đúng</Tag>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default QuestionList;
