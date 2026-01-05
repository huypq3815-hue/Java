import React, { useState } from 'react';
import {Card, Row, Col, Statistic, Table, Typography, Input, Button, Space, message, Empty }
from 'antd';
import { BarChart, Bar,XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend }
from 'recharts';
import { UserOutlined, FileTextOutlined, TrophyOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import examService from '../../services/examService';

const { Title } = Typography;

const ExamReport = () => {
  const [classId, setClassId] = useState('');
  const [currentClass, setCurrentClass] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState({
    totalStudents: 0,
    averageScore: 0,
    highestScore: 0,
    scoreDistribution: [],
    passFail: [],
    detailedScores: [],
  });

  const COLORS = ['#52c41a', '#ff4d4f'];

  const fetchReport = async (className) => {
    if (!className.trim()) {
      message.warning('Vui lòng nhập tên lớp!');
      return;
    }

    setLoading(true);
    try {
      const response = await examService.getClassReport(className.trim());
      setReportData(response.data || {
        totalStudents: 0,
        averageScore: 0,
        highestScore: 0,
        scoreDistribution: [],
        passFail: [],
        detailedScores: [],
      });
      setCurrentClass(className.trim());
    } catch (error) {
      console.error('Lỗi tải báo cáo: - ExamReport.jsx:46', error);
      message.error('Không tìm thấy dữ liệu cho lớp này!');
      // Reset về 0 nhưng vẫn giữ structure để hiện khung
      setReportData({
        totalStudents: 0,
        averageScore: 0,
        highestScore: 0,
        scoreDistribution: [],
        passFail: [],
        detailedScores: [],
      });
      setCurrentClass(className.trim());
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchReport(classId);
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') fetchReport(classId);
  };

  const handleExportExcel = () => {
    if (!reportData.detailedScores || reportData.detailedScores.length === 0) {
      message.warning('Không có dữ liệu để xuất!');
      return;
    }
    try {
      const dataToExport = reportData.detailedScores.map((item, index) => ({
        STT: index + 1,
        'Họ và Tên': item.studentName,
        'Điểm Số': item.score,
        'Xếp Hạng': item.rank,
      }));
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const wscols = [{ wch: 5 }, { wch: 30 }, { wch: 10 }, { wch: 10 }];
      worksheet['!cols'] = wscols;
      XLSX.utils.book_append_sheet(workbook, worksheet, 'BangDiem');
      const fileName = `BangDiem_Lop_${currentClass || 'Unknown'}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      message.success('Xuất file Excel thành công!');
    } catch (error) {
      message.error('Có lỗi xảy ra khi xuất file!');
    }
  };

  const columns = [
    { title: 'STT', render: (_, __, index) => index + 1, width: 60 },
    { title: 'Học sinh', dataIndex: 'studentName', key: 'studentName' },
    { title: 'Điểm', dataIndex: 'score', key: 'score', sorter: (a, b) => b.score - a.score },
    { title: 'Xếp hạng', dataIndex: 'rank', key: 'rank' },
  ];

  // Kiểm tra có dữ liệu hay không để hiển thị thông báo trong Chart
  const hasScoreData = reportData.scoreDistribution && reportData.scoreDistribution.length > 0;
  const hasPassFailData = reportData.passFail && reportData.passFail.length > 0;
  const hasDetailData = reportData.detailedScores && reportData.detailedScores.length > 0;

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Báo cáo & Phân tích kết quả</Title>

      {/* Input tìm kiếm */}
      <Space style={{ marginBottom: 24 }}>
        <Input
          placeholder="Nhập tên lớp (ví dụ: 10A1...)"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          onKeyDown={handleEnter}
          style={{ width: 300 }}
          allowClear
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} loading={loading}>
          Tìm báo cáo
        </Button>
      </Space>

      {/* Tiêu đề lớp hiện tại (nếu có) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={4} type="secondary" style={{ margin: 0 }}>
          {currentClass ? <>Lớp: <strong>{currentClass}</strong></> : 'Chưa chọn lớp'}
        </Title>
        
        <Button 
          type="primary" 
          style={{ backgroundColor: hasDetailData ? '#217346' : undefined }} 
          icon={<DownloadOutlined />} 
          onClick={handleExportExcel}
          disabled={!hasDetailData}
        >
          Export Excel
        </Button>
      </div>

      {/* --- LUÔN HIỂN THỊ CÁC KHỐI DƯỚI ĐÂY --- */}
      
      {/* 1. THỐNG KÊ TỔNG QUAN */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic
              title="Sĩ số"
              value={reportData.totalStudents}
              prefix={<UserOutlined />}
              suffix="HS"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic
              title="Điểm trung bình"
              value={reportData.averageScore}
              precision={1}
              valueStyle={{ color: '#1890ff' }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic
              title="Điểm cao nhất"
              value={reportData.highestScore}
              valueStyle={{ color: '#cf1322' }}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 2. BIỂU ĐỒ */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        {/* Biểu đồ Phổ điểm */}
        <Col span={14}>
          <Card title="Phổ điểm lớp" loading={loading} style={{ height: '100%' }}>
            {hasScoreData ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1890ff" name="Số lượng" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có dữ liệu phổ điểm" style={{ margin: '50px 0' }} />
            )}
          </Card>
        </Col>

        {/* Biểu đồ Tròn */}
        <Col span={10}>
          <Card title="Tỉ lệ Đạt / Trượt" loading={loading} style={{ height: '100%' }}>
            {hasPassFailData ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reportData.passFail}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    label
                  >
                    {reportData.passFail.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có dữ liệu đạt/trượt" style={{ margin: '50px 0' }} />
            )}
          </Card>
        </Col>
      </Row>

      {/* 3. BẢNG ĐIỂM CHI TIẾT */}
      <Card 
        title="Danh sách điểm chi tiết học sinh" 
        loading={loading}
      >
        <Table
          columns={columns}
          dataSource={reportData.detailedScores}
          pagination={{ pageSize: 10 }}
          rowKey="studentName"
          locale={{ emptyText: <Empty description="Chưa có dữ liệu học sinh" /> }}
        />
      </Card>
    </div>
  );
};

export default ExamReport;