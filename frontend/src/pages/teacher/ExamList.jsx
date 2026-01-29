import { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Card, message, Popconfirm, Input } from 'antd';
import { PlusOutlined, EyeOutlined, DeleteOutlined, BarChartOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';

const { Search } = Input;

const ExamList = () => {
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        setLoading(true);
        try {
            const response = await api.get('/exams');
            setExams(response || []);
        } catch (error) {
            console.error('Error fetching exams: - ExamList.jsx:25', error);
            message.error('Không thể tải danh sách đề thi!');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/exams/${id}`);
            message.success('Xóa đề thi thành công!');
            fetchExams();
        } catch (error) {
            console.error('Error deleting exam: - ExamList.jsx:38', error);
            message.error('Xóa thất bại!');
        }
    };

    const columns = [
        {
            title: 'Mã đề',
            dataIndex: 'examCode',
            key: 'examCode',
            width: 120,
            render: (code) => <Tag color="blue">{code}</Tag>,
        },
        {
            title: 'Chủ đề',
            dataIndex: 'topicId',
            key: 'topicId',
            width: 150,
            render: (topicId) => `Topic ${topicId}`,
        },
        {
            title: 'Số câu hỏi',
            dataIndex: 'totalQuestions',
            key: 'totalQuestions',
            width: 120,
            render: () => <Tag color="green">10 câu</Tag>, // TODO: Get from API
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 300,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => navigate(`/teacher/exams/${record.id}`)}
                    >
                        Chi tiết
                    </Button>
                    <Button
                        icon={<BarChartOutlined />}
                        size="small"
                        onClick={() => navigate(`/teacher/exams/${record.id}/results`)}
                    >
                        Kết quả
                    </Button>
                    <Popconfirm
                        title="Xác nhận xóa?"
                        description="Bạn có chắc muốn xóa đề thi này?"
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

    const filteredExams = exams.filter(exam => 
        exam.examCode?.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Quản lý đề thi</h2>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={() => navigate('/teacher/exams/create')}
                    >
                        Tạo đề thi mới
                    </Button>
                </div>

                <Search
                    placeholder="Tìm kiếm theo mã đề..."
                    allowClear
                    size="large"
                    style={{ width: 300 }}
                    onSearch={(value) => setSearchText(value)}
                    onChange={(e) => setSearchText(e.target.value)}
                />

                <Table
                    columns={columns}
                    dataSource={filteredExams}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} đề thi`,
                    }}
                />
            </Space>
        </Card>
    );
};

export default ExamList;