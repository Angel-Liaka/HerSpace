
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";

import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "./firebase";
import { today, addDays, formatDate } from "./utils/dateHelpers";

import Field from "./components/Field";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import CycleTracker from "./components/CycleTracker";
import AcademicCalendar from "./components/AcademicCalendar";

import "./styles.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [page, setPage] = useState("Dashboard");

  const [cycles, setCycles] = useState([]);
  const [events, setEvents] = useState([]);

  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const [cycleDate, setCycleDate] = useState(today());
  const [cycleLength, setCycleLength] = useState("28");

  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState(today());
  const [eventType, setEventType] = useState("Assignment");

  // Check whether a user is signed in.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  // Load the signed-in user's cycle records and academic events.
  useEffect(() => {
    if (!user) {
      setCycles([]);
      setEvents([]);
      return;
    }

    const cycleQuery = query(
      collection(db, "cycles"),
      where("userId", "==", user.uid)
    );

    const eventQuery = query(
      collection(db, "academicEvents"),
      where("userId", "==", user.uid)
    );

    const stopCycles = onSnapshot(
      cycleQuery,
      (snapshot) => {
        setCycles(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      },
      () => setError("Could not load cycle records.")
    );

    const stopEvents = onSnapshot(
      eventQuery,
      (snapshot) => {
        setEvents(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      },
      () => setError("Could not load academic events.")
    );

    return () => {
      stopCycles();
      stopEvents();
    };
  }, [user]);

  // Sort cycle records from newest to oldest.
  const sortedCycles = [...cycles].sort((a, b) =>
    (b.startDate || "").localeCompare(a.startDate || "")
  );

  // Sort academic events from earliest to latest.
  const sortedEvents = [...events].sort((a, b) =>
    (a.date || "").localeCompare(b.date || "")
  );

  // Keep events happening today or in the future.
  const upcomingEvents = sortedEvents.filter(
    (event) => event.date >= today()
  );

  // Estimate the next period using the latest saved cycle.
  const nextPeriod = sortedCycles.length
    ? addDays(
        sortedCycles[0].startDate,
        Number(sortedCycles[0].cycleLength) || 28
      )
    : null;

  // Estimate a five-day period window.
  const estimatedPeriodEnd = nextPeriod
    ? addDays(nextPeriod, 4)
    : null;

  // Find academic events within the estimated period window.
  const overlapEvents = nextPeriod
    ? sortedEvents.filter(
        (event) =>
          event.date >= nextPeriod &&
          event.date <= estimatedPeriodEnd
      )
    : [];

  // Register a new user or sign in an existing user.
  async function handleAuth(event) {
    event.preventDefault();

    setError("");
    setNotice("");
    setBusy(true);

    try {
      if (isRegistering) {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        if (name.trim()) {
          await updateProfile(credential.user, {
            displayName: name.trim(),
          });
        }

        setNotice("Account created successfully!");
      } else {
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }

  // Sign out the current user.
  async function handleLogout() {
    try {
      await signOut(auth);
      setPage("Dashboard");
      setNotice("");
      setError("");
    } catch (error) {
      setError(error.message);
    }
  }

  // Save a new cycle record to Firestore.
  async function handleAddCycle(event) {
    event.preventDefault();

    setError("");
    setNotice("");

    const length = Number(cycleLength);

    if (!cycleDate || cycleDate > today()) {
      setError("Choose a valid period start date.");
      return;
    }

    if (!Number.isInteger(length) || length < 15 || length > 60) {
      setError("Cycle length must be between 15 and 60 days.");
      return;
    }

    setBusy(true);

    try {
      await addDoc(collection(db, "cycles"), {
        userId: user.uid,
        startDate: cycleDate,
        cycleLength: length,
        createdAt: serverTimestamp(),
      });

      setNotice("Cycle record saved!");
      setCycleDate(today());
      setCycleLength("28");
    } catch (error) {
      setError("Could not save cycle: " + error.message);
    } finally {
      setBusy(false);
    }
  }

  // Save a new academic event to Firestore.
  async function handleAddEvent(event) {
    event.preventDefault();

    setError("");
    setNotice("");

    if (!eventTitle.trim() || !eventDate) {
      setError("Enter an event title and date.");
      return;
    }

    if (eventDate < today()) {
      setError("Choose today or a future date.");
      return;
    }

    setBusy(true);

    try {
      await addDoc(collection(db, "academicEvents"), {
        userId: user.uid,
        title: eventTitle.trim(),
        date: eventDate,
        type: eventType,
        createdAt: serverTimestamp(),
      });

      setNotice("Academic event saved!");
      setEventTitle("");
      setEventDate(today());
      setEventType("Assignment");
    } catch (error) {
      setError("Could not save event: " + error.message);
    } finally {
      setBusy(false);
    }
  }

  // Show a loading screen until Firebase checks authentication.
  if (!authReady) {
    return (
      <main className="loading-screen">
        <Heart size={34} />
        <h2>Loading HerSpace...</h2>
      </main>
    );
  }

  // Show the authentication page when the user is signed out.
  if (!user) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <div className="brand auth-brand">
            <Heart size={28} />
            HerSpace
          </div>

          <p className="eyebrow">
            YOUR WELLNESS • YOUR STUDENT LIFE
          </p>

          <h1>
            {isRegistering ? "Create your space" : "Welcome back"}
          </h1>

          <p className="subtext">
            A calmer way to keep track of your cycle and academic life.
          </p>

          {error && <p className="message error">{error}</p>}
          {notice && <p className="message success">{notice}</p>}

          <form onSubmit={handleAuth} className="auth-form">
            {isRegistering && (
              <Field label="Your name">
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </Field>
            )}

            <Field label="Email address">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </Field>

            <Field label="Password">
              <input
                type="password"
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </Field>

            <button className="primary-button full" disabled={busy}>
              {busy
                ? "Please wait..."
                : isRegistering
                ? "Create account"
                : "Sign in"}
            </button>
          </form>

          <p className="auth-switch">
            {isRegistering
              ? "Already registered?"
              : "New to HerSpace?"}

            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError("");
                setNotice("");
              }}
            >
              {isRegistering ? "Sign in" : "Register"}
            </button>
          </p>
        </section>
      </main>
    );
  }

  // Show the main application after the user signs in.
  return (
    <div className="app-shell">
      <Sidebar
        page={page}
        setPage={setPage}
        onLogout={handleLogout}
        user={user}
      />

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="eyebrow">{formatDate(today())}</span>

            <h1>
              Hello, {user.displayName || "there"} <span>♡</span>
            </h1>
          </div>

          <div className="topbar-mark">
            <Heart size={22} />
          </div>
        </header>

        {error && <p className="message error">{error}</p>}
        {notice && <p className="message success">{notice}</p>}

        {page === "Dashboard" && (
          <Dashboard
            cycles={cycles}
            events={events}
            upcomingEvents={upcomingEvents}
            nextPeriod={nextPeriod}
            setPage={setPage}
          />
        )}

        {page === "Cycle Tracker" && (
          <CycleTracker
            cycleDate={cycleDate}
            setCycleDate={setCycleDate}
            cycleLength={cycleLength}
            setCycleLength={setCycleLength}
            handleAddCycle={handleAddCycle}
            busy={busy}
            sortedCycles={sortedCycles}
            nextPeriod={nextPeriod}
            estimatedPeriodEnd={estimatedPeriodEnd}
            overlapEvents={overlapEvents}
          />
        )}

        {page === "Academic Calendar" && (
          <AcademicCalendar
            eventTitle={eventTitle}
            setEventTitle={setEventTitle}
            eventDate={eventDate}
            setEventDate={setEventDate}
            eventType={eventType}
            setEventType={setEventType}
            handleAddEvent={handleAddEvent}
            busy={busy}
            sortedEvents={sortedEvents}
            nextPeriod={nextPeriod}
            estimatedPeriodEnd={estimatedPeriodEnd}
            overlapEvents={overlapEvents}
          />
        )}

        <footer>
          Made with care <span>♡</span> HerSpace
        </footer>
      </main>
    </div>
  );
}
