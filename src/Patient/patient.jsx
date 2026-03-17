import { Link } from 'react-router-dom'

export default function PatientHome() {
  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h1 className="h3 mb-0">Patient Dashboard</h1>
          <span className="badge text-bg-info text-uppercase">Patient</span>
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card h-100">
              <div className="card-body">
                <h2 className="h6">Book Appointment</h2>
                <p className="text-secondary">
                  Choose a date and time slot to book.
                </p>
                <Link className="btn btn-success btn-sm" to="/patient/book">
                  Open
                </Link>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="card h-100">
              <div className="card-body">
                <h2 className="h6">My Appointments</h2>
                <p className="text-secondary">
                  View your appointments and details.
                </p>
                <Link className="btn btn-success btn-sm" to="/patient/appointments">
                  Open
                </Link>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="card h-100">
              <div className="card-body">
                <h2 className="h6">My Prescriptions</h2>
                <p className="text-secondary">Check your prescriptions.</p>
                <Link className="btn btn-success btn-sm" to="/patient/prescriptions">
                  Open
                </Link>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="card h-100">
              <div className="card-body">
                <h2 className="h6">My Reports</h2>
                <p className="text-secondary">View medical reports.</p>
                <Link className="btn btn-success btn-sm" to="/patient/reports">
                  Open
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
