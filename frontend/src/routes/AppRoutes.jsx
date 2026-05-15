import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import DashboardLayout from '../pages/DashboardLayout.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import Overview from '../pages/Overview.jsx';
import Students from '../pages/Students.jsx';
import AddStudent from '../pages/AddStudent.jsx';
import EditStudent from '../pages/EditStudent.jsx';
import NotFound from '../pages/NotFound.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="students" element={<Students />} />
        <Route path="students/add" element={<AddStudent />} />
        <Route path="students/:id/edit" element={<EditStudent />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
