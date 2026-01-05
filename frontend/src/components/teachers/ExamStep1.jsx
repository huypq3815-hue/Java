import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Form, Input, InputNumber, Select } from 'antd';

const ExamStep1 = () => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Form.Item label="Tên đề thi" validateStatus={errors.examName ? 'error' : ''} help={errors.examName?.message}>
        <Controller name="examName" control={control} render={({ field }) => <Input {...field} placeholder="Ví dụ: Kiểm tra 1 tiết Hóa" />} />
      </Form.Item>

      <Form.Item label="Chủ đề" validateStatus={errors.topic ? 'error' : ''} help={errors.topic?.message}>
        <Controller name="topic" control={control} render={({ field }) => (
          <Select {...field} placeholder="Chọn chủ đề">
            <Select.Option value="Hóa vô cơ">Hóa vô cơ</Select.Option>
            <Select.Option value="Hóa hữu cơ">Hóa hữu cơ</Select.Option>
            <Select.Option value="Hóa phân tích">Hóa phân tích</Select.Option>
            <Select.Option value="Tổng hợp">Tổng hợp</Select.Option>
          </Select>
        )} />
      </Form.Item>

      <Form.Item label="Thời gian (phút)" validateStatus={errors.examDuration ? 'error' : ''} help={errors.examDuration?.message}>
        <Controller name="examDuration" control={control} render={({ field }) => <InputNumber {...field} style={{ width: '100%' }} min={1} />} />
      </Form.Item>
    </div>
  );
};

export default ExamStep1;