import { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Input, Select, message, Popconfirm, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';

const { Search } = Input;
const { Option } = Select;

const QuestionList = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

    // Filter states
    const [filters, setFilters] = useState({
        topicId: null,
        level: null,
        search: '',
    });

    // ✅ GỌI API LẤY DANH SÁCH CÂU HỎI (API CỦA MINH)
    const fetchQuestions = async () => {
        setLoading(true);
        try {
            // API endpoint: GET /api/questions
            const response = await api.get('/questions');

            // Backend trả về mảng trực tiếp [ { id: 1, ... }, ... ]
            // Hoặc nếu sau này backend hỗ trợ pagination thì xử lý sau.
            // Hiện tại fallback về mảng rỗng nếu lỗi.
            const data = Array.isArray(response) ? response : (response.content || []);

            setQuestions(data);
            setPagination({
                ...pagination,
                total: data.length,
            });
        } catch (error) {
            console.error('❌ Fetch questions error:', error);
            message.error('Không thể tải danh sách câu hỏi!');
        } finally {
            setLoading(false);
        }
    };

    // ✅ XÓA CÂU HỎI
    const handleDelete = async (id) => {
        console.log('--- Deleting Question ID:', id); // [DEBUG]
        try {
            await api.delete(`/questions/${id}`);
            message.success('Xóa câu hỏi thành công!');
            // Reload list
            fetchQuestions();
        } catch (error) {
            console.error('❌ Delete error:', error);
            message.error('Xóa thất bại!');
        }
    };

    // Fetch Topics for Filter
    const [topics, setTopics] = useState([]);
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const res = await api.get('/topics');
                setTopics(res);
            } catch (e) {
                // Ignore silent error
            }
        };
        fetchTopics();
    }, []);

    useEffect(() => {
        // Client-side filtering (tạm thời) vì API trả về full list
        // fetchQuestions() gọi 1 lần, sau đó filter ở render hoặc fetch lại nếu thích
        // Ở đây để đơn giản, cứ gọi lại API (dù API chưa support filter querystring)
        fetchQuestions();
    }, []);

    // ✅ TABLE COLUMNS
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Nội dung câu hỏi',
            dataIndex: 'content',
            key: 'content',
            render: (text) => (
                <div
                    dangerouslySetInnerHTML={{ __html: text }}
                    style={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                />
            ),
        },
        {
            title: 'Chủ đề',
            dataIndex: 'topic', // Map vào object topic
            key: 'topic',
            width: 200,
            render: (topic) => <Tag color="blue">{topic?.title || 'Unknown'}</Tag>,
        },
        {
            title: 'Độ khó',
            dataIndex: 'level',
            key: 'level',
            width: 100,
            render: (level) => {
                const color = level === 'EASY' ? 'green' : level === 'MEDIUM' ? 'orange' : 'red';
                return <Tag color={color}>{level}</Tag>;
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => navigate(`/admin/questions/edit/${record.id}`)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xác nhận xóa?"
                        description="Bạn có chắc muốn xóa câu hỏi này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />} size="small">
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // ... (Phần UI giữ nguyên, chỉ update phần Select Topic)

    return (
        <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Quản lý câu hỏi</h2>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/admin/questions/new')}
                    >
                        Thêm câu hỏi
                    </Button>
                </div>

                {/* FILTERS */}
                <Space size="middle">
                    <Search
                        placeholder="Tìm kiếm câu hỏi..."
                        allowClear
                        style={{ width: 300 }}
                        onSearch={(value) => setFilters({ ...filters, search: value })}
                    />

                    <Select
                        placeholder="Chọn độ khó"
                        style={{ width: 150 }}
                        allowClear
                        onChange={(value) => setFilters({ ...filters, level: value })}
                    >
                        <Option value="EASY">Dễ</Option>
                        <Option value="MEDIUM">Trung bình</Option>
                        <Option value="HARD">Khó</Option>
                    </Select>

                    <Select
                        placeholder="Chọn chủ đề"
                        style={{ width: 200 }}
                        allowClear
                        onChange={(value) => setFilters({ ...filters, topicId: value })}
                    >
                        {topics.map(t => (
                            <Option key={t.id} value={t.id}>{t.title}</Option>
                        ))}
                    </Select>
                </Space>

                {/* TABLE */}
                <Table
                    columns={columns}
                    dataSource={questions}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} câu hỏi`,
                    }}
                    onChange={(paginationConfig) => {
                        fetchQuestions();
                    }}
                />
            </Space>
        </Card>
    );
};

export default QuestionList;