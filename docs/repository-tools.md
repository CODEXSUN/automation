# Repository tools

Version and release notes belong to this app's `docs/CHANGELOG.md`. Database Changes and App Codebase Changes are separate. Commit subjects use `#<minor>.<patch> - <latest entry title>`. Version starts at 0.1.0; shared package versions are independent.

After installing dependencies to create `package-lock.json`:

- `npm run github:now` or `npm run github:audit`: audit changed files, versions, and the proposed commit subject. Default is read-only; no fetch, pull, stage, commit, or push.
- `npm run version:show` or `npm run check:versions`: verify package, lock-root, and changelog versions. A missing lockfile is reported until installation.
- `npm run version:preview -- --title "Short change"`: preview the next patch version without writing files.
- `npm run version:update -- --title "Short change" --no-database-update` or `npm run version:bump -- --title "Short change" --no-database-update`: explicitly update this app's package, lock-root (when present), and changelog. Use `--database-update` for database changes; automatic detection is advisory and reports Unknown without Git history. Add verified change details before publishing.
- `npm run verify`: typecheck, build, tool tests, and version consistency.

## Explicit publication

After authorization, synchronize with `node tools/github-helper.mjs --sync-only`. Inspect and stage only the intended files, then use `node tools/github-helper.mjs --publish --staged --yes` for the reviewed index. Exact `--file` selections are also supported. The helper checks remote/upstream state, refuses incoming changes with dirty work, never rebases or implicitly stages all files, and verifies the staged tree before committing/pushing. Version preparation is separate; normal source publication creates no tag or deployable image.

## Optional SSH-key utility

`npm run github:ssh-key -- --help` is read-only help. Only an explicit `npm run github:ssh-key` generates an ED25519 keypair under ignored `dist/.tmp/`. Optional flags: `--comment "automation-server"` and `--json`. The private key is never printed; keep it private and move it to the intended host yourself. Nothing is uploaded, registered with GitHub, or installed into SSH configuration automatically. Key generation is not part of creation, version checks, tests, preflight, or publication.
