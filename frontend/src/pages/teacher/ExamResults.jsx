import { useState, useEffect } from 'react';
import { Card, Table, Tag, Row, Col, Statistic, Breadcrumb } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrophyOutlined, TeamOutlined, RiseOutlined, FallOutlined, HomeOutlined } from '@ant-design/icons';

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981'];

const ExamResults = () => {
    const [results, setResults] = useState([]);

    useEffect(() => {
        // 🔄 LOAD DỮ LIỆU TỪ KẾT QUẢ CHẤM OCR (LocalStorage)
        const savedResults = JSON.parse(localStorage.getItem('exam_results') || '[]');
        if (savedResults.length > 0) {
            setResults(savedResults);
        } else {
            // Mock data nếu chưa chấm bài nào
            const mockData = Array.from({length: 5}, (_, i) => ({
                id: i, studentId: `HS00${i}`, fullName: `Học sinh mẫu ${i}`, score: Math.floor(Math.random() * 5) + 5
            }));
            setResults(mockData);
        }
    }, []);

    // Thống kê
    const stats = {
        total: results.length,
        avg: (results.reduce((a, b) => a + b.score, 0) / results.length) || 0,
        max: results.length ? Math.max(...results.map(r => r.score)) : 0,
        min: results.length ? Math.min(...results.map(r => r.score)) : 0,
    };

    // Phân bố điểm
    const distributionData = [
        { range: '< 5', count: results.filter(r => r.score < 5).length },
        { range: '5 - 6.5', count: results.filter(r => r.score >= 5 && r.score < 6.5).length },
        { range: '6.5 - 8', count: results.filter(r => r.score >= 6.5 && r.score < 8).length },
        { range: '8 - 9', count: results.filter(r => r.score >= 8 && r.score < 9).length },
        { range: '9 - 10', count: results.filter(r => r.score >= 9).length },
    ];

    const pieData = distributionData.map((d, i) => ({ name: d.range, value: d.count })).filter(i => i.value > 0);

    const columns = [
        { title: '#', render: (t,r,i) => i+1, width: 50 },
        { title: 'Mã HS', dataIndex: 'studentId', fontWeight: 'bold' },
        { title: 'Họ tên', dataIndex: 'fullName' },
        { 
            title: 'Điểm số', dataIndex: 'score', sorter: (a,b) => a.score - b.score,
            render: (s) => <Tag color={s >= 8 ? 'green' : s >= 5 ? 'blue' : 'red'}>{s}</Tag>
        }
    ];

    return (
        <div>
            <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item href="/teacher/dashboard"><HomeOutlined /></Breadcrumb.Item>
                <Breadcrumb.Item>Kết quả & Phân tích</Breadcrumb.Item>
            </Breadcrumb>

            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}><Card bordered={false} style={{background:'#f0f9ff'}}><Statistic title="Tổng số học sinh" value={stats.total} prefix={<TeamOutlined style={{color:'#0ea5e9'}}/>} /></Card></Col>
                <Col span={6}><Card bordered={false} style={{background:'#f0fdf4'}}><Statistic title="Điểm trung bình" value={stats.avg} precision={2} prefix={<RiseOutlined style={{color:'#22c55e'}}/>} /></Card></Col>
                <Col span={6}><Card bordered={false} style={{background:'#fffbeb'}}><Statistic title="Điểm cao nhất" value={stats.max} precision={2} prefix={<TrophyOutlined style={{color:'#f59e0b'}}/>} /></Card></Col>
                <Col span={6}><Card bordered={false} style={{background:'#fef2f2'}}><Statistic title="Điểm thấp nhất" value={stats.min} precision={2} prefix={<FallOutlined style={{color:'#ef4444'}}/>} /></Card></Col>
            </Row>

            <Row gutter={24} style={{ marginBottom: 24 }}>
                <Col span={14}>
                    <Card title="Phổ điểm" bordered={false}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={distributionData}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="range"/><YAxis/><Tooltip/><Bar dataKey="count" fill="#0891b2" radius={[4,4,0,0]}/></BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col span={10}>
                    <Card title="Tỷ lệ xếp loại" bordered={false}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value">{pieData.map((e,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip/><Legend/></PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            <Card title="Bảng điểm chi tiết" bordered={false}><Table columns={columns} dataSource={results} rowKey="id" /></Card>
        </div>
    );
};
export default ExamResults;