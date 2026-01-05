import React, { useState } from 'react';
import { Row, Col, Card, Typography, Space, Badge } from 'antd';
import { FormOutlined, CheckSquareOutlined, BarChartOutlined }
from '@ant-design/icons';

import TeacherLayout from './layouts/TeacherLayout';
import ExamCreate from './pages/teachers/ExamCreate';
import ExamGrading from './pages/teachers/ExamGrading';
import ExamReport from './pages/teachers/ExamReport';

const { Title } = Typography;

// Trang Dashboard (Tổng quan - Home)
const DashboardHome = ({ onNavigate }) => (
  <Space direction="vertical" size="large" style={{ width: '100%', padding: '24px' }}>
    <Title level={2}>Chào mừng đến PlanbookAI</Title>
    <Title level={4} type="secondary">Công cụ AI hỗ trợ giáo viên THPT</Title>

    <Row gutter={[24, 24]}>
      {/* CARD 1: TẠO ĐỀ THI */}
      <Col xs={24} sm={12} lg={8}>
        <Card 
          hoverable 
          onClick={() => onNavigate('exam-create')}
          style={{ height: '100%', cursor: 'pointer' }}
          bodyStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}
        >
          <FormOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
          <Title level={4}>Tạo đề thi</Title>
          <Typography.Text>Tạo đề trắc nghiệm tự động bằng AI</Typography.Text>

          <Badge count={0} style={{ marginTop: 8 }}>Đề mới</Badge>
        </Card>
      </Col>

      {/* CARD 2: CHẤM THI OCR */}
      <Col xs={24} sm={12} lg={8}>
        <Card 
          hoverable 
          onClick={() => onNavigate('exam-grading')}
          style={{ height: '100%', cursor: 'pointer' }}
          bodyStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}
        >
          <CheckSquareOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
          <Title level={4}>Chấm thi OCR</Title>
          <Typography.Text>Upload ảnh bài làm → chấm tự động</Typography.Text>

          <Badge count={0} status="default" style={{ marginTop: 8, color: '#999' }}>Sẵn sàng chấm</Badge>
        </Card>
      </Col>

      {/* CARD 3: BÁO CÁO */}
      <Col xs={24} sm={12} lg={8}>
        <Card 
          hoverable 
          onClick={() => onNavigate('exam-report')}
          style={{ height: '100%', cursor: 'pointer' }}
          bodyStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}
        >
          <BarChartOutlined style={{ fontSize: 48, color: '#faad14', marginBottom: 16 }} />
          <Title level={4}>Báo cáo & Phân tích</Title>
          <Typography.Text>Xem thống kê, phổ điểm học sinh</Typography.Text>

          <Badge count={0} style={{ marginTop: 8 }}>Tra cứu ngay</Badge>
        </Card>
      </Col>
    </Row>
  </Space>
);

function App() {
  const [currentKey, setCurrentKey] = useState('home');

  const handleNavigate = (key) => {
    setCurrentKey(key);
  };

  const renderContent = () => {
    switch (currentKey) {
      case 'home':
        return <DashboardHome onNavigate={handleNavigate} />;
      case 'exam-create':
        return <ExamCreate />;
      case 'exam-grading':
        return <ExamGrading />;
      case 'exam-report':
        return <ExamReport />;
      default:
        return <DashboardHome onNavigate={handleNavigate} />;
    }
  };

  return (
    <TeacherLayout currentKey={currentKey} onNavigate={handleNavigate}>
      {renderContent()}
    </TeacherLayout>
  );
}

export default App;