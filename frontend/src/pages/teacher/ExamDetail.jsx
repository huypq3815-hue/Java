import { useState, useEffect, useRef } from 'react';
import { Card, Descriptions, Tag, Space, Button, Divider, List, Alert, message, Modal, Input, Spin, Typography } from 'antd';
import { ArrowLeftOutlined, PrinterOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../config/api';
import MathRenderer from '../../components/MathRenderer';
import html2pdf from 'html2pdf.js'; // Nhớ cài: npm install html2pdf.js

const { Text } = Typography;

// Component render nội dung có công thức
const MathContent = ({ content }) => {
    useEffect(() => {
        if (window.MathJax) {
            window.MathJax.typesetPromise();
        }
    }, [content]);
    return <MathRenderer content={content} />;
};

const ExamDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // State cho In ấn
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [printName, setPrintName] = useState("");
    const printRef = useRef();

    useEffect(() => {
        fetchExamDetail();
        if (!window.MathJax) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
            script.async = true;
            document.head.appendChild(script);
        }
    }, [id]);

    const fetchExamDetail = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/exams/${id}`);
            setExam(response);
            setPrintName(response.examName || `DE_THI_${response.examCode}`);
        } catch (error) {
            console.error('Error fetching exam detail: - ExamDetail.jsx:49', error);
            message.error('Không thể tải chi tiết đề thi');
        } finally {
            setLoading(false);
        }
    };

    const handlePrintPDF = () => {
        if (!printName.trim()) return message.warning("Vui lòng nhập tên đề thi!");
        
        const element = printRef.current;
        const opt = {
            margin: 10,
            filename: `${printName}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        message.loading("Đang tạo file PDF...", 1);
        html2pdf().set(opt).from(element).save().then(() => {
            message.success("Tải xuống thành công!");
            setIsPrintModalOpen(false);
        });
    };

    if (loading) return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
    if (!exam) return <Card>Không tìm thấy đề thi</Card>;

    return (
        <div style={{ padding: 0 }}>
            <Card>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/teacher/exams')}>
                            Quay lại
                        </Button>
                        <Button type="primary" icon={<PrinterOutlined />} onClick={() => setIsPrintModalOpen(true)}>
                            In đề (PDF)
                        </Button>
                    </div>

                    <Descriptions title={`Chi tiết: ${exam.examName || exam.examCode}`} bordered>
                        <Descriptions.Item label="Mã đề">
                            <Tag color="blue" style={{ fontSize: 16 }}>{exam.examCode}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Chủ đề">
                            {exam.topicTitle || `Topic ${exam.topicId}`}
                        </Descriptions.Item>
                        <Descriptions.Item label="Thời gian">
                            <Tag color="orange">{exam.duration} phút</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Tổng câu hỏi">
                            <Tag color="green">{exam.totalQuestions} câu</Tag>
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider>Nội dung đề thi (Kèm đáp án)</Divider>

                    <List
                        dataSource={exam.questions}
                        renderItem={(question, index) => (
                            <Card
                                key={question.id}
                                style={{ marginBottom: 16 }}
                                title={
                                    <Space>
                                        <span>Câu {index + 1}</span>
                                        <Tag color={question.level === 'EASY' ? 'green' : question.level === 'MEDIUM' ? 'orange' : 'red'}>
                                            {question.level}
                                        </Tag>
                                    </Space>
                                }
                            >
                                <MathContent content={question.content} />
                                <Divider style={{ margin: '12px 0' }} />
                                <List
                                    dataSource={question.answers}
                                    renderItem={(answer) => (
                                        <List.Item key={answer.id} style={{ padding: '8px 0' }}>
                                            <Space>
                                                {answer.isCorrect && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                                                <Tag color="blue">{answer.code}</Tag>
                                                <MathContent content={answer.content} />
                                            </Space>
                                        </List.Item>
                                    )}
                                />
                                {question.answers.find(a => a.isCorrect) && (
                                    <Alert
                                        message="Đáp án đúng"
                                        description={<Tag color="success">{question.answers.find(a => a.isCorrect).code}</Tag>}
                                        type="success"
                                        showIcon
                                        style={{ marginTop: 16 }}
                                    />
                                )}
                            </Card>
                        )}
                    />
                </Space>
            </Card>

            {/* MODAL NHẬP TÊN FILE */}
            <Modal title="In đề thi" open={isPrintModalOpen} onOk={handlePrintPDF} onCancel={() => setIsPrintModalOpen(false)} okText="Tải xuống">
                <Input value={printName} onChange={e => setPrintName(e.target.value)} placeholder="Nhập tên file PDF..." autoFocus />
            </Modal>

            {/* PHẦN ẨN ĐỂ IN RA PDF (KHÔNG CÓ ĐÁP ÁN ĐÚNG) */}
            <div style={{ position: 'absolute', left: '-9999px' }}>
                <div ref={printRef} style={{ padding: '20px', fontFamily: 'Times New Roman' }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <h2 style={{ margin: 0 }}>{printName.toUpperCase()}</h2>
                        <p style={{ margin: 0 }}>Môn: {exam.topicTitle} - Mã đề: {exam.examCode}</p>
                        <p style={{ margin: 0 }}>Thời gian làm bài: {exam.duration} phút</p>
                        <hr style={{ width: '50%' }} />
                    </div>
                    {exam.questions?.map((q, idx) => (
                        <div key={q.id} style={{ marginBottom: '15px', pageBreakInside: 'avoid' }}>
                            <div style={{ display: 'flex' }}>
                                <strong style={{ marginRight: '5px' }}>Câu {idx + 1}:</strong>
                                <div dangerouslySetInnerHTML={{ __html: q.content }} />
                            </div>
                            <div style={{ marginLeft: '15px', marginTop: '5px' }}>
                                {q.answers?.map(a => (
                                    <div key={a.id} style={{ marginBottom: '3px' }}>
                                        <strong>{a.code}.</strong> {a.content}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div style={{ textAlign: 'center', marginTop: '30px', fontStyle: 'italic' }}>--- HẾT ---</div>
                </div>
            </div>
        </div>
    );
};

export default ExamDetail;