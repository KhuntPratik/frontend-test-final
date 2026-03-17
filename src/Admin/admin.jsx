import { useState } from 'react'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

export default function AdminHome() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'doctor',
  })

  const authHeaders = () => {
    const token = localStorage.getItem('auth_token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const handleFetchUsers = async () => {
    setError('')
    setLoading(true)
    try {
      const response = await axios.get(`${BASE_URL}/admin/users`, {
        headers: authHeaders(),
      })
      setUsers(response.data?.users || response.data || [])
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Faild users')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      }
      const response = await axios.post(`${BASE_URL}/admin/users`, payload, {
        headers: authHeaders(),
      })
      const created = response.data?.user || response.data
      setUsers((prev) => (created ? [created, ...prev] : prev))
      setForm({ name: '', email: '', password: '', role: 'doctor' })
    } catch (err) {
      const status = err?.response?.status
      const data = err?.response?.data
      const message =
        data?.message ||
        data?.error ||
        (typeof data === 'string' ? data : '') ||
        err?.message ||
        'Falid create user'
      setError(
        status ? `Error ${status}: ${message}` : message
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h1 className="h3 mb-0">Admin Dashboard</h1>
          <span className="badge text-bg-secondary">Admin</span>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <button
              className="btn btn-outline-primary"
              onClick={handleFetchUsers}
              disabled={loading}
            >
              List users
            </button>
          </div>
        </div>

        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : null}

        <div className="row g-4">
          <div className="col-12 col-lg-5">
            <div className="card h-100">
              <div className="card-body">
                <h2 className="h6">Create user</h2>
                <form onSubmit={handleCreateUser}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      className="form-control"
                      value={form.name}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, name: event.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={form.email}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, email: event.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={form.password}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, password: event.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      value={form.role}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, role: event.target.value }))
                      }
                    >
                      <option value="doctor">Doctor</option>
                      <option value="receptionist">Receptionist</option>
                      <option value="patient">Patient</option>
                    </select>
                  </div>
                  <button className="btn btn-success w-100" disabled={loading}>
                    Create user
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-7">
            <div className="card">
              <div className="card-body">
                <h2 className="h6">Users</h2>
                {users.length ? (
                  <div className="table-responsive">
                    <table className="table table-sm align-middle">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, index) => (
                          <tr key={user.id || user._id || index}>
                            <td>{user.name || user.fullName || '-'}</td>
                            <td>{user.email || '-'}</td>
                            <td className="text-capitalize">{user.role || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-secondary mb-0">user not fetch.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
