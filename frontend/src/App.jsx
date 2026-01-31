import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';

// Layout & Components
import MainLayout from './components/layouts/MainLayout';
import ErrorBoundary from './components/ErrorBoundary';

// Pages - Auth
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// Pages - Common
import Dashboard from './pages/Dashboard';
import Profile from './pages/common/Profile';
import Settings from './pages/common/Settings';

// Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminQuestionList from './pages/admin/QuestionList';
import AdminQuestionForm from './pages/admin/QuestionForm';
import AdminUserList from './pages/admin/UserList';
import PromptList from './pages/admin/PromptList';
import PromptForm from './pages/admin/PromptForm';

// Pages - Teacher
import ExamList from './pages/teacher/ExamList';
import ExamCreationWizard from './pages/teacher/ExamCreationWizard';
import ExamDetail from './pages/teacher/ExamDetail';
import ExamResults from './pages/teacher/ExamResults';
import LessonPlanGenerator from './pages/teacher/LessonPlanGenerator';
import StandaloneOCR from './pages/teacher/StandaloneOCR';
import QuestionBank from './pages/teacher/QuestionBank'; // <--- ĐÃ IMPORT COMPONENT MỚI

// Protected Route với debug log
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('accessToken');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : {};

  // Debug log để dễ kiểm tra khi đăng nhập không redirect
  console.log('ProtectedRoute CHECK: - App.jsx:43', {
    currentPath: window.location.pathname,
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 20) + '...' : 'NO_TOKEN',
    userRole: user.role || 'NO_ROLE',
    allowedRoles: allowedRoles || 'ANY_ROLE_ALLOWED',
    fullUser: user,
  });

  if (!token) {
    console.log('No token → redirect to /login - App.jsx:53');
    return <Navigate to="/login" replace />;
  }

  // Chuẩn hóa role (bỏ ROLE_ nếu có để so sánh)
  const userRole = user.role ? user.role.replace('ROLE_', '') : '';

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    console.log(
      ` Role "${userRole}" not allowed in ${JSON.stringify(allowedRoles)} → redirect to /dashboard`
    );
    // Nếu role không khớp, điều hướng về dashboard tương ứng
    if (userRole === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (userRole === 'TEACHER') return <Navigate to="/teacher/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  console.log('Access granted → render protected content - App.jsx:70');
  return children;
};

function App() {
  return (
    <ErrorBoundary>
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
            Layout: { siderBg: '#ffffff', headerBg: '#ffffff' },
            Menu: { darkItemBg: '#ffffff', darkItemSelectedBg: '#0891b2' },
          },
        }}
      >
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes - wrapped in MainLayout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              {/* Default redirect */}
              <Route index element={<Navigate to="/dashboard" replace />} />

              {/* Common pages */}
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />

              {/* Admin Routes */}
              <Route
                path="admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/users"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminUserList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/questions"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
                    <AdminQuestionList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/questions/new"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
                    <AdminQuestionForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/questions/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
                    <AdminQuestionForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/prompts"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <PromptList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/prompts/new"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <PromptForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/prompts/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <PromptForm />
                  </ProtectedRoute>
                }
              />

              {/* Teacher Routes */}
              <Route
                path="teacher/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}>
                    <Dashboard /> 
                  </ProtectedRoute>
                }
              />
              <Route
                path="teacher/lesson-plans"
                element={
                  <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}>
                    <LessonPlanGenerator />
                  </ProtectedRoute>
                }
              />
              
              {/* --- CẬP NHẬT ROUTE NGÂN HÀNG CÂU HỎI --- */}
              <Route
                path="teacher/questions"
                element={
                  <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}>
                    <QuestionBank /> {/* Sử dụng giao diện mới QuestionBank */}
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="teacher/exams"
                element={
                  <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}>
                    <ExamList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="teacher/exams/create"
                element={
                  <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}>
                    <ExamCreationWizard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="teacher/exams/:id"
                element={
                  <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}>
                    <ExamDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="teacher/exams/:examId/results"
                element={
                  <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}>
                    <ExamResults />
                  </ProtectedRoute>
                }
              />
              <Route
                path="teacher/ocr"
                element={
                  <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}>
                    <StandaloneOCR />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch-all 404 */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </ErrorBoundary>
  );
}

export default App;