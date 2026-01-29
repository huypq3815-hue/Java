import { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography, Badge, Popover, List, theme } from 'antd';
import {
    DashboardOutlined, QuestionCircleOutlined, FileTextOutlined, UserOutlined, LogoutOutlined,
    MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined, BookOutlined, BulbOutlined, BellOutlined, ScanOutlined, RobotOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';


const { Header, Sider, Content } = Layout;
const { Text } = Typography;


const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = theme.useToken();


    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const roleDisplay = user.role ? user.role.replace('ROLE_', '') : 'TEACHER';




    const getMenuItems = () => {
        const baseItems = [{ key: '/dashboard', icon: <DashboardOutlined />, label: 'Tổng quan' }];

        if (roleDisplay === 'ADMIN') {
            return [
                ...baseItems,
                { type: 'divider' },
                { key: '/admin/users', icon: <UserOutlined />, label: 'Quản lý người dùng' },
                { key: '/admin/questions', icon: <QuestionCircleOutlined />, label: 'Ngân hàng câu hỏi' },
                { key: '/admin/prompts', icon: <RobotOutlined />, label: 'Cấu hình Prompt AI' },
            ];
        }


        return [
            ...baseItems,
            { type: 'divider' },
            { key: '/teacher/lesson-plans', icon: <BulbOutlined />, label: 'Soạn giáo án AI' },
            { key: '/teacher/questions', icon: <QuestionCircleOutlined />, label: 'Ngân hàng câu hỏi' },
            { key: '/teacher/exams', icon: <FileTextOutlined />, label: 'Quản lý đề thi' },
            { key: '/teacher/ocr', icon: <ScanOutlined />, label: 'Chấm bài (OCG)' },
        ];
    };




    const notificationContent = (
        <List
            size="small"
            dataSource={[
                { title: 'Hệ thống', desc: 'Chào mừng bạn đến với PlanbookAI v1.0' },
                { title: 'Nhắc nhở', desc: 'Bạn có 5 bài tập chưa chấm.' },
                { title: 'Cập nhật', desc: 'Ngân hàng câu hỏi Hóa học đã được cập nhật.' }
            ]}
            renderItem={item => (
                <List.Item>
                    <List.Item.Meta title={item.title} description={item.desc} />
                </List.Item>
            )}
            style={{ width: 300 }}
        />
    );


    const userMenuItems = [
        { key: 'profile', icon: <UserOutlined />, label: 'Hồ sơ cá nhân', onClick: () => navigate('/profile') },
        { key: 'settings', icon: <SettingOutlined />, label: 'Cài đặt hệ thống', onClick: () => navigate('/settings') },
        { type: 'divider' },
        { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true, onClick: () => { localStorage.clear(); navigate('/login'); } },
    ];


    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
                <div
                    style={{
                        height: 64,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
                        color: 'white', fontSize: collapsed ? 20 : 18, fontWeight: 'bold'
                    }}>
                    <BookOutlined style={{ fontSize: 24, marginRight: collapsed ? 0 : 8 }} /> {!collapsed && 'Planbook AI'}
                </div>
                <Menu theme="light" mode="inline" selectedKeys={[location.pathname]} items={getMenuItems()} onClick={({ key }) => navigate(key)} style={{ marginTop: 10 }} />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: '0 24px',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #f9f9f9',
                        position: 'sticky',
                        top: 0,
                        zIndex: 100
                    }}>
                    {collapsed ? <MenuUnfoldOutlined onClick={() => setCollapsed(false)} style={{ fontSize: 18 }} /> : <MenuFoldOutlined onClick={() => setCollapsed(true)} style={{ fontSize: 18 }} />}
                    <Space size={24}>
                        <Popover content={notificationContent} title="Thông báo mới" trigger="click" placement="bottomRight">
                            <Badge count={3} dot>
                                <BellOutlined style={{ fontSize: 20, cursor: 'pointer', color: '#64748b' }} />
                            </Badge>
                        </Popover>
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow trigger={['click']}>
                            <Space
                                style={{
                                    cursor: 'pointer',
                                    padding: '4px 8px',
                                    background: '#f3f4f6',
                                    borderRadius: 20
                                }}>
                                <Avatar style={{ backgroundColor: token.colorPrimary }} icon={<UserOutlined />} />
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        lineHeight: '1.2'
                                    }}>
                                    <Text strong style={{ fontSize: 14 }}>{user.fullName || user.username}</Text>
                                    <Text type="secondary" style={{ fontSize: 11 }}>{roleDisplay}</Text>
                                </div>
                            </Space>
                        </Dropdown>
                    </Space>
                </Header>
                <Content style={{ margin: '24px' }}><Outlet /></Content>
            </Layout>
        </Layout>
    );
};
export default MainLayout;

