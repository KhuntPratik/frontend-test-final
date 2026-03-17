import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

const emptyMedicine = { name: '', dosage: '', duration: '' }

export default function AddPrescription() {
  const [searchParams] = useSearchParams()
  const [appointmentId, setAppointmentId] = useState('')
  const [medicines, setMedicines] = useState([{ ...emptyMedicine }])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const authHeaders = () => {
    const token =
      localStorage.getItem('auth_token') || localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const handleMedicineChange = (index, field, value) => {
    setMedicines((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      )
    )
  }

  const handleAddMedicine = () => {
    setMedicines((prev) => [...prev, { ...emptyMedicine }])
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const payload = {
        appointmentId,
        medicines,
        notes,
      }
      await axios.post(`${BASE_URL}/prescriptions/${appointmentId}`, payload, {
        headers: authHeaders(),
      })
      setSuccess('Prescription saved.')
      setAppointmentId('')
      setMedicines([{ ...emptyMedicine }])
      setNotes('')
    } catch (err) {
      const data = err?.response?.data
      setError(
        data?.message ||
          data?.error ||
          err?.message ||
          'Failed to save prescription'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const id = searchParams.get('appointmentId')
    if (id) {
      setAppointmentId(id)
    }
  }, [searchParams])

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-4">
        <h1 className="h4 mb-3">Add Prescription</h1>

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

              <h2 className="h6 mt-4">Medicines</h2>
              {medicines.map((medicine, index) => (
                <div className="row g-2 mb-2" key={`med-${index}`}>
                  <div className="col-12 col-md-4">
                    <input
                      className="form-control"
                      placeholder="e.g. Paracetamol"
                      value={medicine.name}
                      onChange={(event) =>
                        handleMedicineChange(index, 'name', event.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <input
                      className="form-control"
                      placeholder="e.g. 500mg"
                      value={medicine.dosage}
                      onChange={(event) =>
                        handleMedicineChange(index, 'dosage', event.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <input
                      className="form-control"
                      placeholder="e.g. 5 days"
                      value={medicine.duration}
                      onChange={(event) =>
                        handleMedicineChange(index, 'duration', event.target.value)
                      }
                      required
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm mb-3"
                onClick={handleAddMedicine}
              >
                + Add medicine
              </button>

              <div className="mb-3">
                <label className="form-label">Notes (optional)</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="e.g. After food"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </div>

              <button className="btn btn-success" disabled={loading}>
                {loading ? 'Saving...' : 'Save Prescription'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
