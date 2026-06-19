# Монорепо + GraphQL Дэлгэрэнгүй Заавар

NX 22 + Bun + Apollo Server v5 + Apollo Client v4 + Prisma v7 + Next.js 16 + Tailwind v4 + shadcn (radix-nova) стекийг алхам алхмаар тохируулах бүрэн заавар.

---

## Эцсийн Файлын Бүтэц

```
advanced-monorepo/
├── apps/
│   └── todo/
│       ├── todo-service/          ← Apollo Server v5 + Prisma v7 (GraphQL Backend)
│       │   ├── prisma/
│       │   │   └── schema.prisma
│       │   ├── generated/
│       │   │   └── prisma/        ← Prisma автомат үүсгэсэн client
│       │   ├── src/
│       │   │   ├── config/
│       │   │   │   └── db.ts      ← Prisma + pg connection pool
│       │   │   ├── graphql/
│       │   │   │   ├── schema/
│       │   │   │   │   ├── user.schema.ts
│       │   │   │   │   ├── todo.schema.ts
│       │   │   │   │   └── index.ts
│       │   │   │   └── resolvers/
│       │   │   │       ├── queries/
│       │   │   │       ├── mutations/
│       │   │   │       └── index.ts
│       │   │   ├── types/
│       │   │   │   └── index.ts   ← Context type
│       │   │   └── server.ts      ← Server entry point
│       │   ├── prisma.config.ts
│       │   ├── project.json
│       │   └── tsconfig.json
│       ├── todo-web/              ← Next.js 16 + Apollo Client v4 (Frontend)
│       │   ├── src/app/
│       │   │   ├── provider/
│       │   │   │   └── ApolloProvider.tsx
│       │   │   ├── global.css     ← Tailwind v4 CSS-first
│       │   │   ├── layout.tsx
│       │   │   └── page.tsx
│       │   ├── next.config.mjs
│       │   └── tsconfig.json
│       └── todo-web-e2e/          ← Cypress e2e tests
├── libs/
│   └── shared/
│       ├── shadcn/                ← Хуваалцсан UI (radix-nova)
│       │   ├── src/
│       │   │   ├── ui/            ← shadcn компонентууд
│       │   │   ├── lib/
│       │   │   │   └── utils.ts
│       │   │   ├── index.ts       ← Экспортын нэгдсэн файл
│       │   │   └── server.ts
│       │   └── components.json
│       └── types/
│           └── global.d.ts
├── tsconfig.base.json             ← Path aliases
├── nx.json
└── package.json
```

---

## Алхам 1: Nx Workspace Үүсгэх

```bash
# 1. Хоосон Nx workspace үүсгэх (apps preset)
bun create-nx-workspace todo-monorepo --preset=apps --packageManager=bun
cd todo-monorepo

# 2. Төсөлд хэрэгтэй Nx плагинуудыг суулгах
bun add -d @nx/next @nx/js typescript@latest
```

---

## Алхам 2: Root TypeScript Тохиргоо

`tsconfig.base.json` файлд `moduleResolution: "bundler"` ашиглана. TypeScript 6.x-д `ignoreDeprecations: "6.0"` нэмэх шаардлагатай.

**`tsconfig.base.json`:**

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "rootDir": ".",
    "moduleResolution": "bundler",
    "ignoreDeprecations": "6.0",
    "resolvePackageJsonImports": true,
    "target": "es2024",
    "module": "esnext",
    "skipLibCheck": true,
    "paths": {
      "@advanced-monorepo/shadcn": ["./libs/shared/shadcn/src/index.ts"],
      "@advanced-monorepo/shadcn/utils": ["./libs/shared/shadcn/src/lib/utils.ts"],
      "@advanced-monorepo/shadcn/ui": ["./libs/shared/shadcn/src/ui"],
      "@advanced-monorepo/shadcn/lib": ["./libs/shared/shadcn/src/lib"],
      "@advanced-monorepo/shadcn/hooks/*": ["./libs/shared/shadcn/src/hooks"],
      "@advanced-monorepo/shadcn/server": ["./libs/shared/shadcn/src/server.ts"],
      "@advanced-monorepo/todo-service": ["./apps/todo/todo-service/src/index.ts"]
    }
  },
  "exclude": ["node_modules", "dist"]
}
```

> `workspaces` pattern нь `apps/*/*` болон `libs/*/*` байна — нэг түвшин биш, хоёр түвшин.

**`package.json`-д:**

```json
{
  "workspaces": ["apps/*/*", "libs/*/*"]
}
```

---

## Алхам 3: Shared shadcn UI Library Босгох

### 3.1 Library үүсгэх

```bash
# UI номын сан үүсгэх (@nx/js:lib ашиглана, Bundler асуухад 'none' сонгоно)
bun x nx g @nx/js:lib shared-shadcn --directory=libs/shared/shadcn
```

### 3.2 shadcn эхлүүлэх (radix-nova style)

```bash
bun x shadcn@latest init
```

`shadcn init` хийх үед гарах асуултуудад:

- **Style**: `radix-nova` сонгоно
- **CSS файл**: `apps/todo/todo-web/src/app/global.css` зааж өгнө

### 3.3 `components.json` тохиргоо

`components.json` файл нь монорепод path alias-ийг заана:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-nova",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "apps/todo/todo-web/src/app/global.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@advanced-monorepo/shadcn",
    "utils": "@advanced-monorepo/shadcn/utils",
    "ui": "@advanced-monorepo/shadcn/ui",
    "lib": "@advanced-monorepo/shadcn/lib",
    "hooks": "@advanced-monorepo/shadcn/hooks"
  },
  "iconLibrary": "lucide"
}
```

> Энэ тохиргооны ачаар `bunx shadcn add button` тушаал бүх компонентыг `libs/shared/shadcn/src/ui/` дотор автоматаар үүсгэнэ.

### 3.4 Компонент нэмэх

```bash
# Root-оос ажиллуулна
bunx shadcn add button dialog badge card input label
```

### 3.5 `libs/shared/shadcn/src/index.ts` экспортын файл

```typescript
export * from './lib/shadcn';
export * from './lib/utils';
export * from './ui/button';
export * from './ui/dialog';
export * from './ui/badge';
export * from './ui/card';
export * from './ui/input';
export * from './ui/label';
export * from './ui/separator';
```

### 3.6 Хэрхэн ашиглах

```typescript
// Аль ч app-аас ашиглаж болно
import { Button } from '@advanced-monorepo/shadcn';
```

---

## Алхам 4: Backend — todo-service (Apollo Server v5 + Prisma v7)

### 4.1 Library үүсгэх

```bash
# Bundler асуухад 'none' сонгоно
bun x nx g @nx/js:lib todo-service --directory=apps/todo/todo-service
```

### 4.2 Шаардлагатай packages суулгах

```bash
bun add @apollo/server graphql graphql-tag @prisma/client @prisma/adapter-pg pg dotenv
bun add -d prisma @types/pg
```

### 4.3 Prisma тохируулах

```bash
cd apps/todo/todo-service
bun x prisma init
cd ../../..
```

**`apps/todo/todo-service/prisma/schema.prisma`:**

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"   // ← Монорепод заавал output зааж өгнө
}

datasource db {
  provider = "postgresql"
}

model User {
  id        String   @id @default(uuid())
  name      String
  xp        Int      @default(0)
  level     Int      @default(1)
  todos     Todo[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Todo {
  id          String   @id @default(uuid())
  title       String
  description String?
  xpReward    Int
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  isCompleted Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**`apps/todo/todo-service/prisma.config.ts`** (Prisma 7-д заавал хэрэгтэй):

```typescript
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
```

### 4.4 Prisma migrate & generate

```bash
cd apps/todo/todo-service

# Migration үүсгэж, client generate хийнэ
bun --bun run prisma migrate dev --name init

cd ../../..
```

### 4.5 Database холболт — `src/config/db.ts`

Prisma v7 нь `@prisma/adapter-pg` дээр суурилсан connection pooling ашиглана:

```typescript
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import pg from 'pg';
import { PrismaClient } from '../../generated/prisma/client'; // ← generated path

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const db =
  globalThis.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'info'] : ['error'],
  });

if (process.env.NODE_ENV === 'production') globalThis.prisma = db;
```

> `PrismaClient`-г `../../generated/prisma/client`-аас импортлоно. Default `@prisma/client`-аас биш!

### 4.6 Context type — `src/types/index.ts`

```typescript
import { BaseContext } from '@apollo/server';
import { db } from '../config/db';

export interface Context extends BaseContext {
  db: typeof db;
}
```

### 4.7 GraphQL Schema (TypeDefs)

Schema-г `graphql-tag`-ийн `gql` template literal-ээр тодорхойлно (code-first арга).

**`src/graphql/schema/user.schema.ts`:**

```typescript
import gql from 'graphql-tag';

export const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    xp: Int!
    level: Int!
    todos: [Todo]!
  }

  type Response {
    message: String!
  }

  type Query {
    getUsers: [User]!
  }

  type Mutation {
    createUser(name: String!): Response!
  }
`;
```

**`src/graphql/schema/todo.schema.ts`:**

```typescript
import gql from 'graphql-tag';

export const todoTypeDefs = gql`
  type Todo {
    id: ID!
    title: String!
    description: String
    xpReward: Int!
    isCompleted: Boolean!
  }

  input TodoInput {
    title: String!
    description: String
    xpReward: Int!
  }

  type Query {
    getTodoByUserId(userId: ID!): [Todo]!
  }

  type Mutation {
    createTodo(input: TodoInput): Response!
  }
`;
```

**`src/graphql/schema/index.ts`:**

```typescript
export * from './user.schema';
export * from './todo.schema';
```

### 4.8 Resolvers

**`src/graphql/resolvers/queries/get-users.ts`:**

```typescript
import { Context } from '../../../types/index';

export const getUsers = async (_: unknown, __: unknown, ctx: Context) => {
  const { db } = ctx;
  return await db.user.findMany();
};
```

**`src/graphql/resolvers/mutations/create-user.ts`:**

```typescript
import { Context } from '../../../types/index';

type User = { name: string };

export const createUser = async (_: unknown, args: User, context: Context) => {
  const { db } = context;
  const { name } = args;
  try {
    await db.user.create({ data: { name } });
    return { message: 'Success' };
  } catch (err: unknown) {
    throw new Error('System err', err);
  }
};
```

**`src/graphql/resolvers/index.ts`:**

```typescript
import * as Query from './queries';
import * as Mutation from './mutations';

export const resolvers = {
  Query: {
    getUsers: Query.getUsers,
  },
  Mutation: {
    createUser: Mutation.createUser,
  },
};
```

### 4.9 Apollo Server v5 — `src/server.ts`

```typescript
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Context } from './types/index';
import { userTypeDefs, todoTypeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers/index';
import { db } from './config/db';

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs: [userTypeDefs, todoTypeDefs], // ← массив хэлбэрээр дамжуулна
    resolvers: resolvers,
  });

  const { url } = await startStandaloneServer<Context>(server, {
    listen: { port: Number(process.env.PORT) || 4001 },
    context: async ({ req }) => {
      return { db }; // ← Prisma db-г context-д дамжуулна
    },
  });

  console.log(`GraphQL server is running on ${url}`);
};

startServer().catch((err) => {
  console.error(err);
});
```

> Apollo Server v5-д `context` нь `startStandaloneServer`-д тодорхойлогдоно (v3-аас ялгаатай).

### 4.10 `project.json` — Nx serve target

```json
{
  "name": "todo-service",
  "$schema": "../../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "apps/todo/todo-service/src",
  "projectType": "library",
  "targets": {
    "serve": {
      "executor": "nx:run-commands",
      "options": {
        "command": "bun run --watch src/server.ts",
        "cwd": "apps/todo/todo-service"
      }
    }
  }
}
```

### 4.11 `tsconfig.json`

```json
{
  "extends": "../../../tsconfig.base.json",
  "compilerOptions": {
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true
  }
}
```

---

## Алхам 5: Frontend — todo-web (Next.js 16 + Apollo Client v4)

### 5.1 Next.js апп үүсгэх

```bash
bun x nx g @nx/next:app todo-web --directory=apps/todo/todo-web --style=css --appDir=true
```

### 5.2 Apollo Client суулгах

```bash
bun add @apollo/client
```

### 5.3 `next.config.mjs`

```javascript
import { withNx } from '@nx/next';

const nextConfig = {
  nx: {
    svgr: true,
  },
};

export default withNx(nextConfig);
```

### 5.4 Tailwind v4 CSS-first тохиргоо

Tailwind v4-д `tailwind.config.js` файл байхгүй. Бүх тохиргоо CSS дотор хийгддэг.

**`src/app/global.css`:**

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@import 'shadcn/tailwind.css'; /* shadcn-ийн CSS variables */

/* Shared UI library-н source зааж өгнө */
@source '../../../../../libs/shared/shadcn/src/**/*.{js,ts,jsx,tsx}';

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... бусад CSS variables ... */
}

/* :root болон .dark CSS variables энд */
```

> `@source` directive нь Tailwind v4-д shared library-н кодыг scan хийлгэдэг тул заавал байх ёстой.

### 5.5 Apollo Client Provider — `src/app/provider/ApolloProvider.tsx`

```typescript
'use client';

import { InMemoryCache, HttpLink, ApolloClient } from '@apollo/client';
import { ApolloProvider as Provider } from '@apollo/client/react';
import React from 'react';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4001' }),
  cache: new InMemoryCache(),
});

export const ApolloProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider client={client}>{children}</Provider>;
};
```

> Apollo Client v4-д `HttpLink` тусад нь үүсгэж, `link` параметрт дамжуулна.

### 5.6 `src/app/layout.tsx`

```typescript
import { Metadata } from 'next';
import './global.css';
import { ApolloProvider } from './provider/ApolloProvider';

export const metadata: Metadata = {
  title: 'Welcome to todo-web',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ApolloProvider>{children}</ApolloProvider>
      </body>
    </html>
  );
}
```

### 5.7 GraphQL query ашиглах жишээ — `src/app/page.tsx`

```typescript
'use client';

import { Button } from '@advanced-monorepo/shadcn';
import { useQuery } from '@apollo/client/react';
import gql from 'graphql-tag';

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      name
      xp
      level
    }
  }
`;

const Page = () => {
  const { data, loading, error } = useQuery(GET_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <Button>Hello</Button>
      {data?.getUsers.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};

export default Page;
```

### 5.8 `project.json`

```json
{
  "name": "todo-web",
  "$schema": "../../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "apps/todo/todo-web",
  "projectType": "application",
  "targets": {
    "dev": {
      "executor": "nx:run-commands",
      "options": {
        "command": "bunx next dev",
        "cwd": "apps/todo/todo-web"
      }
    }
  }
}
```

---

## Хөгжүүлэлтийн Орчин (VS Code)

`.vscode/settings.json` — Auto-import `.js` өргөтгөл нэмэхийг хаах:

```json
{
  "typescript.preferences.importModuleSpecifierEnding": "minimal",
  "javascript.preferences.importModuleSpecifierEnding": "minimal",
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

Тохиргоо хадгалсны дараа: `Cmd + Shift + P` → **TypeScript: Restart TS Server**.

---

## Ажиллуулах Тушаалууд

```bash
# Backend (Apollo Server) асаах — port 4001
bun nx serve todo-service

# Frontend (Next.js) асаах
bun nx dev todo-web

# Prisma migration үүсгэх
cd apps/todo/todo-service && bun --bun run prisma migrate dev --name <migration-name>

# Prisma Studio (DB GUI) нээх
cd apps/todo/todo-service && bun --bun run prisma studio

# Prisma client дахин generate хийх
cd apps/todo/todo-service && bun --bun run prisma generate
```

---

## Гол Ялгаанууд (GUIDE.md-тай харьцуулбал)

| Хуучин GUIDE.md                               | Одоогийн кодонд                               |
| --------------------------------------------- | --------------------------------------------- |
| `@todo/shared-ui`                             | `@advanced-monorepo/shadcn`                   |
| Basic `new PrismaClient()`                    | `PrismaPg` adapter + connection pool          |
| `@prisma/client` import                       | `../../generated/prisma/client` import        |
| `globalForPrisma` pattern                     | `globalThis.prisma` шууд                      |
| Apollo Client шууд `ApolloClient({ uri })`    | `HttpLink` + `ApolloClient({ link })`         |
| `Apollo Server context` in server constructor | `context` in `startStandaloneServer`          |
| Tailwind v3 `postcss.config.mjs` шаардлагатай | Tailwind v4 CSS-only, postcss config хэрэггүй |
| `@source` GUIDE.md-д байхгүй                  | `global.css`-д `@source` заавал хэрэгтэй      |
| `prisma.config.ts` байхгүй                    | Prisma 7-д заавал хэрэгтэй                    |
