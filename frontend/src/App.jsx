import { BrowserRouter, Routes, Route, Navigate } from 'react-route-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';

// Layout
import MainLayout from 'components/layouts/MainLayout';

// Pages
import Login from 'pages/Login';
import Register from 'pages/Register';
import Dashboard from 'pages/Dashboard';

// Admin Pages
import AdminQuestionList from './pages/admin/QuestionList';
import AdminQuestionForm from './pages/admin/QuestionForm';
import AdminUserList from './pages/admin/UserList';

// // Teacher Pages (Cẩm Tú sẽ làm)
// import TeacherExamCreate from './pages/teacher/ExamCreate';
// import TeacherExamGrade from './pages/teacher/ExamGrade';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
function App() {
  return (
    <ConfigProvider locale={viVN}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard chung */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* Admin Routes - CHỈ ADMIN MỚI VÀO ĐƯỢC */}
            <Route
              path="admin/questions"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminQuestionList />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/questions/new"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminQuestionForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/questions/edit/:id"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminQuestionForm />
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

            {/* Teacher Routes - CẨM TÚ LÀM */}
            {/* <Route path="teacher/exams/create" element={<TeacherExamCreate />} /> */}
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
