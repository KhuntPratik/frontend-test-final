import { useEffect, useState } from 'react'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

export default function MyReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const authHeaders = () => {
    const token =
      localStorage.getItem('auth_token') || localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const handleListReports = async () => {
    setError('')
    setLoading(true)
    try {
      const response = await axios.get(`${BASE_URL}/reports/my`, {
        headers: authHeaders(),
      })
      setReports(response.data?.reports || response.data || [])
    } catch (err) {
      const data = err?.response?.data
      setError(
        data?.message || data?.error || err?.message || 'Failed to load reports'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleListReports()
  }, [])

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h1 className="h4 mb-0">My Reports</h1>
        </div>

        {error ? <div className="alert alert-danger">{error}</div> : null}

        {reports.length ? (
          <div className="card">
            <div className="card-body">
              <pre className="bg-light p-3 rounded border mb-0">
                {JSON.stringify(reports, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <p className="text-secondary mb-0">No reports loaded yet.</p>
        )}
      </div>
    </div>
  )
}
