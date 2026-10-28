# Usage history

`usage-stats.yml` runs daily at 04:23 UTC, independently of documentation commits,
and can also be run manually. The daily schedule is approximate, not a guarantee.
The collector needs no npm dependencies. It updates the tracked file
`docs/.vitepress/data/usage-stats.json`, then explicitly dispatches the existing
Azure deployment workflow (a GITHUB_TOKEN commit alone cannot trigger push CI).

Normal production deployments also collect fresh statistics before building, including
the first deployment. Local builds (`npm run docs:build` or `scripts/build.sh`)
refresh when XMAKE_STATS_TOKEN is available. Build-time collection is optional:
missing credentials or API failures retain the saved data and do not block docs.
The daily archival job remains strict so failures are visible. PR builds do not
receive the traffic token. Build-time updates are deployed immediately; the
separate daily job persists history in Git.

## One-time setup

1. Create a fine-grained token restricted to `xmake-io/xmake-stats`, with repository
   **Administration: read** permission, owned by an account with traffic access.
   Complete organization approval if required. Add it to **xmake-docs** Actions
   secrets as `XMAKE_STATS_TOKEN`. Never put it in public JSON or client code.
2. Allow the collector's GITHUB_TOKEN to write repository contents and dispatch
   Actions, as declared in the workflow. Branch protection must permit this bot
   to commit the history file; otherwise use an approved bot/PR workflow.
3. Merge both workflows into `master` (the default branch), then manually run
   **Archive Xmake usage statistics**. Subsequent runs are scheduled daily.
   Existing Azure deployment credentials are reused; no database is needed.

GitHub exposes only the latest 14 days. Initial collection cannot recover older
history. Every run replaces overlapping daily records, preserving older dates.
API failures do not overwrite history. Monitor failed runs/token expiry. A gap
longer than GitHub's retention window cannot be backfilled. GitHub may disable
scheduled workflows on inactive public repositories; monitor schedule status.

## Definitions

- Daily `uniques`: GitHub unique cloners, a proxy for users, not exact people.
- Daily `clones`: clone events, a proxy for each project's first daily build,
  not every build invocation. Opt-outs, CI suppression and failed requests are
  not represented; manual clones can also contribute.
- Month/year build records: sum of collected daily clone counts.
- Month/year user metric: average daily uniques over **recorded** days, never a
  sum presented as deduplicated monthly/yearly users.
- Dates use UTC. Today's provisional data is neither archived nor plotted; only dates before the collection's UTC date are stored. Recent historical days are refreshed on every collection to pick up GitHub revisions. Missing
  dates stay missing, not zero. Partial periods show their recorded day count.

The Vue charts use static JSON, theme variables, accessible data tables and no
external chart dependency. No browser API token or live GitHub request is needed.

Run tests: `node --test scripts/tests/usage-stats.test.mjs`.
API reference: https://docs.github.com/en/rest/metrics/traffic#get-repository-clones
