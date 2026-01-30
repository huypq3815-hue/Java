import { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Card, message, Popconfirm, Input } from 'antd';
import { PlusOutlined, EyeOutlined, DeleteOutlined, BarChartOutlined } from '@ant-design/icons';
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
            setExams(prev => prev.filter(e => e.id !== id)); // Xóa trên UI luôn
        } catch (error) {
            message.error('Xóa thất bại!');
        }
    };

    const columns = [
        {
            title: 'Tên đề thi', // CỘT MỚI
            dataIndex: 'examName',
            key: 'examName',
            render: (text) => <strong>{text || 'Không tên'}</strong>,
        },
        {
            title: 'Mã đề',
            dataIndex: 'examCode',
            key: 'examCode',
            width: 120,
            render: (code) => <Tag color="blue">{code}</Tag>,
        },
        {
            title: 'Thời gian', // CỘT MỚI
            dataIndex: 'duration',
            key: 'duration',
            width: 100,
            render: (text) => <Tag color="orange">{text} phút</Tag>,
        },
        {
            title: 'Chủ đề',
            dataIndex: 'topicId', // Nếu API trả về topicName thì sửa thành topicName
            key: 'topicId',
            width: 120,
            render: (id) => {
                const map = {1: 'Toán', 2: 'Vật lí', 3: 'Hóa học', 4: 'Tiếng Anh'};
                return map[id] || `Topic ${id}`;
            },
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
                        title="Xóa đề thi?"
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
        (exam.examCode?.toLowerCase().includes(searchText.toLowerCase())) ||
        (exam.examName?.toLowerCase().includes(searchText.toLowerCase()))
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
                    placeholder="Tìm kiếm theo tên hoặc mã đề..."
                    allowClear
                    size="large"
                    style={{ width: 350 }}
                    onChange={(e) => setSearchText(e.target.value)}
                />

                <Table
                    columns={columns}
                    dataSource={filteredExams}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Space>
        </Card>
    );
};

export default ExamList;