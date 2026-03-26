import { Navigation } from "./navigation";

export function PageShell({ eyebrow, title, description, children }) {
  return (
    <div className="shell">
      <Navigation />
      <main className="page">
        <section className="hero">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </section>
        {children}
      </main>
    </div>
  );
}
