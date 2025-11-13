# College Agent

AI-guided campus discovery experience built with Next.js. Prospective students can ask natural-language questions about programs, campus life, and admissions and receive curated answers sourced from a structured knowledge base.

## Getting Started

### Requirements

- Node.js 18+
- npm 9+

### Setup

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to explore the agent.

## Available Scripts

- `npm run dev` — start the Next.js development server.
- `npm run build` — create a production build.
- `npm run start` — run the production build locally.
- `npm run lint` — lint the project with ESLint.

## Project Highlights

- **Conversational UI** tuned for prospective student journeys.
- **Edge-ready API route** that generates answers from curated campus data.
- **Program, campus life, and admissions knowledge base** defined in TypeScript for easy expansion.
- **Cohesive visual design** using custom CSS and polished interactions.

## Deploying

Build and deploy with Vercel or your preferred platform:

```bash
npm run build
vercel deploy --prod
```

Ensure the `VERCEL_TOKEN` environment variable is available when deploying via CLI.
