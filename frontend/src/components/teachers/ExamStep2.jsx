import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Form, InputNumber, Row, Col } from 'antd';

const ExamStep2 = () => {
  const { control } = useFormContext();

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Form.Item label="Số câu Dễ">
          <Controller
            name="easyQuestions"
            control={control}
            render={({ field }) => <InputNumber {...field} style={{ width: '100%' }} min={0} />}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Số câu Trung bình">
          <Controller
            name="mediumQuestions"
            control={control}
            render={({ field }) => <InputNumber {...field} style={{ width: '100%' }} min={0} />}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Số câu Khó">
          <Controller
            name="hardQuestions"
            control={control}
            render={({ field }) => <InputNumber {...field} style={{ width: '100%' }} min={0} />}
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default ExamStep2;