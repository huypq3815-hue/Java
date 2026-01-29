import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';

// Layout
import MainLayout from './components/layouts/MainLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminQuestionList from './pages/admin/QuestionList';
import AdminQuestionForm from './pages/admin/QuestionForm';
import AdminUserList from './pages/admin/UserList';
import PromptList from './pages/admin/PromptList';
import PromptForm from './pages/admin/PromptForm';
import ExamList from './pages/teacher/ExamList';
import ExamCreationWizard from './pages/teacher/ExamCreationWizard';
import ExamDetail from './pages/teacher/ExamDetail';
import ExamResults from './pages/teacher/ExamResults';
import LessonPlanGenerator from './pages/teacher/LessonPlanGenerator';
import StandaloneOCR from './pages/teacher/StandaloneOCR';
import Profile from './pages/common/Profile';
import Settings from './pages/common/Settings';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) return <Navigate to="/login" replace />;
  const userRole = user.role?.replace('ROLE_', '') || '';

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {

          colorPrimary: '#0891b2',
          colorSuccess: '#10b981',
          colorWarning: '#f59e0b',
          colorError: '#ef4444',
          borderRadius: 8,
          fontFamily: "'Inter', system-ui, sans-serif",
        },
        components: {
          Layout: { siderBg: '#111827', headerBg: '#ffffff' },
          Menu: { darkItemBg: '#111827', darkItemSelectedBg: '#0891b2' },
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="teacher/dashboard" element={<Dashboard />} />
            <Route path="admin/dashboard" element={<Dashboard />} />

            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />

            {/* Admin */}
            <Route path="admin/questions" element={<ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}><AdminQuestionList /></ProtectedRoute>} />
            <Route path="admin/questions/new" element={<ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}><AdminQuestionForm /></ProtectedRoute>} />
            <Route path="admin/questions/edit/:id" element={<ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}><AdminQuestionForm /></ProtectedRoute>} />
            <Route path="admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUserList /></ProtectedRoute>} />
            <Route path="admin/prompts" element={<ProtectedRoute allowedRoles={['ADMIN']}><PromptList /></ProtectedRoute>} />
            <Route path="admin/prompts/new" element={<ProtectedRoute allowedRoles={['ADMIN']}><PromptForm /></ProtectedRoute>} />
            <Route path="admin/prompts/edit/:id" element={<ProtectedRoute allowedRoles={['ADMIN']}><PromptForm /></ProtectedRoute>} />

            {/* Teacher */}
            <Route path="teacher/lesson-plans" element={<ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}><LessonPlanGenerator /></ProtectedRoute>} />
            <Route path="teacher/questions" element={<ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}><AdminQuestionList /></ProtectedRoute>} />
            <Route path="teacher/exams" element={<ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}><ExamList /></ProtectedRoute>} />
            <Route path="teacher/exams/create" element={<ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}><ExamCreationWizard /></ProtectedRoute>} />
            <Route path="teacher/exams/:id" element={<ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}><ExamDetail /></ProtectedRoute>} />
            <Route path="teacher/exams/:examId/results" element={<ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}><ExamResults /></ProtectedRoute>} />

            <Route path="teacher/ocr" element={<ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}><StandaloneOCR /></ProtectedRoute>} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;