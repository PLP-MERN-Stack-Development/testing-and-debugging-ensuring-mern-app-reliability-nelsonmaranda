# Coverage Report Screenshots

This folder contains screenshots of the test coverage reports.

## Screenshots Included:

1. **coverage-overview.png** - Overall coverage summary showing 88.28% statements, 89.50% lines
2. **coverage-client.png** - Client-side components coverage (96.29%)
3. **coverage-server.png** - Server-side modules coverage breakdown

## How to Regenerate Coverage Reports:

```bash
npm test -- --coverage --coverageReporters=html
```

Then open:
- `coverage/lcov-report/index.html` for main report
- `coverage/lcov-report/client/src/components/index.html` for client
- `coverage/lcov-report/server/src/index.html` for server

