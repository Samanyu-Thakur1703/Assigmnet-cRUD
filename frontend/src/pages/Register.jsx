import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const data = await api.register(form);
      setSuccess(data.message);
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setError(
        Object.values(err.data?.errors || {})[0] ||
        err.message
      );
    }
  };

  return (
    <section className="auth-card">
      <h1>Create account</h1>
      <p className="muted">Register before managing products.</p>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={submit}>
        <label>Name</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          minLength="8"
          required
        />

        <label>Confirm password</label>
        <input
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          required
        />

        <button className="primary-button">Register</button>
      </form>

      <p className="muted">
        Already registered? <Link to="/login">Login</Link>
      </p>
    </section>
  );
}
