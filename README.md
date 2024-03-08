# wt-marcin

This web-application project consists of two parts:

1. backend in Node.js (`/backend`);
2. frontend in React (`/fronted`).

## Running the project

In order to run the project you need to open the frontend while having the backend running at the same time.

### Running the backend

Prerequsites:

- Node.js v20.11.1

To run the server, navigate to `backend/` directory and execute:

```
npm install
npm run build
npm start
```

NOTE: Correct environment variables need to be setup in `backend/.env`. See `/backend/.env.example` for an example.

For development mode with hot reload you can run:

```
npm run dev
```

### Running the frontend

Prerequsites:

- Node.js v20.11.1

To run the server, navigate to `frontend/` directory and execute:

```
npm install
npm run build
npm run preview
```

For development mode with hot reload you can run:

```
npm run dev
```
