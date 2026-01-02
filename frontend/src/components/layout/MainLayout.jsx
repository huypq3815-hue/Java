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
