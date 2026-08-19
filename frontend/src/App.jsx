import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('Scheduled')

  const [sender, setSender] = useState('')
  const [recipient, setRecipient] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')

  const [scheduledEmails, setScheduledEmails] = useState([])
  const [sentEmails, setSentEmails] = useState([])

  const userId = '37261c7b-2bcb-4f9e-bddc-e89bf90528af'
  const senderId = 'f118cd9c-76e9-4154-9e3a-93a0dead8fea'

  // Fetch scheduled emails
  const fetchScheduledEmails = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/emails/scheduled?userId=${userId}`
      )

      const data = await response.json()

      if (!response.ok) {
        console.error(data.message)
        return
      }

      setScheduledEmails(data)
    } catch (error) {
      console.error('Failed to fetch scheduled emails:', error)
    }
  }

  // Fetch sent emails
  const fetchSentEmails = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/emails/sent?userId=${userId}`
      )

      const data = await response.json()

      if (!response.ok) {
        console.error(data.message)
        return
      }

      setSentEmails(data)
    } catch (error) {
      console.error('Failed to fetch sent emails:', error)
    }
  }

  // Fetch emails when user logs in or changes tab
  useEffect(() => {
    if (!loggedIn) return

    if (activeTab === 'Scheduled') {
      fetchScheduledEmails()
    }

    if (activeTab === 'Sent') {
      fetchSentEmails()
    }
  }, [loggedIn, activeTab])

  // Schedule email
  const handleScheduleEmail = async () => {
    if (!sender || !recipient || !subject || !body || !scheduledAt) {
      alert('Please fill in all fields')
      return
    }

    try {
      const response = await fetch(
        'http://localhost:5001/api/emails/schedule',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            senderId,
            recipient,
            subject,
            body,
            scheduledAt,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Failed to schedule email')
        return
      }

      alert('Email scheduled successfully!')

      setSender('')
      setRecipient('')
      setSubject('')
      setBody('')
      setScheduledAt('')

      await fetchScheduledEmails()

      setActiveTab('Scheduled')
    } catch (error) {
      console.error(error)
      alert('Could not connect to the backend')
    }
  }

  // Login screen
  if (!loggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>Login</h1>

          <button className="google-button">
            <span>G</span>
            Login with Google
          </button>

          <div className="divider">
            <span>or login with email</span>
          </div>

          <input
            type="email"
            placeholder="Email ID"
          />

          <input
            type="password"
            placeholder="Password"
          />

          <button
            className="login-button"
            onClick={() => setLoggedIn(true)}
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2>ONE</h2>

        <div className="user-box">
          <div className="avatar">A</div>

          <div>
            <strong>Admin</strong>
            <p>admin@example.com</p>
          </div>
        </div>

        <nav>
          <button
            className={activeTab === 'Scheduled' ? 'active' : ''}
            onClick={() => setActiveTab('Scheduled')}
          >
            📅 Scheduled
          </button>

          <button
            className={activeTab === 'Sent' ? 'active' : ''}
            onClick={() => setActiveTab('Sent')}
          >
            ✉️ Sent
          </button>
        </nav>

        <button
          className="logout-button"
          onClick={() => setLoggedIn(false)}
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">

        {/* Compose Screen */}
        {activeTab === 'Compose' ? (
          <>
            <header className="top-header">
              <div>
                <h1>Compose New Email</h1>
                <p>Create and schedule an email</p>
              </div>

              <button
                className="cancel-button"
                onClick={() => setActiveTab('Scheduled')}
              >
                Cancel
              </button>
            </header>

            <section className="compose-section">
              <div className="compose-form">

                <label>Sender</label>
                <input
                  type="email"
                  placeholder="sender@example.com"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                />

                <label>Recipient</label>
                <input
                  type="email"
                  placeholder="recipient@example.com"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />

                <label>Subject</label>
                <input
                  type="text"
                  placeholder="Enter subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />

                <label>Email Body</label>
                <textarea
                  placeholder="Write your email..."
                  rows="8"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />

                <label>Schedule Date & Time</label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                />

                <button
                  className="schedule-button"
                  onClick={handleScheduleEmail}
                >
                  Schedule Email
                </button>

              </div>
            </section>
          </>
        ) : (
          <>
            {/* Dashboard Header */}
            <header className="top-header">
              <div>
                <h1>{activeTab} Emails</h1>
                <p>Manage your emails</p>
              </div>

              <button
                className="compose-button"
                onClick={() => setActiveTab('Compose')}
              >
                + Compose New Email
              </button>
            </header>

            {/* Email List */}
            <section className="email-section">

              {/* SCHEDULED EMAILS */}
              {activeTab === 'Scheduled' && (
                <>
                  <div className="section-header">
                    <h2>Scheduled Emails</h2>

                    <span>
                      {scheduledEmails.length} emails
                    </span>
                  </div>

                  {scheduledEmails.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📭</div>

                      <h3>No scheduled emails</h3>

                      <p>
                        Your scheduled emails will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="email-list">

                      {scheduledEmails.map((email) => (
                        <div
                          className="email-card"
                          key={email.id}
                        >

                          <div className="email-card-header">
                            <strong>
                              {email.subject}
                            </strong>

                            <span>
                              {email.status}
                            </span>
                          </div>

                          <p>
                            <strong>To:</strong>{' '}
                            {email.recipient}
                          </p>

                          <p>
                            <strong>From:</strong>{' '}
                            {email.senderId}
                          </p>

                          <p>
                            <strong>Scheduled:</strong>{' '}
                            {new Date(
                              email.scheduledAt
                            ).toLocaleString()}
                          </p>

                          <p className="email-body">
                            {email.body}
                          </p>

                        </div>
                      ))}

                    </div>
                  )}
                </>
              )}

              {/* SENT EMAILS */}
              {activeTab === 'Sent' && (
                <>
                  <div className="section-header">
                    <h2>Sent Emails</h2>

                    <span>
                      {sentEmails.length} emails
                    </span>
                  </div>

                  {sentEmails.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📨</div>

                      <h3>No sent emails</h3>

                      <p>
                        Your sent emails will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="email-list">

                      {sentEmails.map((email) => (
                        <div
                          className="email-card"
                          key={email.id}
                        >

                          <div className="email-card-header">
                            <strong>
                              {email.subject}
                            </strong>

                            <span>
                              {email.status}
                            </span>
                          </div>

                          <p>
                            <strong>To:</strong>{' '}
                            {email.recipient}
                          </p>

                          <p>
                            <strong>From:</strong>{' '}
                            {email.senderId}
                          </p>

                          <p>
                            <strong>Sent:</strong>{' '}
                            {email.sentAt
                              ? new Date(
                                  email.sentAt
                                ).toLocaleString()
                              : 'N/A'}
                          </p>

                          <p className="email-body">
                            {email.body}
                          </p>

                        </div>
                      ))}

                    </div>
                  )}
                </>
              )}

            </section>
          </>
        )}

      </main>
    </div>
  )
}

export default App