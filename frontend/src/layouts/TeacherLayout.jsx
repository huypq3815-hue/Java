import React, { useState } from 'react';
import { Layout, Menu, Avatar, Typography, Space, Breadcrumb, theme } from 'antd';
import { FormOutlined, CheckSquareOutlined, BarChartOutlined, UserOutlined, HomeOutlined }
from '@ant-design/icons';


const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

const TeacherLayout = ({ currentKey, onNavigate, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();

  const items = [
    { key: 'home', icon: <HomeOutlined />, label: 'Tổng quan' },
    { key: 'exam-create', icon: <FormOutlined />, label: 'Tạo đề thi' },
    { key: 'exam-grading', icon: <CheckSquareOutlined />, label: 'Chấm thi (OCR)' },
    { key: 'exam-report', icon: <BarChartOutlined />, label: 'Báo cáo & Phân tích' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark">
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <h1 style={{ color: '#fff', fontSize: collapsed ? '14px' : '18px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden' }}>
            {collapsed ? 'PBA' : 'PlanbookAI'}
          </h1>
        </div>
        <Menu 
          theme="dark" 
          selectedKeys={[currentKey]} 
          mode="inline" 
          items={items} 
          onClick={(e) => onNavigate(e.key)}
        />
      </Sider>
      
      <Layout>
        <Header style={{ padding: '0 24px', background: token.colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,21,41,0.08)' }}>
          <Text strong style={{ fontSize: 16 }}>Cổng giáo viên</Text>
          <Space>
            <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
            <Text>Giáo viên</Text>
          </Space>
        </Header>
        
        <Content style={{ margin: '16px 16px', padding: 24, background: token.colorBgContainer, borderRadius: token.borderRadiusLG, overflow: 'initial' }}>
          {children}
        </Content>
        
        <Footer style={{ textAlign: 'center', padding: '12px' }}>
          PlanbookAI ©2026 • Teacher Portal
        </Footer>
      </Layout>
    </Layout>
  );
};

export default TeacherLayout;