import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("docker compose uses env-based secret injection", () => {
  const compose = fs.readFileSync("docker-compose.yml", "utf8");
  assert.match(compose, /POSTGRES_PASSWORD:\s*\$\{POSTGRES_PASSWORD/);
  assert.match(compose, /DATABASE_URL:\s*\$\{DATABASE_URL/);
});

test("README includes CI and remediation workflow", () => {
  const readme = fs.readFileSync("README.md", "utf8");
  assert.match(readme, /CI/);
  assert.match(readme, /red badge/i);
  assert.match(readme, /green badge/i);
});
