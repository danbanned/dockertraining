"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "../../components/page-shell";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("");

  async function submit(event) {
    event.preventDefault();
    setStatus("Logging in...");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus(data.error || "Login failed");
      return;
    }
    setStatus("Login complete");
    router.push("/dashboard");
  }

  return (
    <PageShell eyebrow="Auth" title="Login to BrightPath" description="Resume your roadmap, daily tasks, and weekly review flow.">
      <section className="form-card">
        <form onSubmit={submit}>
          <label>
            Email
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </label>
          <label>
            Password
            <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          </label>
          <button type="submit">Login</button>
          <p>{status}</p>
        </form>
      </section>
    </PageShell>
  );
}
