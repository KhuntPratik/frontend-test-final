import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL
const LOGIN_URL = `${BASE_URL}/auth/login`

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      const res = await axios.post(LOGIN_URL, { email, password })
      const token = res?.data?.token || res?.data?.accessToken
      const role = res?.data?.user?.role || res?.data?.role

      if (token) {
        localStorage.setItem('token', token)
        localStorage.setItem('auth_token', token)
      }

      if (role) {
        localStorage.setItem('role', role)
      }

      if (role === 'admin') navigate('/adminhome')
      if (role === 'doctor') navigate('/doctorhome')
      if (role === 'patient') navigate('/patienthome')
      if (role === 'receptionist') navigate('/receptionisthome')
    } catch (err) {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                  </div>

                  {error ? (
                    <div className="alert alert-danger py-2" role="alert">
                      {error}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    className="btn btn-success w-100"
                    
                  >Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
