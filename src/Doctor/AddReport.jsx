import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

export default function AddReport() {
  const [searchParams] = useSearchParams()
  const [appointmentId, setAppointmentId] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [testRecommended, setTestRecommended] = useState('')
  const [remarks, setRemarks] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const authHeaders = () => {
    const token =
      localStorage.getItem('auth_token') || localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  useEffect(() => {
    const id = searchParams.get('appointmentId')
    if (id) {
      setAppointmentId(id)
    }
  }, [searchParams])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const payload = {
        appointmentId,
        diagnosis,
        testRecommended,
        remarks,
      }
      await axios.post(`${BASE_URL}/reports/${appointmentId}`, payload, {
        headers: authHeaders(),
      })
      setSuccess('Report saved.')
      setDiagnosis('')
      setTestRecommended('')
      setRemarks('')
    } catch (err) {
      const data = err?.response?.data
      setError(
        data?.message || data?.error || err?.message || 'Failed to save report'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-4">
        <h1 className="h4 mb-3">Add Medical Report</h1>

        {error ? <div className="alert alert-danger">{error}</div> : null}
        {success ? <div className="alert alert-success">{success}</div> : null}

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Appointment ID</label>
                <input
                  className="form-control"
                  value={appointmentId}
                  onChange={(event) => setAppointmentId(event.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Diagnosis *</label>
                <input
                  className="form-control"
                  value={diagnosis}
                  onChange={(event) => setDiagnosis(event.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Test recommended (optional)</label>
                <input
                  className="form-control"
                  placeholder="e.g. Blood Test"
                  value={testRecommended}
                  onChange={(event) => setTestRecommended(event.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Remarks (optional)</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="e.g. Rest for 3 days"
                  value={remarks}
                  onChange={(event) => setRemarks(event.target.value)}
                />
              </div>

              <button className="btn btn-success" disabled={loading}>
                {loading ? 'Saving...' : 'Save Report'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
