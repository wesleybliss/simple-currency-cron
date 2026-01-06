# AGENTS.md

## Project Overview
A simple currency conversion API built on Vercel serverless functions, fetching exchange rates from OpenExchangeRates.org with caching via Vercel KV.

## Tech Stack

### Core Framework
- **Next.js 15.2.8** - Used for serverless API routes and minimal frontend
- **Vercel** - Deployment platform with serverless functions and KV storage
- **Node.js (ES Modules)** - Project uses `"type": "module"` in package.json

### Dependencies
- **@vercel/kv** (^3.0.0) - Redis-compatible key-value store for caching exchange rate data
- **next** (15.2.8) - Framework for API routes and React pages

### External APIs
- **OpenExchangeRates.org** - Source for currency exchange rate data
  - Requires `OPEN_EXCHANGE_RATES_APP_ID` environment variable

## Project Structure

```
/api                 # Serverless API endpoints
  /clear.js          # Cache invalidation endpoint
  /convert.js        # Single currency pair conversion
  /currencies.js     # List all available currencies with rates
  /pairs.js          # Multi-target currency conversion
  /status.js         # Health check endpoint

/app                 # Next.js app directory
  /layout.jsx        # Root layout component
  /page.jsx          # Home page (minimal, mostly TODO)

/lib                 # Shared utilities and modules
  /api.js            # Generic HTTP client class
  /cache.js          # Cache abstraction layer
  /env.js            # Environment variable validation
  /kv.js             # Vercel KV wrapper functions
  /openExchangeRatesApi.js  # Configured API client for OpenExchangeRates
  /utils.js          # Time calculations and data validation utilities
```

## Architecture Patterns

### Caching Strategy
- 6-hour cache TTL for currency data (configurable per cache type)
- Cache keys support sub-keys for granular storage (e.g., `converts:USD-EUR`)
- Factory pattern for cache operations: `readFactory`, `writeFactory`, `deleteFactory`
- Cache entries include timestamp for TTL validation

### API Client Pattern
- Generic `Api` class in `lib/api.js` provides HTTP methods (GET, POST, PUT, DELETE)
- Instance configured with base URL and headers
- OpenExchangeRates client is a singleton with auth token in headers

### Environment Variables
- Custom validation helpers: `str()`, `int()`, `bol()`
- Throws errors for missing required vars, supports default values
- Centralized in `lib/env.js` with structured exports

## Coding Style Guidelines

### Indentation & Formatting
- **4 spaces** for indentation (not tabs)
- No curly braces for single-statement blocks:
  ```javascript
  if (!cached)
      return null
  ```
- Opening braces on same line for multi-statement blocks:
  ```javascript
  if (cached) {
      console.info('convert: read from cache')
      base = cached.rates[baseName]
  }
  ```
- Empty lines before and after block boundaries for readability

### Import Style
- Use ES module imports: `import X from 'Y'`
- Import wildcard for modules with multiple exports: `import * as cache from '../lib/cache.js'`
- Always include `.js` extension in relative imports

### Variable Declarations
- Prefer `const` by default, `let` when reassignment needed
- No `var` usage
- Descriptive variable names: `baseName`, `targetNames`, `exchangeRate`

### Function Definitions
- Arrow functions for exports: `export default async (req, res) => { ... }`
- Arrow functions for inline callbacks: `.map(it => it.toUpperCase())`
- Use `it` as conventional short variable name in map/filter callbacks
- Named exports for utilities: `export const readFactory = ...`

### Error Handling
- Try-catch blocks in all API endpoints
- Return 500 status with `{ error: e.message }` for errors
- Console logging: `console.info()` for success, `console.error()` for errors, `console.warn()` for warnings
- Throw descriptive errors: `throw new Error('The baseUrl must be a string')`

### API Response Structure
- Include `source` field to indicate cache vs. remote: `{ source: 'cache' }` or `{ source: 'remote' }`
- Include `timestamp` for data freshness
- Wrap data in `data` field for consistency
- Use proper HTTP status codes: 200 (success), 401 (unauthorized), 500 (error)

### Async/Await
- Use `async/await` consistently (no raw promises)
- Await API calls directly without chaining

### Comments
- Use `// @todo` for future improvements
- Keep comments minimal, code should be self-documenting
- Multi-line comments use `/* ... */` for extended explanations

### Naming Conventions
- camelCase for variables and functions
- PascalCase for classes (e.g., `Api`)
- UPPER_SNAKE_CASE for environment variables
- Lowercase for API endpoint filenames

## Key Features

### Endpoints
- `GET /api/status` - Health check (scheduled cron every 9am)
- `GET /api/currencies` - Fetch all available currencies with USD rates
- `GET /api/convert?from=USD&to=EUR&value=100&refresh=true` - Convert single pair
- `POST /api/pairs` - Convert base currency to multiple targets (body: `{ base, targets[], value, refresh }`)
- `GET /api/clear?key=currencies` - Clear specific cache keys

### Cache Management
- Automatic TTL check (6 hours default)
- Manual refresh via `?refresh=true` query param or `refresh` in request body
- Selective clearing via `/api/clear` endpoint

## Development Commands
```bash
pnpm start             # Start dev server on port 3002
pnpm run deploy        # Deploy to Vercel production
pnpm run adb:proxy     # Proxy localhost:3002 via adb for Android testing
```

## Environment Setup
Required environment variables:
- `OPEN_EXCHANGE_RATES_APP_ID` - API key for OpenExchangeRates.org

Local development uses `.env.development.local` file.

## Testing Notes
- No test framework currently configured
- API responses include `source` field to verify cache behavior
- Use `refresh` parameter to bypass cache for testing
