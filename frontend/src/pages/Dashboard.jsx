import { Card, Row, Col, Statistic, Typography, Button, List, Avatar, Space } from 'antd';
import { QuestionCircleOutlined, FileTextOutlined, ScanOutlined, PlusOutlined, ArrowRightOutlined, ThunderboltFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Dashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const activities = [
        { title: 'Đã thêm 5 câu hỏi Hóa hữu cơ', time: '10 phút trước', type: 'update' },
        { title: 'Hoàn thành chấm bài lớp 10A1', time: '1 giờ trước', type: 'grade' },
        { title: 'Tạo đề thi "Kiểm tra 15p"', time: '3 giờ trước', type: 'create' },
    ];

    return (
        <div style={{ paddingBottom: 20 }}>
            <div style={{ background: 'linear-gradient(135deg, #fff 0%, #f0fdfa 100%)', padding: '24px', borderRadius: '16px', marginBottom: '24px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={3} style={{ margin: 0 }}>Xin chào, {user.fullName || 'Giáo viên'} 👋</Title>
                    <Text type="secondary">Chào mừng trở lại với PlanbookAI.</Text>
                </div>
                <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => navigate('/teacher/exams/create')} style={{ boxShadow: '0 4px 14px rgba(8, 145, 178, 0.4)' }}>
                    Tạo đề thi mới
                </Button>
            </div>

            <Row gutter={[16, 16]}>

                <Col xs={24} sm={8}>
                    <Card hoverable bordered={false} style={{ borderTop: '4px solid #0891b2', cursor: 'pointer' }} onClick={() => navigate('/teacher/questions')}>
                        <Statistic title="Ngân hàng câu hỏi" value={0} prefix={<QuestionCircleOutlined style={{ color: '#0891b2' }} />} suffix="câu" />
                        <Text type="secondary">Truy cập kho dữ liệu</Text>
                    </Card>
                </Col>

                <Col xs={24} sm={8}>
                    <Card hoverable bordered={false} style={{ borderTop: '4px solid #10b981', cursor: 'pointer' }} onClick={() => navigate('/teacher/exams')}>
                        <Statistic title="Đề thi đã tạo" value={0} prefix={<FileTextOutlined style={{ color: '#10b981' }} />} suffix="đề" />
                        <Text type="secondary">Xem danh sách đề thi</Text>
                    </Card>
                </Col>

                <Col xs={24} sm={8}>
                    <Card hoverable bordered={false} style={{ borderTop: '4px solid #f59e0b', cursor: 'pointer' }} onClick={() => navigate('/teacher/ocr')}>
                        <Statistic title="Chấm bài (OCG)" value={"Mới"} valueStyle={{color: '#f59e0b'}} prefix={<ScanOutlined style={{ color: '#f59e0b' }} />} />
                        <Text type="secondary">Chấm thi tự động ngay</Text>
                    </Card>
                </Col>

            </Row>

            <Row gutter={24} style={{ marginTop: 24 }}>
                <Col xs={24} lg={16}>
                    <Card title={<Space><ThunderboltFilled style={{ color: '#f59e0b' }} /> Hoạt động gần đây</Space>} bordered={false}>
                        <List itemLayout="horizontal" dataSource={activities} renderItem={(item) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar style={{ backgroundColor: '#e6fffa', color: '#0891b2' }} icon={<FileTextOutlined />} />}
                                    title={<a>{item.title}</a>} description={item.time}
                                />
                                <Button type="text" icon={<ArrowRightOutlined />} />
                            </List.Item>
                        )} />
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