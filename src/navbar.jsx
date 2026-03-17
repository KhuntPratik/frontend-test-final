import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [role, setRole] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const userRole = localStorage.getItem('role')
    const token = localStorage.getItem('auth_token')

    if (userRole && token) {
      setRole(userRole)
      setIsLoggedIn(true)
    } else {
      setRole(null)
      setIsLoggedIn(false)
    }
  }, [location.pathname])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('role')
    localStorage.removeItem('token')
    setRole(null)
    setIsLoggedIn(false)
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container">
        <Link className="navbar-brand fw-semibold" to="/login">
          Clinic
        </Link>
        {isLoggedIn && role === 'patient' ? (
          <div className="d-none d-lg-flex align-items-center gap-2 small text-muted">
            <span>Student 1 Clinic</span>
            <span className="badge text-bg-light text-uppercase">patient</span>
          </div>
        ) : null}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            {!isLoggedIn ? (
              <li className="nav-item">
                <NavLink className="nav-link" to="/login">
                  Login
                </NavLink>
              </li>
            ) : (
              <>
                {role === 'admin' && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/adminhome">
                      Admin Dashboard
                    </NavLink>
                  </li>
                )}

                {role === 'doctor' && (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/doctorhome">
                        Today's Queue
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/doctor/prescription">
                        Add Prescription
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/doctor/report">
                        Add Report
                      </NavLink>
                    </li>
                  </>
                )}

                {role === 'patient' && (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/patienthome">
                        Dashboard
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/patient/book">
                        Book Appointment
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/patient/appointments">
                        My Appointments
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/patient/prescriptions">
                        My Prescriptions
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/patient/reports">
                        My Reports
                      </NavLink>
                    </li>
                  </>
                )}

                {role === 'receptionist' && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/receptionisthome">
                      Receptionist Dashboard
                    </NavLink>
                  </li>
                )}

                <li className="nav-item ms-lg-3">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handleLogout}
                    type="button"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
