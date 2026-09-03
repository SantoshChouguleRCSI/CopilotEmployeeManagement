import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { EmployeeEditPage } from './pages/EmployeeEditPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { EmployeesPage } from './pages/EmployeesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/employees" replace />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/employees/new" element={<EmployeeEditPage />} />
        <Route path="/employees/:id/edit" element={<EmployeeEditPage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
