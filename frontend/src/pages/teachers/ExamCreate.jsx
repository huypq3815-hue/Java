import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button, Steps, Card, message, theme, Spin, Breadcrumb } from 'antd';

import ExamStep1 from '../../components/teachers/ExamStep1';
import ExamStep2 from '../../components/teachers/ExamStep2';
import ExamStep3 from '../../components/teachers/ExamStep3';

import examService from '../../services/examService';


const schema = z.object({
  examName: z.string().min(1, 'Tên đề thi bắt buộc'),
  examDuration: z.number().min(1, 'Thời gian phải lớn hơn 0'),
  topic: z.string().min(1, 'Chủ đề bắt buộc'), 
  easyQuestions: z.number().min(0),
  mediumQuestions: z.number().min(0),
  hardQuestions: z.number().min(0),
});

const ExamCreate = () => {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const { token } = theme.useToken();
  const [generatedQuestions, setGeneratedQuestions] = useState([]);

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      examName: '',
      examDuration: 60,
      topic: 'Hóa vô cơ',
      easyQuestions: 5,
      mediumQuestions: 10,
      hardQuestions: 5,
    },
  });

  const { handleSubmit, trigger, watch } = methods;
  const formData = watch();

  const steps = [
    { title: 'Thông tin cơ bản', content: <ExamStep1 /> },
    { title: 'Cấu hình ma trận', content: <ExamStep2 /> },
    { title: 'Xem trước và lưu', content: <ExamStep3 questions={generatedQuestions} /> },
  ];

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      if (current === 1) {
        await handleGenerate();
      }
      setCurrent(current + 1);
    }
  };

  const handleBack = () => {
    setCurrent(current - 1);
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await examService.generateQuestions(formData);
      setGeneratedQuestions(response.data.questions);
      message.success('Đã generate câu hỏi thành công!');
    } catch (error) {
      message.error('Lỗi khi generate đề!');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await examService.createExam(data);
      message.success('Đã lưu đề thi thành công!');
    } catch (error) {
      message.error('Lỗi khi lưu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={<Breadcrumb items={[ { title: 'Tạo đề thi' }]} />}
      style={{ maxWidth: 1000, margin: '20px auto' }}
    >
      <Steps current={current} items={steps.map(item => ({ key: item.title, title: item.title }))} />
      
      <div style={{ marginTop: 24, minHeight: 300, padding: 20, border: `1px dashed ${token.colorBorder}` }}>
        <Spin spinning={loading} tip="Đang xử lý...">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {steps[current].content}
            </form>
          </FormProvider>
        </Spin>
      </div>
      
      <div style={{ marginTop: 24, textAlign: 'right' }}>
        {current > 0 && <Button style={{ margin: '0 8px' }} onClick={handleBack} disabled={loading}>Quay lại</Button>}
        {current < steps.length - 1 && <Button type="primary" onClick={handleNext} loading={loading}>Tiếp theo</Button>}
        {current === steps.length - 1 && <Button type="primary" onClick={handleSubmit(onSubmit)} loading={loading}>Lưu đề thi</Button>}
      </div>
    </Card>
  );
};

export default ExamCreate;