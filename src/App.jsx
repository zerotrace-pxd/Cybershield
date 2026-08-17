import { useState } from "react"

function App() {
  const [target, setTarget] = useState("")
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [scanComplete, setScanComplete] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [error, setError] = useState("")
  const [activePanel, setActivePanel] = useState(null)
  const [darkMode, setDarkMode] = useState(true)

  const startScan = async () => {
    if (!target.trim()) {
      setError("Please enter an IP address or hostname.")
      return
    }

    setScanning(true)
    setScanComplete(false)
    setProgress(10)
    setError("")
    setScanResult(null)

    try {
      setProgress(30)

      const response = await fetch(
        `http://127.0.0.1:8000/scan?target=${encodeURIComponent(
          target.trim()
        )}`
      )

      setProgress(70)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "Scan failed.")
      }

      setProgress(100)
      setScanResult(data)

      setTimeout(() => {
        setScanning(false)
        setScanComplete(true)
      }, 700)

    } catch (err) {
      setScanning(false)
      setProgress(0)
      setError(err.message)
    }
  }

  const startNewScan = () => {
    setTarget("")
    setScanning(false)
    setScanComplete(false)
    setProgress(0)
    setScanResult(null)
    setError("")
  }

  const openPanel = (panel) => {
    setActivePanel(panel)
  }

  const closePanel = () => {
    setActivePanel(null)
  }

  const goHome = () => {
    setActivePanel(null)
    setScanning(false)
    setScanComplete(false)
    setProgress(0)
    setScanResult(null)
    setError("")
  }

  const openPorts = scanResult
    ? (scanResult.output.match(/\/tcp\s+open/g) || []).length
    : 0

  return (
    <div className={darkMode ? "app dark" : "app light"}>

      <div className="grid-background"></div>

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <button
          className="logo-button"
          onClick={goHome}
          title="Go to Home"
        >
          <span className="logo-shield">🛡️</span>
          <span>CyberShield</span>
        </button>

        <div className="nav-links">

          <button onClick={() => openPanel("how")}>
            How It Works
          </button>

          <button onClick={() => openPanel("help")}>
            Help
          </button>

          <button onClick={() => openPanel("about")}>
            About
          </button>

          <button
            className="theme-button"
            onClick={() => setDarkMode(!darkMode)}
            title={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

        </div>

      </nav>


      {/* ================= HOME ================= */}

      {!scanning && !scanComplete && !activePanel && (

        <main className="home-screen">

          <div className="hero-content">

            <div className="status">
              <span className="status-dot"></span>
              AUTOMATED SECURITY ASSESSMENT
            </div>

            <h1>
              Find the weaknesses
              <br />
              <span>before attackers do.</span>
            </h1>

            <p className="hero-description">
              CyberShield helps you discover exposed services,
              understand potential security risks, and get
              practical recommendations to protect your system.
            </p>

            {/* TARGET INPUT */}

            <div className="scan-box">

              <div className="input-wrapper">

                <span className="input-icon">⌖</span>

                <input
                  type="text"
                  placeholder="Enter IP address or hostname"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      startScan()
                    }
                  }}
                />

              </div>

              <button
                className="scan-button"
                onClick={startScan}
              >
                <span>🔍</span>
                Start Security Scan
                <span>→</span>
              </button>

            </div>

            {error && (
              <div className="error-message">
                ⚠️ {error}
              </div>
            )}

            <div className="authorization-notice">
              🔒 Only scan systems you own or have permission to assess.
            </div>

          </div>


          {/* QUICK FEATURES */}

          <div className="quick-features">

            <div className="quick-feature">

              <div className="feature-icon">
                ◉
              </div>

              <div>
                <strong>Discover</strong>
                <span>Find exposed services</span>
              </div>

            </div>


            <div className="quick-feature">

              <div className="feature-icon">
                ◇
              </div>

              <div>
                <strong>Analyze</strong>
                <span>Understand security risks</span>
              </div>

            </div>


            <div className="quick-feature">

              <div className="feature-icon">
                ✓
              </div>

              <div>
                <strong>Remediate</strong>
                <span>Get practical recommendations</span>
              </div>

            </div>


            <div className="quick-feature">

              <div className="feature-icon">
                ▣
              </div>

              <div>
                <strong>Report</strong>
                <span>Generate security reports</span>
              </div>

            </div>

          </div>


          <div className="home-tagline">
            Discover → Analyze → Explain → Fix
          </div>

        </main>
      )}


      {/* ================= SCANNING SCREEN ================= */}

      {scanning && (

        <main className="scan-screen">

          <div className="scan-animation-icon">
            🛡️
          </div>

          <div className="status">
            <span className="status-dot"></span>
            SECURITY SCAN IN PROGRESS
          </div>

          <h2>
            Analyzing your system
          </h2>

          <p className="scan-target">
            Target: <strong>{target}</strong>
          </p>


          <div className="progress-container">

            <div className="progress-header">
              <span>Security assessment</span>
              <span>{progress}%</span>
            </div>

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{
                  width: `${progress}%`
                }}
              ></div>

            </div>

          </div>


          <div className="scan-steps">

            <div className="scan-step completed">
              <span>✓</span>

              <div>
                <strong>Validating target</strong>
                <small>Checking target information</small>
              </div>
            </div>


            <div
              className={
                progress >= 30
                  ? "scan-step completed"
                  : "scan-step active"
              }
            >
              <span>
                {progress >= 30 ? "✓" : "◉"}
              </span>

              <div>
                <strong>Discovering open ports</strong>
                <small>
                  Identifying exposed network services
                </small>
              </div>
            </div>


            <div
              className={
                progress >= 70
                  ? "scan-step completed"
                  : "scan-step active"
              }
            >
              <span>
                {progress >= 70 ? "✓" : "◉"}
              </span>

              <div>
                <strong>Detecting services</strong>
                <small>
                  Analyzing running services
                </small>
              </div>
            </div>


            <div
              className={
                progress >= 100
                  ? "scan-step completed"
                  : "scan-step active"
              }
            >
              <span>
                {progress >= 100 ? "✓" : "◉"}
              </span>

              <div>
                <strong>Preparing results</strong>
                <small>
                  Processing scan information
                </small>
              </div>
            </div>

          </div>


          <p className="scan-warning">
            CyberShield is communicating with its security
            assessment backend.
          </p>

        </main>
      )}


      {/* ================= RESULTS ================= */}

      {scanComplete && scanResult && (

        <main className="results-screen">

          <div className="result-status">

            <div className="success-icon">
              ✓
            </div>

            <div>
              <span>
                SECURITY ASSESSMENT COMPLETE
              </span>

              <p>
                Analysis finished for{" "}
                <strong>{scanResult.target}</strong>
              </p>
            </div>

          </div>


          <div className="results-heading">

            <div>
              <h2>
                Security Assessment
              </h2>

              <p>
                Real Nmap service discovery results.
              </p>
            </div>


            <div className="security-score">

              <small>OPEN PORTS</small>

              <strong>{openPorts}</strong>

              <span>
                Detected
              </span>

            </div>

          </div>


          {/* EDUCATIONAL NOTICE */}

          <section className="info-notice">

            <div className="info-icon">
              ⓘ
            </div>

            <div>

              <strong>
                Open ports are not automatically vulnerabilities.
              </strong>

              <p>
                An open port usually means a service is available
                for network communication. Some open ports are
                necessary for legitimate software. CyberShield
                will consider the service, exposure, configuration,
                and known vulnerabilities before assigning risk.
              </p>

            </div>

          </section>


          {/* SCAN OUTPUT */}

          <section className="results-panel">

            <div className="section-label">
              DISCOVERY RESULTS
            </div>

            <h3>
              🔎 What did CyberShield discover?
            </h3>

            <p>
              CyberShield successfully contacted the target and
              performed Nmap service detection.
            </p>


            <pre className="nmap-output">
              {scanResult.output}
            </pre>

          </section>


          <div className="results-actions">

            <button
              className="new-scan-button"
              onClick={startNewScan}
            >
              ↻ Start New Scan
            </button>

          </div>


          <p className="demo-notice">
            Nmap results above are from the actual authorized
            scan. Advanced vulnerability analysis will be added
            in the next stage.
          </p>

        </main>
      )}


      {/* ================= MODAL OVERLAY ================= */}

      {activePanel && (

        <div
          className="modal-overlay"
          onClick={closePanel}
        >

          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={closePanel}
            >
              ×
            </button>


            {/* HOW IT WORKS */}

            {activePanel === "how" && (

              <>

                <div className="modal-label">
                  HOW IT WORKS
                </div>

                <h2>
                  How CyberShield works
                </h2>

                <p className="modal-intro">
                  CyberShield combines automated network
                  discovery with security analysis to make
                  technical findings easier to understand.
                </p>


                <div className="how-steps">

                  <div className="how-step">
                    <span>01</span>

                    <div>
                      <strong>Enter a target</strong>
                      <p>
                        Provide an IP address or hostname that
                        you own or are authorized to assess.
                      </p>
                    </div>
                  </div>


                  <div className="how-step">
                    <span>02</span>

                    <div>
                      <strong>Discover</strong>
                      <p>
                        CyberShield uses network discovery to
                        identify reachable services and ports.
                      </p>
                    </div>
                  </div>


                  <div className="how-step">
                    <span>03</span>

                    <div>
                      <strong>Analyze</strong>
                      <p>
                        Detected services can be examined for
                        security concerns and configuration risks.
                      </p>
                    </div>
                  </div>


                  <div className="how-step">
                    <span>04</span>

                    <div>
                      <strong>Explain</strong>
                      <p>
                        Technical findings are translated into
                        simple explanations.
                      </p>
                    </div>
                  </div>


                  <div className="how-step">
                    <span>05</span>

                    <div>
                      <strong>Remediate</strong>
                      <p>
                        CyberShield provides practical suggestions
                        for improving security.
                      </p>
                    </div>
                  </div>


                  <div className="how-step">
                    <span>06</span>

                    <div>
                      <strong>Report</strong>
                      <p>
                        A future report feature will summarize
                        findings and recommendations.
                      </p>
                    </div>
                  </div>

                </div>

              </>

            )}


            {/* HELP / FAQ */}

            {activePanel === "help" && (

              <>

                <div className="modal-label">
                  HELP CENTER
                </div>

                <h2>
                  Frequently Asked Questions
                </h2>

                <div className="faq-list">

                  <details>
                    <summary>
                      What is CyberShield?
                    </summary>

                    <p>
                      CyberShield is an automated security
                      assessment platform designed to help users
                      discover exposed services and understand
                      potential security weaknesses.
                    </p>
                  </details>


                  <details>
                    <summary>
                      What can I scan?
                    </summary>

                    <p>
                      You can scan systems that you own or have
                      explicit permission to assess. The current
                      version supports IP addresses and hostnames.
                    </p>
                  </details>


                  <details>
                    <summary>
                      What is an open port?
                    </summary>

                    <p>
                      An open port means that a network service
                      is reachable and accepting connections on
                      that port. An open port is not automatically
                      a vulnerability.
                    </p>
                  </details>


                  <details>
                    <summary>
                      What does listening mean?
                    </summary>

                    <p>
                      Listening means that a program is waiting
                      for incoming network connections on a
                      particular port.
                    </p>
                  </details>


                  <details>
                    <summary>
                      Is every open port dangerous?
                    </summary>

                    <p>
                      No. Many legitimate applications require
                      open ports. Security risk depends on the
                      service, exposure, configuration, software
                      version, authentication, and other factors.
                    </p>
                  </details>


                  <details>
                    <summary>
                      What should I do if CyberShield finds an issue?
                    </summary>

                    <p>
                      Don't panic. Read the explanation,
                      understand the potential impact, follow the
                      recommended remediation steps, and scan
                      again to verify the result.
                    </p>
                  </details>


                  <details>
                    <summary>
                      Can I scan someone else's website?
                    </summary>

                    <p>
                      Only when you own the system or have explicit
                      authorization to perform a security
                      assessment.
                    </p>
                  </details>


                  <details>
                    <summary>
                      Does a scan guarantee that my system is safe?
                    </summary>

                    <p>
                      No. Security scanning can identify certain
                      weaknesses, but no automated scan can
                      guarantee that a system is completely secure.
                    </p>
                  </details>

                </div>

              </>

            )}


            {/* ABOUT */}

            {activePanel === "about" && (

              <>

                <div className="modal-label">
                  ABOUT CYBERSHIELD
                </div>

                <h2>
                  Security made easier to understand.
                </h2>

                <p className="about-text">
                  CyberShield is a cybersecurity project focused
                  on automated security assessment and
                  beginner-friendly security reporting.
                </p>

                <div className="about-card">

                  <strong>
                    Our goal
                  </strong>

                  <p>
                    Instead of simply showing technical scan
                    results, CyberShield aims to explain what was
                    discovered, why it matters, how serious it
                    may be, and what the user can do to improve
                    their security.
                  </p>

                </div>


                <div className="about-card">

                  <strong>
                    Current technology
                  </strong>

                  <p>
                    React is used for the frontend, Python with
                    FastAPI provides the backend API, and Nmap
                    performs network and service discovery.
                  </p>

                </div>


                <div className="about-card">

                  <strong>
                    Important
                  </strong>

                  <p>
                    CyberShield should only be used to assess
                    systems for which the user has authorization.
                  </p>

                </div>

              </>

            )}

          </div>

        </div>

      )}

    </div>
  )
}

export default App