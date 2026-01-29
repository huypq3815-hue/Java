import { useState, useEffect } from 'react';
import { Card, Descriptions, Tag, Space, Button, Divider, List, Alert, Typography } from 'antd';
import { ArrowLeftOutlined, PrinterOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../config/api';

const { Title, Text } = Typography;

// Component hiển thị công thức (Mock MathJax/Katex)
const MathContent = ({ content }) => <div dangerouslySetInnerHTML={{ __html: content }} />;

const ExamDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Mock data nếu API chưa có
        // fetchExamDetail();
        setExam({
            examCode: 'CHEM-HK1-001',
            topicId: 1,
            totalQuestions: 10,
            questions: Array.from({length: 10}, (_, i) => ({
                id: i,
                level: i < 5 ? 'EASY' : i < 8 ? 'MEDIUM' : 'HARD',
                content: `Câu hỏi số ${i + 1}: Công thức hóa học của Axit Sulfuric là gì?`,
                answers: [
                    { id: 1, code: 'A', content: 'HCl', isCorrect: false },
                    { id: 2, code: 'B', content: 'H2SO4', isCorrect: true },
                    { id: 3, code: 'C', content: 'HNO3', isCorrect: false },
                    { id: 4, code: 'D', content: 'NaCl', isCorrect: false },
                ]
            }))
        });
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (!exam) return <Card loading>Đang tải...</Card>;

    return (
        <div className="exam-detail-page">
            {/* CSS CHO IN ẤN */}
            <style>{`
                @media print {
                    @page { margin: 20mm; }
                    body * { visibility: hidden; }
                    .exam-content, .exam-content * { visibility: visible; }
                    .exam-content { position: absolute; left: 0; top: 0; width: 100%; }
                    .no-print { display: none !important; }
                    .ant-card { box-shadow: none !important; border: none !important; }
                }
            `}</style>

            <Card className="exam-content">
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* Header - Ẩn khi in */}
                    <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/teacher/exams')}>
                            Quay lại
                        </Button>
                        <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
                            In đề thi
                        </Button>
                    </div>

                    {/* Tiêu đề khi in */}
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                        <Title level={3}>ĐỀ KIỂM TRA HÓA HỌC</Title>
                        <Text>Mã đề: <b>{exam.examCode}</b></Text> | <Text>Thời gian: 45 phút</Text>
                    </div>

                    {/* Danh sách câu hỏi */}
                    <div className="questions-list">
                        {exam.questions.map((question, index) => (
                            <div key={question.id} style={{ marginBottom: 24, pageBreakInside: 'avoid' }}>
                                <Space style={{ alignItems: 'flex-start' }}>
                                    <strong style={{ whiteSpace: 'nowrap' }}>Câu {index + 1}: </strong>
                                    <MathContent content={question.content} />
                                </Space>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8, paddingLeft: 20 }}>
                                    {question.answers.map(ans => (
                                        <div key={ans.id}>
                                            <b>{ans.code}.</b> <span dangerouslySetInnerHTML={{ __html: ans.content }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer khi in */}
                    <div style={{ marginTop: 40, textAlign: 'center', borderTop: '1px solid #ccc', paddingTop: 10 }}>
                        <Text type="secondary">--- Hết ---</Text>
                    </div>
                </Space>
            </Card>
        </div>
    );
};

export default ExamDetail;