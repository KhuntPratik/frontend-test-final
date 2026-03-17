import { useState } from 'react'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

export default function BookAppointment() {
  const [booking, setBooking] = useState({
    appointmentDate: '',
    timeSlot: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const authHeaders = () => {
    const token =
      localStorage.getItem('auth_token') || localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const handleBookAppointment = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const payload = {
        appointmentDate: booking.appointmentDate,
        timeSlot: booking.timeSlot,
      }
      await axios.post(`${BASE_URL}/appointments`, payload, {
        headers: authHeaders(),
      })
      setSuccess('Appointment booked successfully.')
      setBooking({ appointmentDate: '', timeSlot: '' })
    } catch (err) {
      const data = err?.response?.data
      setError(
        data?.message ||
          data?.error ||
          err?.message ||
          'Failed to book appointment'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h1 className="h4 mb-0">Book Appointment</h1>
        </div>

        {error ? <div className="alert alert-danger">{error}</div> : null}
        {success ? <div className="alert alert-success">{success}</div> : null}

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleBookAppointment}>
              <div className="mb-3">
                <label className="form-label">Appointment Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={booking.appointmentDate}
                  onChange={(event) =>
                    setBooking((prev) => ({
                      ...prev,
                      appointmentDate: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Time Slot</label>
                <select
                  className="form-select"
                  value={booking.timeSlot}
                  onChange={(event) =>
                    setBooking((prev) => ({
                      ...prev,
                      timeSlot: event.target.value,
                    }))
                  }
                  required
                >
                  <option value="">Select a time slot</option>
                  <option value="09:00-09:15">09:00-09:15</option>
                  <option value="09:15-09:30">09:15-09:30</option>
                  <option value="09:30-09:45">09:30-09:45</option>
                  <option value="09:45-10:00">09:45-10:00</option>
                  <option value="10:00-10:15">10:00-10:15</option>
                  <option value="10:15-10:30">10:15-10:30</option>
                  <option value="10:30-10:45">10:30-10:45</option>
                  <option value="10:45-11:00">10:45-11:00</option>
                  <option value="11:00-11:15">11:00-11:15</option>
                  <option value="11:15-11:30">11:15-11:30</option>
                </select>
              </div>
              <button className="btn btn-success" disabled={loading}>
                {loading ? 'Booking...' : 'Book appointment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
