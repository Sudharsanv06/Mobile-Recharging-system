# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Local development notes

- Create a `.env` file in the `client/` folder or set environment variables when running.
- Example: copy `.env.example` to `.env` and edit if needed.

Example `.env` (in `client/.env`):
```
VITE_API_BASE=http://localhost:5000
```

## Running the client

Install dependencies and run the dev server:
```powershell
cd client
npm install
npm run dev
```

## Tests (Vitest)

The project uses Vitest + Testing Library for unit tests. The Vite config includes the Vitest settings (globals and jsdom).

Run tests:
```powershell
cd client
npm run test
```

If you encounter peer-dependency issues during `npm install`, use:
```powershell
npm install --legacy-peer-deps
```

## PDF export

Profile PDF export prefers `html2pdf.js`. If missing, the code falls back to `html2canvas` + `jspdf`.
Install optional packages in the client:
```powershell
cd client
npm install html2pdf.js html2canvas jspdf
```

## E2E (Playwright)

You can add Playwright for end-to-end tests. We include a minimal example test in `client/e2e/tests/profile.spec.js`.

Install Playwright and run tests:
```powershell
cd client
npm i -D @playwright/test
npx playwright install
npm run test:e2e
```

The `test:e2e` npm script (if present) will run Playwright tests.

## Notes

- The app uses `VITE_API_BASE` to determine the backend base URL. If not set, the Profile page will show a small configuration note but still render mockable UI in development and tests.
- Use `npm install --legacy-peer-deps` if you run into peer dependency conflicts when installing dev/testing libraries.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
