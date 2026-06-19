# Level Up Todo — Хичээлийн тэмдэглэл

> Энэ файл хичээлд ашиглах зориулалттай. Бүх логик, шийдвэр, архитектурыг тайлбарласан.

---

## Төслийн тойм

**Level Up Todo** нь RPG тоглоомын нэгэн адил ажилладаг todo апп.

- Хэрэглэгч task (quest) үүсгэнэ
- Quest биелүүлэхэд **20 XP** олдоно
- XP тодорхой хэмжээнд хүрэхэд **level ахина**
- Level ахихад toast notification гарна

---

## Технологийн Stack

| Давхарга | Технологи |
|---|---|
| Frontend | Next.js 16 + React 19 + TypeScript |
| Backend | Apollo GraphQL Server 5 |
| Өгөгдлийн сан | PostgreSQL + Prisma ORM |
| Харагдах байдал | Tailwind CSS 4 + shadcn/ui |
| Монорепо | NX 22 |
| Package manager | Bun |

---

## Folder Structure

```
apps/todo/
├── todo-service/          ← Backend (GraphQL + Prisma)
│   ├── src/
│   │   ├── lib/
│   │   │   └── xp.ts              ← XP/Level тооцоолох функцууд
│   │   ├── graphql/
│   │   │   ├── schema/
│   │   │   │   └── user.schema.ts ← GraphQL схем (type, query, mutation)
│   │   │   └── resolvers/
│   │   │       ├── queries/
│   │   │       │   ├── get-users.ts
│   │   │       │   └── get-todos-by-user-id.ts
│   │   │       └── mutations/
│   │   │           ├── create-user.ts
│   │   │           ├── create-todo.ts
│   │   │           └── complete-todo.ts  ← XP нэмэх, level тооцоолох гол логик
│   │   ├── config/db.ts           ← Prisma client (database connection)
│   │   └── server.ts              ← Apollo Server эхлүүлэх
│   ├── prisma/
│   │   └── schema.prisma          ← Өгөгдлийн сангийн загвар
│   └── types/
│       └── index.ts               ← GraphQL Context type
│
└── todo-web/              ← Frontend (Next.js)
    └── src/app/
        ├── types/
        │   ├── user.types.ts      ← User interface
        │   └── todo.types.ts      ← Todo interface
        ├── graphql/
        │   ├── user.ts            ← GET_USERS, CREATE_USER query/mutation
        │   └── todo.ts            ← GET_TODOS, CREATE_TODO, COMPLETE_TODO
        ├── lib/
        │   └── xp.ts              ← XP тооцоолох (frontend хувилбар)
        ├── context/
        │   └── UserContext.tsx    ← Сонгосон хэрэглэгчийг хадгалах
        ├── hooks/
        │   ├── useGetUsers.tsx
        │   ├── useCreateUser.tsx
        │   ├── useGetTodosByUserId.tsx
        │   ├── useCreateTodo.tsx
        │   └── useCompleteTodo.tsx  ← Level up toast энд дуудна
        ├── components/
        │   ├── XPProgressBar.tsx  ← XP дэвшлийн мөр
        │   ├── UserCard.tsx       ← Хэрэглэгчийн карт (Avatar + XP bar)
        │   ├── UserSelector.tsx   ← Хэрэглэгчдийн жагсаалт
        │   ├── Quest.tsx          ← Нэг quest карт
        │   ├── QuestsBox.tsx      ← Quest-уудын container
        │   ├── CreateQuest.tsx    ← Шинэ quest үүсгэх dialog
        │   └── CreateUser.tsx     ← Шинэ хэрэглэгч нэмэх
        ├── provider/
        │   ├── ApolloProvider.tsx ← GraphQL client тохируулах
        │   └── Providers.tsx      ← Бүх provider-уудыг нэгтгэсэн
        ├── layout.tsx             ← Root layout
        └── page.tsx               ← Үндсэн хуудас (bento grid)
```

---

## Өгөгдлийн загвар (Prisma Schema)

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  xp        Int      @default(0)   // Нийт XP (хуримтлагдсан)
  level     Int      @default(1)   // Одоогийн level
  todos     Todo[]
}

model Todo {
  id          String   @id @default(uuid())
  title       String
  description String?
  xpReward    Int      // Биелүүлэхэд олдох XP (20 XP тогтмол)
  isCompleted Boolean  @default(false)
  userId      String
  user        User     @relation(fields: [userId], references: [id])
}
```

---

## XP болон Level тооцоолол

### Хэдэн XP = нэг level?

Level ахихад шаардлагатай XP **нэмэгддэг**:

| Level | Level ахихад хэрэгтэй XP | Нийт XP (тэр level-д хүрэхэд) |
|-------|--------------------------|-------------------------------|
| 1 → 2 | 100 XP                   | 100 XP                        |
| 2 → 3 | 200 XP                   | 300 XP                        |
| 3 → 4 | 300 XP                   | 600 XP                        |
| 4 → 5 | 400 XP                   | 1000 XP                       |

### Математик томьёо

```
Level N-д хүрэхэд шаардлагатай нийт XP = 100 × N × (N-1) / 2
```

**Жишээ:**
- Level 1 → 100 × 1 × 0 / 2 = **0 XP**
- Level 2 → 100 × 2 × 1 / 2 = **100 XP**
- Level 3 → 100 × 3 × 2 / 2 = **300 XP**

### XP utility функцууд (`lib/xp.ts`)

```typescript
// Level N-д хүрэхэд хэдэн XP хэрэгтэй (нийт)
xpForLevel(level) → number

// Нийт XP-ээс одоогийн level-ийг олох
getLevel(totalXp) → number

// Level дотор хэдэн XP хуримтлагдсан, хэдэн XP дутуу байгааг тооцоолох
xpWithinLevel(totalXp) → { current, needed, level }
```

**Энэ хэсэг хичээлд чухал:** Нэг функцийг backend (todo-service) болон frontend (todo-web) хоёуланд ижилхэн бичсэн.

---

## GraphQL Схем

```graphql
type Query {
  getUsers: [User]!                        # Бүх хэрэглэгчид
  getTodoByUserId(userId: ID!): [Todo]!    # Хэрэглэгчийн quest-ууд
}

type Mutation {
  createUser(name: String!, xp: Int!): Response!
  createTodo(input: TodoInput!): Response!
  completeTodo(todoId: ID!, userId: ID!): CompleteTodoResponse!
}

# Ердийн хариу
type Response { message: String! }

# Quest биелүүлсний хариу (XP болон level мэдээлэл)
type CompleteTodoResponse {
  message: String!
  xpGained: Int!        # Олсон XP (20)
  leveledUp: Boolean!   # Level ахсан эсэх
  newLevel: Int!        # Шинэ level
  newXp: Int!           # Шинэ нийт XP
  currentLevelXp: Int!  # Level дотор хуримтлагдсан XP
  xpToNextLevel: Int!   # Дараагийн level-д хэдэн XP дутуу
}
```

---

## Backend Resolver-уудын логик

### `complete-todo.ts` — Гол логик

```
1. Prisma $transaction эхлүүлэх (атомик — зэрэг дарахад алдаа гарахгүй)
2. Todo олох → байхгүй бол error
3. isCompleted == true бол буцаах (давхар XP хорих)
4. Todo-г completed болгох
5. Хэрэглэгчийн XP-г нэмэх (+20)
6. Шинэ level тооцоолох
7. Хэрэглэгчийн level-ийг шинэчлэх
8. CompleteTodoResponse буцаах
```

**Яагаад `$transaction` ашигласан?**

Хэрэв хоёр хүсэлт нэгэн зэрэг ирвэл (хэрэглэгч 2 удаа дарвал) XP хоёр удаа нэмэгдэж болно. Transaction нь энэ асуудлыг шийдэж, бүх үйлдлийг нэг атомик блок болгоно.

---

## Frontend Архитектур

### Context: UserContext

```
activeUser — одоо сонгогдсон хэрэглэгч
setActiveUser — хэрэглэгч солих функц
```

UserCard дарахад `setActiveUser` дуудагдана. QuestsBox болон бусад компонентууд `useActiveUser()` hook ашиглан одоогийн хэрэглэгчийг авна.

### Apollo Cache Refresh

Quest биелүүлэхэд **refetchQueries** дуудагдаж дараах query-нуудыг шинэчилнэ:
- `GET_USERS` → UserCard-ын XP/level шинэчлэгдэнэ
- `GET_TODOS_BY_USER_ID` → Quest-ын checkbox шинэчлэгдэнэ

### Level Up Toast

`useCompleteTodo` hook-ийн `onCompleted` callback дотор:

```typescript
if (r.leveledUp) {
  toast.success(`Level Up! You are now Level ${r.newLevel}!`)
} else {
  toast(`+${r.xpGained} XP`)
}
// Context шинэчлэх (cache-г хүлээхгүйгээр шуурхай UI update)
setActiveUser({ ...activeUser, xp: r.newXp, level: r.newLevel })
```

---

## Дизайн: Glassmorphism Bento

### Glassmorphism гэж юу вэ?

Шилэн нөлөө үзүүлэх CSS техник:
- `backdrop-blur-md` — ард байгаа зургийг бүдэгрүүлнэ
- `bg-white/10` — 10% цагаан дэвсгэр (ил тод)
- `border border-white/20` — 20% цагаан хүрээ

### Bento Grid гэж юу вэ?

Apple-ийн presentation хэв маягаас санаа авсан, ялгаатай хэмжээтэй картуудын grid layout.

```
┌─────────────┬───────────────────────────┐
│  col-span-1 │       col-span-2          │
│             │                           │
│  UserSelector│     QuestsBox            │
│             │                           │
└─────────────┴───────────────────────────┘
```

---

## Апп ажиллуулах

### Backend

```bash
# apps/todo/todo-service дотор
nx run todo-service:serve
# эсвэл
cd apps/todo/todo-service && bun run start
```

Apollo Sandbox: http://localhost:4001/graphql

### Frontend

```bash
nx run todo-web:dev
# эсвэл
cd apps/todo/todo-web && bun run dev
```

Frontend: http://localhost:3000

### Database Migration

```bash
cd apps/todo/todo-service
bunx prisma migrate deploy
```

---

## Хичээлд туслах жишээ Query-нууд

Apollo Sandbox дотор ажиллуулаарай:

### 1. Хэрэглэгч үүсгэх

```graphql
mutation {
  createUser(name: "Баатар", xp: 0) {
    message
  }
}
```

### 2. Бүх хэрэглэгчид авах

```graphql
query {
  getUsers {
    id
    name
    xp
    level
  }
}
```

### 3. Quest үүсгэх

```graphql
mutation {
  createTodo(input: {
    title: "Луу алах"
    description: "Хойд уулын луутай тулах"
    userId: "ХЭРЭГЛЭГЧИЙН_ID"
  }) {
    message
  }
}
```

### 4. Quest-ийн жагсаалт авах

```graphql
query {
  getTodoByUserId(userId: "ХЭРЭГЛЭГЧИЙН_ID") {
    id
    title
    xpReward
    isCompleted
  }
}
```

### 5. Quest биелүүлэх (XP нэмэгдэнэ)

```graphql
mutation {
  completeTodo(
    todoId: "QUEST_ID"
    userId: "ХЭРЭГЛЭГЧИЙН_ID"
  ) {
    message
    xpGained
    leveledUp
    newLevel
    newXp
    currentLevelXp
    xpToNextLevel
  }
}
```

---

## Бүрэн тест хийх алхамууд

1. Backend + Frontend хоёуланг эхлүүл
2. "Баатар" нэртэй хэрэглэгч үүсгэ
3. UserCard дээр дарж сонго → Quest хуудас гарна
4. "New Quest" дарж quest үүсгэ
5. Quest-ийн checkbox дарж биелүүл → "+20 XP" toast гарна
6. 5 quest биелүүл → 100 XP → Level 2 → "Level Up!" toast гарна
7. XPProgressBar-ийн дэвшил харагдана

---

## Нэмэгдсэн Feature-ууд (2 дахь давалгаа)

### Quest устгах (deleteTodo)
- `Quest.tsx`-д Trash2 icon нэмэгдсэн
- Completed quest устгавал XP автоматаар хасагдана
- Backend: `$transaction` ашиглан атомикаар хийнэ

### User устгах (deleteUser)
- `UserCard.tsx`-д X button нэмэгдсэн (баруун дээд булан)
- `e.stopPropagation()` — card select хийхгүйн тулд
- Устгасан user идэвхтэй байвал UserContext автоматаар цэвэрлэгдэнэ
- Prisma `onDelete: Cascade` → бүх todo автоматаар устна

### Quest буцаах / Undo (uncompleteTodo)
- `Quest.tsx`-д checkbox toggle болгосон — дахин дарахад uncomplete болно
- XP хасагдана, level буурч болно
- Toast: `"-20 XP"` эсвэл `"Level Down! Now Level N"`

### Нэмэгдсэн файлууд
- `mutations/uncomplete-todo.ts`
- `mutations/delete-todo.ts`
- `mutations/delete-user.ts`
- `hooks/useUncompleteTodo.tsx`
- `hooks/useDeleteTodo.tsx`
- `hooks/useDeleteUser.tsx`

---

## Дараагийн боломжит өргөтгөлүүд

- [ ] Дэлгэрэнгүй хуудас (user profile)
- [ ] Quest-ийн эрэмбэ (drag & drop)
- [ ] XP multiplier (streak bonus)
- [ ] Leaderboard (хэн хамгийн их XP-тэй)

---

*Хамгийн сүүлд шинэчилсэн: 2026-06-18*
