import { Card, Row, Col, Statistic, Typography } from 'antd';
import {
    QuestionCircleOutlined,
    FileTextOutlined,
    UserOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const Dashboard = () => {
    // Lấy thoogn tin user từ Local Storage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div>
            <Title level={2}>
                Chào mừng, {user.fullName || 'User'}! 👋

            </Title>

