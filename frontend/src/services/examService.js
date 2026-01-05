import axiosClient from './axiosClient';

const examService = {
  createExam: (examData) => axiosClient.post('/exams', examData),
  generateQuestions: (matrixConfig) => axiosClient.post('/exams/generate', matrixConfig),
  gradeExamPaper: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post('/grading/ocr', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  getClassReport: (classId) => axiosClient.get(`/reports/class/${classId}`),
};

export default examService;