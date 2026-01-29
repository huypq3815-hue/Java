import { Card, List, Button, Switch, Tag } from 'antd';
import { GlobalOutlined, BgColorsOutlined, BellOutlined } from '@ant-design/icons';

const Settings = () => {
    const data = [
        {
            title: 'Ngôn ngữ hệ thống',
            desc: 'Ngôn ngữ hiển thị mặc định.',
            icon: <GlobalOutlined />,
            action: <Button disabled>Tiếng Việt (Mặc định)</Button>
        },
        {
            title: 'Giao diện',
            desc: 'Chủ đề màu sắc.',
            icon: <BgColorsOutlined />,
            action: <Tag color="blue">Light (Mặc định)</Tag>
        },
        {
            title: 'Thông báo Email',
            desc: 'Nhận email khi có kết quả chấm thi.',
            icon: <BellOutlined />,
            action: <Switch defaultChecked />
        }
    ];

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Card title="Cài đặt hệ thống" bordered={false}>
                <List itemLayout="horizontal" dataSource={data} renderItem={item => (
                    <List.Item actions={[item.action]}>
                        <List.Item.Meta avatar={item.icon} title={item.title} description={item.desc} />
                    </List.Item>
                )} />
            </Card>
        </div>
    );
};
export default Settings;