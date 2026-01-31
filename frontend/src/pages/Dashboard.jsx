import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Button, List, Avatar, Space } from 'antd';
import { 
    QuestionCircleOutlined, 
    FileTextOutlined, 
    ScanOutlined, 
    PlusOutlined, 
    ArrowRightOutlined, 
    ThunderboltFilled,
    CheckCircleOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';

const { Title, Text } = Typography;

const Dashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [stats, setStats] = useState({
        totalQuestions: 0,
        totalExams: 0,
        totalResults: 0,
        activities: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/dashboard/stats');
                setStats(response);
            } catch (error) {
                console.error("Lỗi tải dashboard: - Dashboard.jsx:35", error);
            }
        };
        fetchDashboardData();
    }, []);

    const getActivityConfig = (type) => {
        switch (type) {
            case 'QUESTION': 
                return { icon: <QuestionCircleOutlined />, color: '#0891b2', bg: '#e6fffa' };
            case 'EXAM': 
                return { icon: <FileTextOutlined />, color: '#10b981', bg: '#ecfdf5' };
            case 'RESULT': 
                return { icon: <CheckCircleOutlined />, color: '#f59e0b', bg: '#fffbeb' };
            default: 
                return { icon: <ClockCircleOutlined />, color: '#64748b', bg: '#f1f5f9' };
        }
    };

    return (
        <div style={{ paddingBottom: 20 }}>
            {/* WELCOME SECTION */}
            <div style={{ background: 'linear-gradient(135deg, #fff 0%, #f0fdfa 100%)', padding: '24px', borderRadius: '16px', marginBottom: '24px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                    <Title level={3} style={{ margin: 0 }}>Xin chào, {user.fullName || 'Giáo viên'} 👋</Title>
                    <Text type="secondary">Chào mừng trở lại với PlanbookAI.</Text>
                </div>
                <Button 
                    type="primary" 
                    size="large" 
                    icon={<PlusOutlined />} 
                    onClick={() => navigate('/teacher/exams/create')} 
                    style={{ boxShadow: '0 4px 14px rgba(8, 145, 178, 0.4)' }}
                >
                    Tạo đề thi mới
                </Button>
            </div>

            {/* STATISTICS CARDS */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                    <Card hoverable bordered={false} style={{ borderTop: '4px solid #0891b2', cursor: 'pointer' }} onClick={() => navigate('/teacher/questions')}>
                        <Statistic 
                            title="Ngân hàng câu hỏi" 
                            value={stats.totalQuestions} 
                            formatter={(val) => val.toLocaleString()}
                            prefix={<QuestionCircleOutlined style={{ color: '#0891b2' }} />} 
                            suffix="câu" 
                        />
                        <Text type="secondary">Truy cập kho dữ liệu</Text>
                    </Card>
                </Col>

                <Col xs={24} sm={8}>
                    <Card hoverable bordered={false} style={{ borderTop: '4px solid #10b981', cursor: 'pointer' }} onClick={() => navigate('/teacher/exams')}>
                        <Statistic 
                            title="Đề thi đã tạo" 
                            value={stats.totalExams} 
                            formatter={(val) => val.toLocaleString()}
                            prefix={<FileTextOutlined style={{ color: '#10b981' }} />} 
                            suffix="đề" 
                        />
                        <Text type="secondary">Xem danh sách đề thi</Text>
                    </Card>
                </Col>

                <Col xs={24} sm={8}>
                    <Card hoverable bordered={false} style={{ borderTop: '4px solid #f59e0b', cursor: 'pointer' }} onClick={() => navigate('/teacher/ocr')}>
                        <Statistic 
                            title="Bài đã chấm (OCR)" 
                            value={stats.totalResults} 
                            formatter={(val) => val.toLocaleString()}
                            valueStyle={{ color: '#f59e0b' }} 
                            prefix={<ScanOutlined style={{ color: '#f59e0b' }} />} 
                            suffix="lượt"
                        />
                        <Text type="secondary">Chấm thi tự động ngay</Text>
                    </Card>
                </Col>
            </Row>

            {/* RECENT ACTIVITY & PRO TIP */}
            <Row gutter={24} style={{ marginTop: 24 }}>
                <Col xs={24} lg={16}>
                    <Card title={<Space><ThunderboltFilled style={{ color: '#f59e0b' }} /> Hoạt động gần đây</Space>} bordered={false}>
                        <List 
                            itemLayout="horizontal" 
                            dataSource={stats.activities} 
                            locale={{ emptyText: 'Chưa có hoạt động nào gần đây' }}
                            renderItem={(item) => {
                                const config = getActivityConfig(item.type);
                                return (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar 
                                                    style={{ backgroundColor: config.bg, color: config.color }} 
                                                    icon={config.icon} 
                                                />
                                            }
                                            title={<a href="#">{item.title}</a>}
                                            description={
                                                <Space direction="vertical" size={0}>
                                                    <Text style={{ fontSize: 13 }}>{item.description}</Text>
                                                    <Text type="secondary" style={{ fontSize: 11 }}>{item.time}</Text>
                                                </Space>
                                            }
                                        />
                                        <Button type="text" icon={<ArrowRightOutlined />} />
                                    </List.Item>
                                );
                            }} 
                        />
                    </Card>
                </Col>
                
                <Col xs={24} lg={8}>
                    <Card style={{ background: 'linear-gradient(135deg, #0f766e 0%, #0e7490 100%)', color: 'white', border: 'none', borderRadius: 16 }}>
                        <Title level={4} style={{ color: 'white' }}>💡 Pro Tip: OCR Grading</Title>
                        <p style={{ fontSize: 15, opacity: 0.9 }}>Chấm bài trắc nghiệm siêu tốc với AI. Hỗ trợ cả bài viết tay và phiếu tô.</p>
                        <Button style={{ background: 'white', color: '#0e7490', border: 'none', fontWeight: 600 }} onClick={() => navigate('/teacher/ocr')}>
                            Thử tính năng này
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;