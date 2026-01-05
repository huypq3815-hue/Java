import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Typography, List, Divider } from 'antd';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const { Title } = Typography;

const ExamStep3 = ({ questions }) => {
  const { watch } = useFormContext();
  const formData = watch();

  return (
    <div>
      <Title level={4}>Xem trước đề thi: {formData.examName}</Title>
      <Typography.Text>Thời gian: {formData.examDuration} phút</Typography.Text>
      <Typography.Text block>Chủ đề: {formData.topic}</Typography.Text>
      <Typography.Text block>Cấu hình: {formData.easyQuestions} dễ, {formData.mediumQuestions} trung bình, {formData.hardQuestions} khó</Typography.Text>
      
      <Divider />
      
      <Title level={5}>Danh sách câu hỏi:</Title>
      <List
        bordered
        dataSource={questions || []}  // Từ props questions (từ API)
        renderItem={(q, index) => (
          <List.Item>
            <Typography.Text strong>Câu {index + 1}:</Typography.Text>
            {q.isBlock ? <BlockMath math={q.text} /> : <InlineMath math={q.text} />}
          </List.Item>
        )}
      />
    </div>
  );
};

export default ExamStep3;