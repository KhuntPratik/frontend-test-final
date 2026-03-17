import { useEffect, useState } from 'react'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

export default function ReceptionistHome() {
  const [queue, setQueue] = useState([])
  const [selectedDate, setSelectedDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const authHeaders = () => {
    const token =
      localStorage.getItem('auth_token') || localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const loadQueue = async (dateValue) => {
    setError('')
    setLoading(true)
    try {
      const params = dateValue ? { date: dateValue } : {}
      const urls = [
        `${BASE_URL}/queue`,
        `${BASE_URL}/receptionist/queue`,
        `${BASE_URL}/queue/manage`,
      ]
      let response = null
      let lastError = null

      for (const url of urls) {
        try {
          response = await axios.get(url, {
            headers: authHeaders(),
            params,
          })
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

  const handleMarkInProgress = async (queueId) => {
    if (!queueId) return
    setError('')
    setLoading(true)
    try {
      await axios.patch(
        `${BASE_URL}/queue/${queueId}`,
        { status: 'in-progress' },
        { headers: authHeaders() }
      )
      setQueue((prev) =>
        prev.map((item) =>
          (item.id || item._id) === queueId
            ? { ...item, status: 'in-progress' }
            : item
        )
      )
    } catch (err) {
      const data = err?.response?.data
      setError(
        data?.message || data?.error || err?.message || 'Failed to update queue'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = async (queueId) => {
    if (!queueId) return
    setError('')
    setLoading(true)
    try {
      await axios.patch(
        `${BASE_URL}/queue/${queueId}`,
        { status: 'skipped' },
        { headers: authHeaders() }
      )
      setQueue((prev) =>
        prev.map((item) =>
          (item.id || item._id) === queueId
            ? { ...item, status: 'skipped' }
            : item
        )
      )
    } catch (err) {
      const data = err?.response?.data
      setError(
        data?.message || data?.error || err?.message || 'Failed to update queue'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    setSelectedDate(today)
    loadQueue(today)
  }, [])

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h1 className="h4 text-success mb-0">Queue (manage)</h1>
        </div>

        {error ? <div className="alert alert-danger">{error}</div> : null}

        <div className="card mb-4">
          <div className="card-body">
            <label className="form-label small text-secondary">Date</label>
            <div className="input-group" style={{ maxWidth: 220 }}>
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(event) => {
                  const value = event.target.value
                  setSelectedDate(value)
                  loadQueue(value)
                }}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            {queue.length ? (
              <div className="table-responsive bg-white rounded-3 shadow-sm p-2">
                <table className="table table-borderless align-middle mb-0">
                  <thead>
                    <tr>
                      <th className="text-uppercase text-secondary small">Token</th>
                      <th className="text-uppercase text-secondary small">Patient</th>
                      <th className="text-uppercase text-secondary small">Phone</th>
                      <th className="text-uppercase text-secondary small">Time slot</th>
                      <th className="text-uppercase text-secondary small">Status</th>
                      <th className="text-uppercase text-secondary small">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queue.map((item, index) => (
                      <tr key={item.id || item._id || index} className="border-top">
                        <td>{item.tokenNumber || item.queueEntry?.tokenNumber || '-'}</td>
                        <td>
                          {item.patientName ||
                            item.patient ||
                            item.appointment?.patient?.name ||
                            '-'}
                        </td>
                        <td>
                          {item.phone ||
                            item.patientPhone ||
                            item.appointment?.patient?.phone ||
                            '-'}
                        </td>
                        <td>
                          {item.timeSlot ||
                            item.time ||
                            item.appointment?.timeSlot ||
                            '-'}
                        </td>
                        <td>
                          <span className="badge text-bg-warning text-uppercase">
                            {item.status || item.queueEntry?.status || 'waiting'}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            {(item.status || item.queueEntry?.status) ===
                            'waiting' ? (
                              <>
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() =>
                                    handleMarkInProgress(item.id || item._id)
                                  }
                                  disabled={loading}
                                >
                                  In progress
                                </button>
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() => handleSkip(item.id || item._id)}
                                  disabled={loading}
                                >
                                  Skip
                                </button>
                              </>
                            ) : (
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                disabled
                              >
                                Done
                              </button>
                            )}
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
