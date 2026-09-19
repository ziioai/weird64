# Contributing to Weird64

Thank you for taking the time to improve Weird64. Contributions in English or
Simplified Chinese are welcome. Project code, public API comments, issues, and
pull-request titles should use English so the whole community can participate.

By participating, you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Before opening an issue

- Use GitHub Discussions for usage questions when Discussions is available.
- Search existing issues before creating a new one.
- Use the bug or feature issue form and include a minimal reproduction.
- Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

## Development setup

Requirements:

- Node.js 24 for project development
- pnpm 11.23 or newer in the pnpm 11 release line

```sh
git clone https://github.com/ziioai/weird64.git
cd weird64
pnpm install
pnpm verify
```

Useful commands:

| Command | Purpose |
| --- | --- |
| `pnpm test` | Run the test suite |
| `pnpm test:coverage` | Run tests and enforce coverage thresholds |
| `pnpm typecheck` | Check the project with TypeScript 6 |
| `pnpm check` | Run Biome formatting and lint checks |
| `pnpm build` | Build ESM, CommonJS, and declarations |
| `pnpm check:package` | Validate published exports and types |
| `pnpm docs:dev` | Build TypeDoc and start VitePress |
| `pnpm verify` | Run the complete local CI suite |

## Making a change

1. Create a focused branch from `main`.
2. Add or update tests before changing behavior.
3. Document public API changes using TypeDoc-compatible TSDoc comments.
4. Update both README languages when user-facing behavior changes.
5. Add an entry under `Unreleased` in `CHANGELOG.md`.
6. Run `pnpm verify` before opening a pull request.

Keep commits focused. Conventional-style subjects such as `fix:`, `feat:`,
`docs:`, and `chore:` are encouraged but not mechanically required.

## Encoding compatibility

Changes to the alphabet, sentinel framing, padding, or compatibility vectors
are format changes. They must include:

- an explanation of the interoperability impact;
- updated compatibility vectors and round-trip tests;
- a changelog entry that clearly marks the breaking change; and
- a version bump consistent with the project's pre-1.0 SemVer policy.

## Pull requests

Pull requests should be small enough to review, explain why the change is
needed, and include tests for behavior changes. Maintainers may ask for a
change to be split when it mixes unrelated concerns.

All checks must pass before merging. A maintainer will squash or merge the pull
request based on its commit history.

## Release process for maintainers

1. Confirm `CHANGELOG.md` and `package.json` contain the intended version.
2. Run `pnpm verify` from a clean checkout.
3. Merge the release change and create a GitHub release named `vX.Y.Z`.
4. The publish workflow verifies that the tag matches `package.json`, rebuilds
   the package, and publishes it to npm with provenance.

The npm package must have GitHub Actions trusted publishing configured for the
`ziioai/weird64` repository and `.github/workflows/publish.yml` workflow.
