import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Badge, Tag, Empty, Spin } from 'antd';
import {
    UserOutlined, FileTextOutlined, TeamOutlined, ThunderboltOutlined,
    ArrowUpOutlined, ArrowDownOutlined
} from '@ant-design/icons';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../config/api';
import { showErrorMessage } from '../../utils/errorHandler';

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalQuestions: 0,
        totalExams: 0,
        recentActivities: [],
        questionsByLevel: [],
        usersByRole: [],
        activityTrend: []
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [usersRes, questionsRes, examsRes, activitiesRes] = await Promise.all([
                api.get('/users').catch(() => []),
                api.get('/questions').catch(() => []),
                api.get('/exams').catch(() => []),
                api.get('/activities?limit=10').catch(() => [])
            ]);

            const users = Array.isArray(usersRes) ? usersRes : (usersRes.content || []);
            const questions = Array.isArray(questionsRes) ? questionsRes : (questionsRes.content || []);
            const exams = Array.isArray(examsRes) ? examsRes : (examsRes.content || []);
            const activities = Array.isArray(activitiesRes) ? activitiesRes : [];

            // Calculate statistics
            const questionsByLevel = [
                { name: 'Dễ', value: questions.filter(q => q.level === 'EASY').length },
                { name: 'Trung bình', value: questions.filter(q => q.level === 'MEDIUM').length },
                { name: 'Khó', value: questions.filter(q => q.level === 'HARD').length }
            ];

            const usersByRole = [
                { name: 'Admin', value: users.filter(u => u.role === 'ROLE_ADMIN').length },
                { name: 'Teacher', value: users.filter(u => u.role === 'ROLE_TEACHER').length },
                { name: 'Manager', value: users.filter(u => u.role === 'ROLE_MANAGER').length },
                { name: 'Staff', value: users.filter(u => u.role === 'ROLE_STAFF').length }
            ];

            // Mock activity trend (7 days)
            const activityTrend = [
                { name: 'T2', questions: 5, exams: 2 },
                { name: 'T3', questions: 8, exams: 3 },
                { name: 'T4', questions: 6, exams: 4 },
                { name: 'T5', questions: 9, exams: 2 },
                { name: 'T6', questions: 7, exams: 5 },
                { name: 'T7', questions: 10, exams: 3 },
                { name: 'CN', questions: 4, exams: 1 }
            ];

            setStats({
                totalUsers: users.length,
                totalQuestions: questions.length,
                totalExams: exams.length,
                recentActivities: activities,
                questionsByLevel,
                usersByRole,
                activityTrend
            });
        } catch (error) {
            showErrorMessage(error, 'Không thể tải dữ liệu dashboard!');
        } finally {
            setLoading(false);
        }
    };

    const colors = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];
    const roleColors = ['#ef4444', '#3b82f6', '#f59e0b', '#10b981'];

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            <h1 style={{ marginBottom: '24px' }}>Dashboard Admin</h1>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Tổng người dùng"
                            value={stats.totalUsers}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#0891b2' }}
                            suffix={<ArrowUpOutlined style={{ color: '#10b981' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Tổng câu hỏi"
                            value={stats.totalQuestions}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#3b82f6' }}
                            suffix={<ArrowUpOutlined style={{ color: '#10b981' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Tổng đề thi"
                            value={stats.totalExams}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#10b981' }}
                            suffix={<ArrowUpOutlined style={{ color: '#10b981' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Hệ thống hoạt động"
                            value="100%"
                            prefix={<ThunderboltOutlined />}
                            valueStyle={{ color: '#f59e0b' }}
                            suffix={<ArrowUpOutlined style={{ color: '#10b981' }} />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Charts */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                {/* Activity Trend */}
                <Col xs={24} lg={12}>
                    <Card title="Xu hướng hoạt động (7 ngày)" style={{ height: '100%' }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={stats.activityTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="questions" stroke="#3b82f6" strokeWidth={2} name="Câu hỏi tạo" />
                                <Line type="monotone" dataKey="exams" stroke="#10b981" strokeWidth={2} name="Đề thi tạo" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                {/* Questions by Level */}
                <Col xs={24} lg={12}>
                    <Card title="Phân bố câu hỏi theo độ khó">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={stats.questionsByLevel}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry) => `${entry.name}: ${entry.value}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {colors.map((color, index) => (
                                        <Cell key={`cell-${index}`} fill={color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Second Row of Charts */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                {/* Users by Role */}
                <Col xs={24} lg={12}>
                    <Card title="Phân bố người dùng theo vai trò">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.usersByRole}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#0891b2" name="Số lượng" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                {/* Summary Table */}
                <Col xs={24} lg={12}>
                    <Card title="Tóm tắt thống kê">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span>👥 Người dùng hoạt động</span>
                                <strong>{stats.totalUsers}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span>📚 Câu hỏi trong kho</span>
                                <strong>{stats.totalQuestions}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span>📝 Đề thi đã tạo</span>
                                <strong>{stats.totalExams}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                                <span>💾 Tỉ lệ câu Dễ/Khó</span>
                                <strong>
                                    {stats.questionsByLevel.length > 0 && stats.questionsByLevel[0].value > 0
                                        ? `${((stats.questionsByLevel[0].value / stats.totalQuestions) * 100).toFixed(0)}%`
                                        : '0%'
                                    }
                                </strong>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Recent Activities */}
            <Card title="Hoạt động gần đây">
                {stats.recentActivities.length === 0 ? (
                    <Empty description="Chưa có hoạt động gần đây" />
                ) : (
                    <Table
                        dataSource={stats.recentActivities}
                        columns={[
                            { title: 'Hoạt động', dataIndex: 'action', key: 'action' },
                            { title: 'Người dùng', dataIndex: 'user', key: 'user' },
                            { title: 'Thời gian', dataIndex: 'timestamp', key: 'timestamp' },
                            {
                                title: 'Trạng thái',
                                dataIndex: 'status',
                                key: 'status',
                                render: (status) => <Tag color={status === 'success' ? 'green' : 'red'}>{status}</Tag>
                            }
                        ]}
                        rowKey="id"
                        pagination={{ pageSize: 5 }}
                    />
                )}
            </Card>
        </div>
    );
};

export default AdminDashboard;
