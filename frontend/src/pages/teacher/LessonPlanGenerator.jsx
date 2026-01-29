import { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Button, Row, Col, message, List, Typography, Popconfirm, Space } from 'antd';
import { RocketOutlined, FileWordOutlined, SaveOutlined, HistoryOutlined, DeleteOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { saveAs } from 'file-saver';

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const TEMPLATES = {
    'Hóa học': `<h2>Tên bài dạy: [TÊN BÀI]</h2><p><strong>Môn:</strong> Hóa học</p><h3>I. MỤC TIÊU</h3><ul><li>Nêu được khái niệm...</li></ul><h3>II. CHUẨN BỊ</h3><p>Máy chiếu, bảng...</p><h3>III. TIẾN TRÌNH</h3><p>...</p>`,
    'Vật lý': `<h2>Giáo án Vật Lý: [TÊN BÀI]</h2><p>Nội dung đang cập nhật...</p>`
};

const LessonPlanGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [history, setHistory] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        const savedPlans = JSON.parse(localStorage.getItem('lesson_plans') || '[]');
        setHistory(savedPlans);
    }, []);

    const handleGenerate = (values) => {
        setLoading(true);
        setTitle(values.topic);
        setTimeout(() => {
            const template = TEMPLATES[values.subject] || TEMPLATES['Hóa học'];
            const finalContent = template.replace('[TÊN BÀI]', values.topic);
            setContent(finalContent);
            setLoading(false);
            message.success('Đã tạo giáo án mẫu!');
        }, 1000);
    };

    const handleSave = () => {
        if (!content) return message.warning('Chưa có nội dung để lưu!');
        const newPlan = {
            id: Date.now(),
            title: title || 'Giáo án không tên',
            content: content,
            date: new Date().toLocaleDateString('vi-VN')
        };
        const newHistory = [newPlan, ...history];
        setHistory(newHistory);
        localStorage.setItem('lesson_plans', JSON.stringify(newHistory));
        message.success('Đã lưu giáo án vào lịch sử!');
    };

    // ✅ ĐÃ SỬA: Xuất file Word bằng Blob (Không dùng html-docx-js)
    const handleExportWord = () => {
        if (!content) return message.warning('Chưa có nội dung để xuất!');
        
        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
            "xmlns:w='urn:schemas-microsoft-com:office:word' " +
            "xmlns='http://www.w3.org/TR/REC-html40'>" +
            "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
        const footer = "</body></html>";
        const sourceHTML = header + content + footer;

        const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
        const fileDownload = document.createElement("a");
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = `${title || 'giao_an'}.doc`;
        fileDownload.click();
        document.body.removeChild(fileDownload);
        
        message.success('Đang tải xuống file Word (.doc)...');
    };

    const loadPlan = (plan) => {
        setContent(plan.content);
        setTitle(plan.title);
        form.setFieldsValue({ topic: plan.title });
        message.info(`Đã mở lại: ${plan.title}`);
    };

    const deletePlan = (id) => {
        const newHistory = history.filter(item => item.id !== id);
        setHistory(newHistory);
        localStorage.setItem('lesson_plans', JSON.stringify(newHistory));
        message.success('Đã xóa!');
    };

    return (
        <Row gutter={24} style={{ height: 'calc(100vh - 100px)' }}>
            <Col span={8} style={{ height: '100%', overflowY: 'auto' }}>
                <Card title="Cấu hình bài dạy" bordered={false} style={{ marginBottom: 16 }}>
                    <Form form={form} layout="vertical" onFinish={handleGenerate}>
                        <Form.Item label="Môn học" name="subject" initialValue="Hóa học">
                            <Select><Option value="Hóa học">Hóa học</Option><Option value="Vật lý">Vật lý</Option></Select>
                        </Form.Item>
                        <Form.Item label="Tên bài / Chủ đề" name="topic" rules={[{ required: true }]}>
                            <Input placeholder="VD: Axit Nitric" onChange={(e) => setTitle(e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Yêu cầu khác" name="req"><TextArea rows={2} /></Form.Item>
                        <Button type="primary" htmlType="submit" block icon={<RocketOutlined />} loading={loading}>Soạn ngay</Button>
                    </Form>
                </Card>

                <Card title={<span><HistoryOutlined /> Lịch sử giáo án</span>} bordered={false} bodyStyle={{ padding: '0 12px' }}>
                    <List
                        dataSource={history}
                        renderItem={item => (
                            <List.Item actions={[
                                <Popconfirm title="Xóa?" onConfirm={() => deletePlan(item.id)} key="del"><Button type="text" danger icon={<DeleteOutlined />} /></Popconfirm>
                            ]}>
                                <List.Item.Meta
                                    title={<a onClick={() => loadPlan(item)}>{item.title}</a>}
                                    description={<Text type="secondary" style={{ fontSize: 12 }}>{item.date}</Text>}
                                />
                            </List.Item>
                        )}
                    />
                </Card>
            </Col>

            <Col span={16} style={{ height: '100%' }}>
                <Card 
                    title={title || "Nội dung giáo án"} 
                    bordered={false} 
                    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                    extra={
                        <Space>
                            <Button icon={<FileWordOutlined />} onClick={handleExportWord}>Xuất Word</Button>
                            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>Lưu trữ</Button>
                        </Space>
                    }
                >
                    <ReactQuill theme="snow" value={content} onChange={setContent} style={{ height: '100%', paddingBottom: 40 }} />
                </Card>
            </Col>
        </Row>
    );
};
export default LessonPlanGenerator;