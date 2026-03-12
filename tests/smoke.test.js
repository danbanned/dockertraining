import fs from 'fs';

describe("project checks", () => {
  test("docker compose uses env-based secret injection", () => {
    const compose = fs.readFileSync("docker-compose.yml", "utf8");

    expect(compose).toMatch(/POSTGRES_PASSWORD:\s*\$\{POSTGRES_PASSWORD/);
    expect(compose).toMatch(/DATABASE_URL:\s*\$\{DATABASE_URL/);
  });

  test("README includes CI and remediation workflow", () => {
    const readme = fs.readFileSync("README.md", "utf8");

    expect(readme).toMatch(/CI/);
    expect(readme).toMatch(/red badge/i);
    expect(readme).toMatch(/green badge/i);
  });
});