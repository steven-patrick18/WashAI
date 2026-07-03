// Minimal internal HTTP service (never exposed to the internet — reachable
// only on the Docker network) that updates WashAI from GitHub:
//   GET  /status  → current commit + update state
//   POST /update  → git pull + docker compose up -d --build washai
// Both require the shared x-updater-token header.
const http = require("http");
const { spawn } = require("child_process");

const TOKEN = process.env.UPDATER_TOKEN || "";
const REPO = "/repo";

let state = { updating: false, startedAt: null, lastResult: null };

function run(cmd, args) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { cwd: REPO });
    let out = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (out += d));
    p.on("close", (code) => resolve({ code, out }));
    p.on("error", (err) => resolve({ code: -1, out: String(err) }));
  });
}

async function doUpdate() {
  state = { updating: true, startedAt: new Date().toISOString(), lastResult: null };
  const pull = await run("git", ["pull"]);
  const build =
    pull.code === 0
      ? await run("docker", ["compose", "-f", "docker-compose.prod.yml", "up", "-d", "--build", "washai"])
      : { code: -1, out: "skipped (git pull failed)" };
  state = {
    updating: false,
    startedAt: state.startedAt,
    lastResult: {
      ok: pull.code === 0 && build.code === 0,
      finishedAt: new Date().toISOString(),
      pull: pull.out.slice(-500),
      build: build.out.slice(-500),
    },
  };
}

async function main() {
  // The repo is a bind mount owned by host-root; mark it safe for git.
  await run("git", ["config", "--global", "--add", "safe.directory", REPO]);

  http
    .createServer(async (req, res) => {
      if (!TOKEN || req.headers["x-updater-token"] !== TOKEN) {
        res.writeHead(401, { "content-type": "application/json" });
        return res.end(JSON.stringify({ error: "unauthorized" }));
      }

      if (req.method === "GET" && req.url === "/status") {
        const sha = await run("git", ["rev-parse", "HEAD"]);
        res.writeHead(200, { "content-type": "application/json" });
        return res.end(JSON.stringify({ sha: sha.out.trim(), ...state }));
      }

      if (req.method === "POST" && req.url === "/update") {
        if (state.updating) {
          res.writeHead(409, { "content-type": "application/json" });
          return res.end(JSON.stringify({ error: "Update already running." }));
        }
        doUpdate(); // async — respond immediately
        res.writeHead(202, { "content-type": "application/json" });
        return res.end(JSON.stringify({ started: true }));
      }

      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "not found" }));
    })
    .listen(9000, () => console.log("washai-updater listening on :9000"));
}

main();
