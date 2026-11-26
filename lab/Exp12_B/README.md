# Experiment 12(B): Cookies and sessions

Three small Express demos show cookie creation/read/deletion, a visit counter stored in a session, and a combined login/session example.

Install dependencies once with `npm install`, then run one demo at a time. The session demos require a secret. In PowerShell, set one before starting the server:

```powershell
$env:SESSION_SECRET = 'replace-with-a-long-random-value'
```

```bash
npm run cookie
npm run session
npm run demo
```

Each uses port 3000, so stop one process before starting another. The default in-memory session store is for local learning only; a deployed application should use a persistent store and a private session secret. Set `NODE_ENV=production` behind HTTPS to enable secure session cookies.

[Back to lab index](../README.md)
