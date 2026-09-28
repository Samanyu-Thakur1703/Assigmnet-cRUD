import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const data = await api.login(form);
      onLogin(data.user);
      navigate("/");
    } catch (err) {
      setError(
        Object.values(err.data?.errors || {})[0] ||
        err.message
      );
    }
  };

  return (
    <section className="auth-card">
      <h1>Login</h1>
      <p className="muted">Use your account to manage products.</p>

      {error && <div className="error">{error}</div>}

      <form onSubmit={submit}>
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
          required
        />

        <button className="primary-button">Login</button>
      </form>

      <p className="muted">
        New user? <Link to="/register">Create an account</Link>
      </p>
    </section>
  );
}
