// src/pages/teacher/ExamResults.jsx
import { useState, useEffect } from 'react';
import { Card, Table, Tag, Space, Row, Col, Statistic, Divider } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrophyOutlined, UserOutlined, LineChartOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import api from '../../config/api';

const COLORS = ['#ff4d4f', '#ff7a45', '#ffa940', '#52c41a', '#1890ff'];

const ExamResults = () => {
    const { examId } = useParams();
    const [results, setResults] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchResults();
        fetchStatistics();
    }, [examId]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/exams/${examId}/results`);
            setResults(response || []);
        } catch (error) {
            console.error('Error fetching results: - ExamResults.jsx:28', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await api.get(`/exams/${examId}/statistics`);
            setStatistics(response);
        } catch (error) {
            console.error('Error fetching statistics: - ExamResults.jsx:39', error);
        }
    };

    const columns = [
        {
            title: 'STT',
            key: 'index',
            width: 60,
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Mã HS',
            dataIndex: 'studentId',
            key: 'studentId',
            width: 100,
        },
        {
            title: 'Điểm',
            dataIndex: 'score',
            key: 'score',
            width: 100,
            sorter: (a, b) => a.score - b.score,
            render: (score) => {
                let color = 'red';
                if (score >= 8) color = 'green';
                else if (score >= 5) color = 'orange';
                
                return <Tag color={color} style={{ fontSize: 14, fontWeight: 'bold' }}>
                    {score.toFixed(2)}
                </Tag>;
            },
        },
        {
            title: 'Xếp loại',
            dataIndex: 'score',
            key: 'rank',
            width: 120,
            render: (score) => {
                if (score >= 8) return <Tag color="success">Giỏi</Tag>;
                if (score >= 6.5) return <Tag color="processing">Khá</Tag>;
                if (score >= 5) return <Tag color="warning">Trung bình</Tag>;
                return <Tag color="error">Yếu</Tag>;
            },
        },
    ];

    // Prepare chart data
    const chartData = statistics?.scoreDistribution
        ? Object.entries(statistics.scoreDistribution).map(([range, count]) => ({
            range,
            count,
          }))
        : [];

    const pieData = [
        { name: 'Giỏi (8-10)', value: results.filter(r => r.score >= 8).length },
        { name: 'Khá (6.5-8)', value: results.filter(r => r.score >= 6.5 && r.score < 8).length },
        { name: 'TB (5-6.5)', value: results.filter(r => r.score >= 5 && r.score < 6.5).length },
        { name: 'Yếu (<5)', value: results.filter(r => r.score < 5).length },
    ].filter(item => item.value > 0);

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Statistics Cards */}
            {statistics && (
                <Row gutter={16}>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Tổng học sinh"
                                value={statistics.totalStudents}
                                prefix={<UserOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Điểm TB"
                                value={statistics.averageScore?.toFixed(2)}
                                prefix={<LineChartOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Điểm cao nhất"
                                value={statistics.maxScore?.toFixed(2)}
                                prefix={<TrophyOutlined />}
                                valueStyle={{ color: '#faad14' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Điểm thấp nhất"
                                value={statistics.minScore?.toFixed(2)}
                                valueStyle={{ color: '#ff4d4f' }}
                            />
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Charts */}
            <Row gutter={16}>
                <Col span={14}>
                    <Card title="Phân bố điểm số">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="range" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#1890ff" name="Số học sinh" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                <Col span={10}>
                    <Card title="Xếp loại">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Results Table */}
            <Card title="Danh sách kết quả">
                <Table
                    columns={columns}
                    dataSource={results}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        pageSize: 20,
                        showTotal: (total) => `Tổng ${total} học sinh`,
                    }}
                />
            </Card>
        </Space>
    );
};

export default ExamResults;