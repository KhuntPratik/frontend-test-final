const formatDate = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function AppointmentsDetails({ appointment, onBack }) {
  if (!appointment) return null

  const dateValue = appointment.appointmentDate || appointment.date
  const timeValue = appointment.timeSlot || appointment.time || '-'
  const tokenValue =
    appointment.queueEntry?.tokenNumber ||
    appointment.token ||
    appointment.tokenNumber ||
    '-'
  const statusValue =
    appointment.queueEntry?.status || appointment.status || 'waiting'

  return (
    <div className="row g-4">
      <div className="col-12">
        <button className="btn btn-outline-secondary btn-sm mb-3" onClick={onBack}>
          Back to appointments
        </button>
      </div>
      <div className="col-12">
        <div className="card mb-4">
          <div className="card-body">
            <h2 className="h6">Appointment</h2>
            <p className="mb-1">
              <strong>Date:</strong> {formatDate(dateValue)}{' '}
              <strong>Time:</strong> {timeValue}
            </p>
            <p className="mb-0">
              <strong>Token:</strong> {tokenValue} <strong>Status:</strong>{' '}
              <span className="badge text-bg-warning text-uppercase">
                {statusValue}
              </span>
            </p>
          </div>
        </div>
        <div className="card mb-4">
          <div className="card-body">
            <h2 className="h6">Medicines (Prescription)</h2>
            <p className="text-secondary mb-0">
              No prescription added for this appointment yet.
            </p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h2 className="h6">Medical Report</h2>
            <p className="text-secondary mb-0">
              No report added for this appointment yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
