import { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography } from 'antd';
import {
    DashboardOutlined,
    QuestionCircleOutlined,
    FileTextOutlined,
    UserOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy thông tin user từ localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Menu items dựa theo role
    const getMenuItems = () => {
        const role = user.role || 'TEACHER';

        const baseItems = [
            {
                key: '/dashboard',
                icon: <DashboardOutlined />,
                label: 'Trang chủ',
            },
        ];

        if (role === 'ADMIN') {
            return [
                ...baseItems,
                {
                    key: '/admin/users',
                    icon: <UserOutlined />,
                    label: 'Quản lý người dùng',
                },
                {
                    key: '/admin/questions',
                    icon: <QuestionCircleOutlined />,
                    label: 'Ngân hàng câu hỏi',
                },
            ];
        }

        if (role === 'TEACHER') {
            return [
                ...baseItems,
                {
                    key: '/teacher/questions',
                    icon: <QuestionCircleOutlined />,
                    label: 'Câu hỏi của tôi',
                },
                {
                    key: '/teacher/exams',
                    icon: <FileTextOutlined />,
                    label: 'Đề thi',
                },
            ];
        }

        return baseItems;
    };

    // Dropdown menu cho avatar
    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Thông tin cá nhân',
            onClick: () => navigate('/profile'),
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Cài đặt',
            onClick: () => navigate('/settings'),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            danger: true,
            onClick: () => {
                localStorage.clear();
                navigate('/login');
            },
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* SIDEBAR */}
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                }}
            >
                <div style={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: collapsed ? 16 : 20,
                    fontWeight: 'bold',
                }}>
                    {collapsed ? 'PBA' : 'PlanbookAI'}
                </div>

                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={getMenuItems()}
                    onClick={({ key }) => navigate(key)}
                />
            </Sider>

            {/* MAIN CONTENT AREA */}
            <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
                {/* HEADER */}
                <Header
                    style={{
                        padding: '0 24px',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                >
                    {/* Toggle button */}
                    {collapsed ? (
                        <MenuUnfoldOutlined
                            style={{ fontSize: 18, cursor: 'pointer' }}
                            onClick={() => setCollapsed(false)}
                        />
                    ) : (
                        <MenuFoldOutlined
                            style={{ fontSize: 18, cursor: 'pointer' }}
                            onClick={() => setCollapsed(true)}
                        />
                    )}

                    {/* User dropdown */}
                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                        <Space style={{ cursor: 'pointer' }}>
                            <Avatar icon={<UserOutlined />} />
                            <Text strong>{user.fullName || 'User'}</Text>
                        </Space>
                    </Dropdown>
                </Header>

                {/* CONTENT */}
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: '#fff',
                        borderRadius: 8,
                    }}
                >
                    <Outlet /> {/* Render child routes here */}
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
