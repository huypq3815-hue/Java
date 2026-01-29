import { useState, useEffect } from 'react';
import { Table, Button, Space, Card, message, Popconfirm, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, RobotOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';

const PromptList = () => {
    const navigate = useNavigate();
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch Prompts
    const fetchPrompts = async () => {
        setLoading(true);
        try {
            const response = await api.get('/prompts');
            setPrompts(response);
        } catch (error) {
            console.error('Fetch prompts error:', error);
            message.error('Không thể tải danh sách prompt!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrompts();
    }, []);

    // Delete Prompt
    const handleDelete = async (id) => {
        try {
            await api.delete(`/prompts/${id}`);
            message.success('Xóa prompt thành công!');
            fetchPrompts();
        } catch (error) {
            console.error('Delete error:', error);
            message.error('Xóa thất bại!');
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Tên Prompt',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: 250,
        },
        {
            title: 'Nội dung (Preview)',
            dataIndex: 'content',
            key: 'content',
            render: (text) => (
                <div style={{
                    maxWidth: 400,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontFamily: 'monospace',
                    background: '#f5f5f5',
                    padding: '4px 8px',
                    borderRadius: 4
                }}>
                    <Tooltip title={text}>
                        {text}
                    </Tooltip>
                </div>
            ),
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
                        onClick={() => navigate(`/admin/prompts/edit/${record.id}`)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xác nhận xóa?"
                        description="Hành động này không thể hoàn tác!"
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

    return (
        <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2><RobotOutlined /> Quản lý Prompt AI</h2>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/admin/prompts/new')}
                    >
                        Thêm Prompt mới
                    </Button>
                </div>

                {/* TABLE */}
                <Table
                    columns={columns}
                    dataSource={prompts}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Space>
        </Card>
    );
};

export default PromptList;
