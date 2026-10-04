import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Html5Qrcode } from "html5-qrcode";

function Admin() {
    const [loggedIn, setLoggedIn] = useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);

    const [scanning, setScanning] = useState(false);
    const [scanError, setScanError] = useState("");

    const [registration, setRegistration] = useState(null);
    const [entryVerified, setEntryVerified] = useState(false);
    const [alreadyEntered, setAlreadyEntered] = useState(false);

    // =========================
    // TODAY'S ATTENDANCE
    // =========================
const API_URL = import.meta.env.VITE_API_URL;
    const [attendance, setAttendance] = useState(null);
    const [attendanceLoading, setAttendanceLoading] = useState(false);
    const [attendanceError, setAttendanceError] = useState("");

    // =========================
    // ATTENDANCE HISTORY
    // =========================

    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState("");

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDateData, setSelectedDateData] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const scannerRef = useRef(null);


    // =========================
    // CHECK ADMIN LOGIN
    // =========================

    useEffect(() => {
        const token = localStorage.getItem("adminToken");

        if (token) {
            setLoggedIn(true);
        }
    }, []);


    // =========================
    // FETCH TODAY'S ATTENDANCE
    // =========================

    const fetchAttendance = async () => {
        setAttendanceLoading(true);
        setAttendanceError("");

        try {
            const response = await axios.get(
                `${API_URL}/api/admin/attendance`
            );

            if (response.data.success) {
                setAttendance(response.data.data);
            }

        } catch (error) {
            console.error(
                "Attendance fetch error:",
                error
            );

            setAttendanceError(
                error.response?.data?.message ||
                "Unable to load attendance"
            );

        } finally {
            setAttendanceLoading(false);
        }
    };


    // =========================
    // FETCH ATTENDANCE HISTORY
    // =========================

    const fetchHistory = async () => {
        setHistoryLoading(true);
        setHistoryError("");

        try {
            const response = await axios.get(
                `${API_URL}/api/admin/attendance/history`
            );

            if (response.data.success) {
                setHistory(response.data.data);
            }

        } catch (error) {
            console.error(
                "History fetch error:",
                error
            );

            setHistoryError(
                error.response?.data?.message ||
                "Unable to load attendance history"
            );

        } finally {
            setHistoryLoading(false);
        }
    };


    // =========================
    // LOAD ATTENDANCE AFTER LOGIN
    // =========================

    useEffect(() => {
        if (loggedIn) {
            fetchAttendance();
            fetchHistory();
        }
    }, [loggedIn]);


    // =========================
    // LOGIN
    // =========================

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoginError("");
        setLoginLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/api/admin/login`,
                {
                    username,
                    password
                }
            );

            if (response.data.success) {
                localStorage.setItem(
                    "adminToken",
                    response.data.token
                );

                setLoggedIn(true);

            } else {
                setLoginError(
                    response.data.message ||
                    "Login failed"
                );
            }

        } catch (error) {
            console.error("Login error:", error);

            setLoginError(
                error.response?.data?.message ||
                "Unable to login"
            );

        } finally {
            setLoginLoading(false);
        }
    };


    // =========================
    // VIEW HISTORY DETAILS
    // =========================

    const viewHistoryDetails = async (date) => {
        setSelectedDate(date);
        setSelectedDateData(null);
        setDetailsLoading(true);

        try {
            const response = await axios.get(
                `${API_URL}/api/admin/attendance/history/${date}`
            );

            if (response.data.success) {
                setSelectedDateData(
                    response.data.data
                );
            }

        } catch (error) {
            console.error(
                "History details error:",
                error
            );

            setHistoryError(
                error.response?.data?.message ||
                "Unable to load details"
            );

        } finally {
            setDetailsLoading(false);
        }
    };


    // =========================
    // CLOSE HISTORY DETAILS
    // =========================

    const closeHistoryDetails = () => {
        setSelectedDate(null);
        setSelectedDateData(null);
    };


    // =========================
    // START QR SCANNER
    // =========================

    const startScanner = async () => {
        setScanError("");
        setRegistration(null);
        setEntryVerified(false);
        setAlreadyEntered(false);
        setScanning(true);

        setTimeout(async () => {
            try {
                const scanner = new Html5Qrcode(
                    "qr-reader"
                );

                scannerRef.current = scanner;

                await scanner.start(
                    {
                        facingMode: "environment"
                    },
                    {
                        fps: 10,
                        qrbox: {
                            width: 250,
                            height: 250
                        }
                    },
                    async (decodedText) => {

                        console.log(
                            "QR Token:",
                            decodedText
                        );

                        try {
                            await scanner.stop();

                            scanner.clear();

                            scannerRef.current = null;

                            setScanning(false);

                            const response =
                                await axios.post(
                                    `${API_URL}/api/admin/scan`,
                                    {
                                        qrToken: decodedText
                                    }
                                );

                            if (
                                response.data.success
                            ) {
                                setRegistration(
                                    response.data.data
                                );

                                setEntryVerified(true);
                                setAlreadyEntered(false);

                                // Refresh both
                                // current and history
                                fetchAttendance();
                                fetchHistory();
                            }

                        } catch (error) {

                            console.error(
                                "QR scan error:",
                                error
                            );

                            if (
                                error.response?.data
                                    ?.alreadyEntered
                            ) {
                                setRegistration(
                                    error.response.data.data
                                );

                                setEntryVerified(false);
                                setAlreadyEntered(true);

                                return;
                            }

                            setScanError(
                                error.response?.data
                                    ?.message ||
                                "Invalid QR code"
                            );
                        }
                    },
                    () => {
                        // Ignore continuous scanner errors
                    }
                );

            } catch (error) {
                console.error(
                    "Scanner start error:",
                    error
                );

                setScanning(false);

                setScanError(
                    "Unable to start camera. Please allow camera permission."
                );
            }
        }, 100);
    };


    // =========================
    // STOP SCANNER
    // =========================

    const stopScanner = async () => {
        try {
            if (scannerRef.current) {
                await scannerRef.current.stop();

                scannerRef.current.clear();

                scannerRef.current = null;
            }
        } catch (error) {
            console.error(
                "Scanner stop error:",
                error
            );
        }

        setScanning(false);
    };


    // =========================
    // SCAN ANOTHER
    // =========================

    const scanAnother = async () => {
        await stopScanner();

        setRegistration(null);
        setEntryVerified(false);
        setAlreadyEntered(false);
        setScanError("");

        startScanner();
    };


    // =========================
    // LOGOUT
    // =========================

    const handleLogout = async () => {
        await stopScanner();

        localStorage.removeItem("adminToken");

        setLoggedIn(false);
        setRegistration(null);
        setEntryVerified(false);
        setAlreadyEntered(false);
        setAttendance(null);
        setHistory([]);
        setSelectedDate(null);
        setSelectedDateData(null);
    };


    // =========================
    // LOGIN SCREEN
    // =========================

    if (!loggedIn) {
        return (
            <main className="admin-page">

                <div className="admin-login-card">

                    <p className="section-label">
                        ✦ ADMIN PORTAL ✦
                    </p>

                    <h1>
                        Sadgi Garba
                        <span>Entry Management</span>
                    </h1>

                    <p className="admin-login-description">
                        Login to manage Garba event entries.
                    </p>

                    <form
                        className="admin-login-form"
                        onSubmit={handleLogin}
                    >

                        <div className="form-group">
                            <label>
                                Username
                            </label>

                            <input
                                type="text"
                                value={username}
                                onChange={(e) =>
                                    setUsername(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter username"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter password"
                            />
                        </div>

                        {loginError && (
                            <div className="admin-error">
                                {loginError}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="admin-login-button"
                            disabled={loginLoading}
                        >
                            {loginLoading
                                ? "LOGGING IN..."
                                : "LOGIN"}
                        </button>

                    </form>

                </div>

            </main>
        );
    }


    // =========================
    // ADMIN DASHBOARD
    // =========================

    return (
        <main className="admin-dashboard">

            {/* HEADER */}

            <div className="admin-dashboard-header">

                <div>
                    <p className="section-label">
                        ✦ SADGI GARBA ✦
                    </p>

                    <h1>
                        Entry Management
                    </h1>
                </div>

                <button
                    className="admin-logout-button"
                    onClick={handleLogout}
                >
                    LOGOUT
                </button>

            </div>


            {/* =========================
                TODAY'S ATTENDANCE
            ========================= */}

            <section className="attendance-dashboard">

                <div className="attendance-header">

                    <div>
                        <p className="section-label">
                            ✦ LIVE ATTENDANCE ✦
                        </p>

                        <h2>
                            Today's Attendance
                        </h2>

                        {attendance && (
                            <p>
                                Garba Day:{" "}
                                {attendance.entryDate}
                            </p>
                        )}
                    </div>

                    <button
                        className="attendance-refresh-button"
                        onClick={() => {
                            fetchAttendance();
                            fetchHistory();
                        }}
                        disabled={attendanceLoading}
                    >
                        {attendanceLoading
                            ? "REFRESHING..."
                            : "↻ REFRESH"}
                    </button>

                </div>


                {attendanceError && (
                    <div className="admin-error">
                        {attendanceError}
                    </div>
                )}


                <div className="attendance-stats">

                    <div className="attendance-stat-card">

                        <span className="attendance-stat-icon">
                            👥
                        </span>

                        <div>
                            <p>
                                PEOPLE ENTERED
                            </p>

                            <h3>
                                {attendance
                                    ? attendance.totalPeople
                                    : 0}
                            </h3>
                        </div>

                    </div>


                    <div className="attendance-stat-card">

                        <span className="attendance-stat-icon">
                            🎟️
                        </span>

                        <div>
                            <p>
                                QR ENTRIES
                            </p>

                            <h3>
                                {attendance
                                    ? attendance.totalRegistrations
                                    : 0}
                            </h3>
                        </div>

                    </div>

                </div>


                {/* TODAY'S ENTRIES */}

                <div className="attendance-table-card">

                    <div className="attendance-table-header">

                        <div>
                            <h3>
                                Today's Entries
                            </h3>

                            <p>
                                Every successful QR entry
                                is recorded here.
                            </p>
                        </div>

                    </div>


                    {attendance?.entries?.length > 0 ? (

                        <div className="attendance-table-wrapper">

                            <table className="attendance-table">

                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>People</th>
                                        <th>Entry Time</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {attendance.entries.map(
                                        (entry, index) => (

                                            <tr
                                                key={entry.id}
                                            >

                                                <td>
                                                    {index + 1}
                                                </td>

                                                <td>
                                                    <strong>
                                                        {entry.name}
                                                    </strong>
                                                </td>

                                                <td>
                                                    {entry.phone}
                                                </td>

                                                <td>
                                                    <span className="people-count-badge">
                                                        {entry.attendeeCount}
                                                    </span>
                                                </td>

                                                <td>
                                                    {entry.enteredAt
                                                        ? new Date(
                                                            entry.enteredAt
                                                        ).toLocaleTimeString(
                                                            "en-IN",
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                hour12: true
                                                            }
                                                        )
                                                        : "-"}
                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    ) : (

                        <div className="no-attendance">

                            <div>✦</div>

                            <h3>
                                No Entries Yet
                            </h3>

                            <p>
                                Successful QR scans will
                                appear here.
                            </p>

                        </div>

                    )}

                </div>

            </section>


            {/* =========================
                ATTENDANCE HISTORY
            ========================= */}

            <section className="attendance-history-section">

                <div className="history-heading">

                    <div>
                        <p className="section-label">
                            ✦ EVENT RECORDS ✦
                        </p>

                        <h2>
                            Attendance History
                        </h2>

                        <p>
                            View attendance from every
                            Garba day.
                        </p>
                    </div>

                    <button
                        className="attendance-refresh-button"
                        onClick={fetchHistory}
                        disabled={historyLoading}
                    >
                        {historyLoading
                            ? "LOADING..."
                            : "↻ REFRESH"}
                    </button>

                </div>


                {historyError && (
                    <div className="admin-error">
                        {historyError}
                    </div>
                )}


                {history.length > 0 ? (

                    <div className="history-grid">

                        {history.map((day) => (

                            <div
                                className="history-card"
                                key={day.entryDate}
                            >

                                <div className="history-card-top">

                                    <div className="history-date-icon">
                                        📅
                                    </div>

                                    <div>
                                        <p>
                                            GARBА DAY
                                        </p>

                                        <h3>
                                            {new Date(
                                                `${day.entryDate}T00:00:00`
                                            ).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric"
                                                }
                                            )}
                                        </h3>
                                    </div>

                                </div>


                                <div className="history-card-stats">

                                    <div>
                                        <span>
                                            QR ENTRIES
                                        </span>

                                        <strong>
                                            {day.totalEntries}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            PEOPLE
                                        </span>

                                        <strong>
                                            {day.totalPeople}
                                        </strong>
                                    </div>

                                </div>


                                <button
                                    className="history-details-button"
                                    onClick={() =>
                                        viewHistoryDetails(
                                            day.entryDate
                                        )
                                    }
                                >
                                    VIEW DETAILS
                                    <span>→</span>
                                </button>

                            </div>

                        ))}

                    </div>

                ) : (

                    !historyLoading && (
                        <div className="no-attendance">
                            <div>✦</div>

                            <h3>
                                No Attendance History
                            </h3>

                            <p>
                                Attendance records will
                                appear here after entries.
                            </p>
                        </div>
                    )

                )}

            </section>


            {/* =========================
                HISTORY DETAILS
            ========================= */}

            {selectedDate && (
                <section className="history-details-section">

                    <div className="history-details-header">

                        <div>
                            <p className="section-label">
                                ✦ DAY DETAILS ✦
                            </p>

                            <h2>
                                {new Date(
                                    `${selectedDate}T00:00:00`
                                ).toLocaleDateString(
                                    "en-IN",
                                    {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric"
                                    }
                                )}
                            </h2>
                        </div>

                        <button
                            className="history-close-button"
                            onClick={closeHistoryDetails}
                        >
                            CLOSE
                        </button>

                    </div>


                    {detailsLoading ? (

                        <div className="no-attendance">
                            <div>✦</div>
                            <h3>
                                Loading Details...
                            </h3>
                        </div>

                    ) : selectedDateData ? (

                        <>
                            <div className="attendance-stats">

                                <div className="attendance-stat-card">

                                    <span className="attendance-stat-icon">
                                        👥
                                    </span>

                                    <div>
                                        <p>
                                            PEOPLE ENTERED
                                        </p>

                                        <h3>
                                            {selectedDateData.totalPeople}
                                        </h3>
                                    </div>

                                </div>


                                <div className="attendance-stat-card">

                                    <span className="attendance-stat-icon">
                                        🎟️
                                    </span>

                                    <div>
                                        <p>
                                            QR ENTRIES
                                        </p>

                                        <h3>
                                            {selectedDateData.totalEntries}
                                        </h3>
                                    </div>

                                </div>

                            </div>


                            <div className="attendance-table-card">

                                <div className="attendance-table-header">

                                    <h3>
                                        Entries For This Day
                                    </h3>

                                    <p>
                                        Complete entry record for
                                        this Garba day.
                                    </p>

                                </div>


                                {selectedDateData.entries.length > 0 ? (

                                    <div className="attendance-table-wrapper">

                                        <table className="attendance-table">

                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Name</th>
                                                    <th>Phone</th>
                                                    <th>People</th>
                                                    <th>Entry Time</th>
                                                </tr>
                                            </thead>

                                            <tbody>

                                                {selectedDateData.entries.map(
                                                    (entry, index) => (

                                                        <tr
                                                            key={entry.id}
                                                        >

                                                            <td>
                                                                {index + 1}
                                                            </td>

                                                            <td>
                                                                <strong>
                                                                    {entry.name}
                                                                </strong>
                                                            </td>

                                                            <td>
                                                                {entry.phone}
                                                            </td>

                                                            <td>
                                                                <span className="people-count-badge">
                                                                    {entry.attendeeCount}
                                                                </span>
                                                            </td>

                                                            <td>
                                                                {entry.enteredAt
                                                                    ? new Date(
                                                                        entry.enteredAt
                                                                    ).toLocaleTimeString(
                                                                        "en-IN",
                                                                        {
                                                                            hour: "2-digit",
                                                                            minute: "2-digit",
                                                                            hour12: true
                                                                        }
                                                                    )
                                                                    : "-"}
                                                            </td>

                                                        </tr>

                                                    )
                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                ) : (

                                    <div className="no-attendance">

                                        <div>✦</div>

                                        <h3>
                                            No Entries
                                        </h3>

                                    </div>

                                )}

                            </div>

                        </>

                    ) : null}

                </section>
            )}


            {/* =========================
                SCANNER
            ========================= */}

            {!registration && (
                <section className="scanner-card">

                    <div className="scanner-heading">

                        <h2>
                            Scan Entry QR
                        </h2>

                        <p>
                            Scan the QR code shown by
                            the registered visitor.
                        </p>

                    </div>


                    <div
                        id="qr-reader"
                        className="qr-reader"
                    ></div>


                    {!scanning && (
                        <button
                            className="start-scanner-button"
                            onClick={startScanner}
                        >
                            START QR SCANNER
                            <span>→</span>
                        </button>
                    )}


                    {scanning && (
                        <button
                            className="stop-scanner-button"
                            onClick={stopScanner}
                        >
                            STOP SCANNER
                        </button>
                    )}


                    {scanError && (
                        <div className="admin-error">
                            {scanError}
                        </div>
                    )}

                </section>
            )}


            {/* =========================
                REGISTRATION DETAILS
            ========================= */}

            {registration && (
                <section className="registration-details-card">

                    <div className="registration-details-header">

                        <div>
                            <p className="section-label">
                                ✦ REGISTRATION FOUND ✦
                            </p>

                            <h2>
                                {registration.user.name}
                            </h2>
                        </div>

                    </div>


                    <div className="detail-grid">

                        <div className="detail-item">
                            <span>Name</span>
                            <strong>
                                {registration.user.name}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Age</span>
                            <strong>
                                {registration.user.age}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Gender</span>
                            <strong>
                                {registration.user.gender}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Mobile</span>
                            <strong>
                                {registration.user.phone}
                            </strong>
                        </div>

                    </div>


                    <div className="scan-attendee-count">

                        <span>
                            TOTAL PEOPLE IN THIS REGISTRATION
                        </span>

                        <strong>
                            {registration.attendeeCount ||
                                (
                                    1 +
                                    (
                                        registration.familyMembers
                                            ?.length || 0
                                    )
                                )}
                        </strong>

                    </div>


                    <div className="family-details">

                        <h3>
                            Family Members
                        </h3>

                        {registration.familyMembers?.length === 0 ? (

                            <p className="no-family">
                                No family members registered.
                            </p>

                        ) : (

                            registration.familyMembers.map(
                                (member, index) => (

                                    <div
                                        className="family-detail-row"
                                        key={member.id || index}
                                    >

                                        <div className="family-number">
                                            {index + 1}
                                        </div>

                                        <div>
                                            <span>Name</span>
                                            <strong>
                                                {member.name}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Age</span>
                                            <strong>
                                                {member.age}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Gender</span>
                                            <strong>
                                                {member.gender}
                                            </strong>
                                        </div>

                                    </div>
                                )
                            )

                        )}

                    </div>


                    {entryVerified && (
                        <div className="entry-success">

                            <div className="entry-success-icon">
                                ✓
                            </div>

                            <div>
                                <h3>
                                    ENTRY ALLOWED
                                </h3>

                                <p>
                                    This QR code has been
                                    successfully verified.
                                </p>

                                <span>
                                    Entry Date:{" "}
                                    {registration.entryDate}
                                </span>

                            </div>

                        </div>
                    )}


                    {alreadyEntered && (
                        <div className="entry-already">

                            <div className="entry-already-icon">
                                !
                            </div>

                            <div>
                                <h3>
                                    ALREADY ENTERED TODAY
                                </h3>

                                <p>
                                    This QR code has already
                                    been used for entry today.
                                </p>

                                <span>
                                    Entry Date:{" "}
                                    {registration.entryDate}
                                </span>

                                {registration.enteredAt && (
                                    <span>
                                        Previous Entry:{" "}
                                        {new Date(
                                            registration.enteredAt
                                        ).toLocaleTimeString(
                                            "en-IN",
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true
                                            }
                                        )}
                                    </span>
                                )}

                            </div>

                        </div>
                    )}


                    <div className="admin-actions">

                        <button
                            className="scan-another-button"
                            onClick={scanAnother}
                        >
                            SCAN ANOTHER QR
                            <span>→</span>
                        </button>

                    </div>

                </section>
            )}

        </main>
    );
}

export default Admin;