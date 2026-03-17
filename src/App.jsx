import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './Auth/login'
import DoctorHome from './Doctor/doctor'
import AdminHome from './Admin/admin'
import PatientHome from './Patient/patient'
import ReceptionistHome from './Receptionist/receptionist'
import Navbar from './navbar'
import AddPrescription from './Doctor/AddPrescription'
import AddReport from './Doctor/AddReport'
import BookAppointment from './Patient/BookAppointment'
import MyAppointments from './Patient/MyAppointments'
import MyPrescriptions from './Patient/MyPrescriptions'
import MyReports from './Patient/MyReports'

function RequireRole({ role, children }) {
  const storedRole = localStorage.getItem('role')
  const token =
    localStorage.getItem('auth_token') || localStorage.getItem('token')

  if (!token || !storedRole) {
    return <Navigate to="/login" replace />
  }

  if (storedRole !== role) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/doctorhome"
            element={
              <RequireRole role="doctor">
                <DoctorHome />
              </RequireRole>
            }
          />
          <Route
            path="/doctor/prescription"
            element={
              <RequireRole role="doctor">
                <AddPrescription />
              </RequireRole>
            }
          />
          <Route
            path="/doctor/report"
            element={
              <RequireRole role="doctor">
                <AddReport />
              </RequireRole>
            }
          />
          <Route
            path="/adminhome"
            element={
              <RequireRole role="admin">
                <AdminHome />
              </RequireRole>
            }
          />
          <Route
            path="/patienthome"
            element={
              <RequireRole role="patient">
                <PatientHome />
              </RequireRole>
            }
          />
          <Route
            path="/patient/book"
            element={
              <RequireRole role="patient">
                <BookAppointment />
              </RequireRole>
            }
          />
          <Route
            path="/patient/appointments"
            element={
              <RequireRole role="patient">
                <MyAppointments />
              </RequireRole>
            }
          />
          <Route
            path="/patient/prescriptions"
            element={
              <RequireRole role="patient">
                <MyPrescriptions />
              </RequireRole>
            }
          />
          <Route
            path="/patient/reports"
            element={
              <RequireRole role="patient">
                <MyReports />
              </RequireRole>
            }
          />
          <Route
            path="/receptionisthome"
            element={
              <RequireRole role="receptionist">
                <ReceptionistHome />
              </RequireRole>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
