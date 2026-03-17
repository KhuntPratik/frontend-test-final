import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

export default function DoctorHome() {
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const authHeaders = () => {
    const token =
      localStorage.getItem('auth_token') || localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const loadQueue = async () => {
    setError('')
    setLoading(true)
    try {
      const urls = [`${BASE_URL}/doctor/queue`, `${BASE_URL}/queue`]
      let response = null
      let lastError = null

      for (const url of urls) {
        try {
          response = await axios.get(url, { headers: authHeaders() })
          break
        } catch (err) {
          if (err?.response?.status === 404) {
            lastError = err
            continue
          }
          throw err
        }
      }

      if (!response) {
        throw lastError || new Error('Queue endpoint not found')
      }

      setQueue(response.data?.queue || response.data || [])
    } catch (err) {
      const data = err?.response?.data
      setError(data?.message || data?.error || err?.message || 'Failed to load queue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQueue()
  }, [])

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h1 className="h4 text-success mb-0">Today's Queue</h1>
        </div>

        {error ? <div className="alert alert-danger">{error}</div> : null}

        <div className="card">
          <div className="card-body">
            {queue.length ? (
              <div className="table-responsive bg-white rounded-3 shadow-sm p-2">
                <table className="table table-borderless align-middle mb-0">
                  <thead>
                    <tr>
                      <th className="text-uppercase text-secondary small">Token</th>
                      <th className="text-uppercase text-secondary small">Patient</th>
                      <th className="text-uppercase text-secondary small">Status</th>
                      <th className="text-uppercase text-secondary small">
                        Appointment ID
                      </th>
                      <th className="text-uppercase text-secondary small">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queue.map((item, index) => (
                      <tr key={item.id || item._id || index} className="border-top">
                        <td>
                          {item.tokenNumber ||
                            item.queueEntry?.tokenNumber ||
                            '-'}
                        </td>
                        <td>
                          {item.patientName ||
                            item.patient ||
                            item.appointment?.patient?.name ||
                            '-'}
                        </td>
                        <td>
                          <span className="badge text-bg-primary text-uppercase">
                            {item.status || item.queueEntry?.status || 'in_progress'}
                          </span>
                        </td>
                        <td>{item.appointmentId || item.appointment?.id || '-'}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() =>
                                navigate(
                                  `/doctor/prescription?appointmentId=${
                                    item.appointmentId || item.appointment?.id || ''
                                  }`
                                )
                              }
                            >
                              Add medicine
                            </button>
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() =>
                                navigate(
                                  `/doctor/report?appointmentId=${
                                    item.appointmentId || item.appointment?.id || ''
                                  }`
                                )
                              }
                            >
                              Add report
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-secondary mb-0">
                {loading ? 'Loading queue...' : 'No queue available.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
