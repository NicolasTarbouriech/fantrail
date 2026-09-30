# Development Guidelines

## 1. Architecture

### Backend For Frontend (BFF)

- `apps/backend/web` is the backend of the web clients (SPA and SSR). It exposes their GraphQL API.
- The BFF orchestrates calls to the modules, aggregates data, and applies client-specific security.
- The BFF contains no core business logic: modules encapsulate the domain logic and stay client-agnostic.
- Modules are libraries imported by the BFF, not separate services.

### Domain Driven Design (DDD)

- Domain is central and independent of infrastructure.
- Dependencies flow from outside to inside (infrastructure → application → domain).
- Domain never depends on infrastructure or application layers.

#### Layers

- **Domain**: Aggregates, business rules, events, repository interfaces, types, assertions.
- **Infrastructure**: Repository implementations, DB access, adapters to other modules, mappers.
- **Application**: Commands, queries, sagas (orchestration only, no domain logic).

#### Monorepo Structure

```
libs/modules/<module-name>/
├── domain
├── infrastructure
└── application
```

What assembles several modules for the BFF (leaderboards for instance) lives in a feature lib `libs/apps/backend/web/<feature>/feature-<name>`. The app `apps/backend/web` only keeps transport and composition: GraphQL resolvers and types, guards, dataloaders, config, `AppModule`.

#### Domain Folder Layout

Inside `domain/src/lib/`, only use these folder names, created on demand (a module never needs them all):

`aggregates`, `repositories`, `types`, `errors`, `events`, `enums`, `constants`, `schemas`, `valueObjects`, `assertions`, `services`, `testing`.

- **Never invent a new stereotype folder.** No `read-models/`, `calculators/`, `projections/`, `factories/`, `mappers/`. If a class doesn't obviously belong to one of the folders above, put it in the closest one and raise the question in review.
- `types/` holds a zod schema and the inferred type under the same name (`export const RaceId = z.string().uuid(); export type RaceId = z.infer<typeof RaceId>;`).
- **Read-side projections** (the shape a query returns when it is not an aggregate) are plain immutable classes in `valueObjects/`, with **no `ReadModel` / `Projection` / `Dto` suffix**. Name them after the business concept (`LeaderboardEntry`, `FieldScoringSource`, `PlayerFieldScore`).
- A projection carries IDs, not denormalized labels from other modules: expose `userId` / `runnerIdList` and let the BFF resolve names through its dataloaders (see the GraphQL section). This keeps the repository free of cross-module joins.
- `services/` holds stateless domain collaborators, including `*Calculator` classes (see the naming rule in the TypeScript section).
- `assertions/` classes must carry the rule itself, not just wrap a `throw`: pass them the domain data they check (`RaceStatusAssertion.assertTransition(from, to)`), never a pre-computed boolean. A one-line invariant with no reusable rule stays an inline `if` in the aggregate.
- `errors/` holds one class per file. Business errors extend `DomainError` or `NotFoundDomainError` (`@trail/shared/tooling/util-error`); the BFF turns them into GraphQL errors whose `extensions.code` derives from the class name (`RaceStatusTransitionError` → `RACE_STATUS_TRANSITION`). No Apollo error class per business error.
- `testing/` holds test builders, exposed through the `@trail/modules/<module>/domain-testing` alias and excluded from coverage.

#### Key Principles

- Aggregates guarantee business consistency and encapsulate state/behavior. They extend `AggregateRoot` from `@nestjs/cqrs`, have a public positional constructor (used by mappers and builders) and a `static assertData(data)`.
- Every mutation goes through an aggregate method. Methods depending on time receive `now: Date`.
- Domain events use only primitive types (string, number, enum).
- Repository interfaces are abstract classes defined in the domain (they are also the injection token), implemented in infrastructure, and map entities to aggregates.
- **`findBy…` returns the aggregate or `null`, `getBy…` returns the aggregate or throws a `NotFoundDomainError`.** A `findBy…` method never throws "not found", a `getBy…` method never returns `null`.
- A module reads another module through its queries, via a domain port implemented in its infrastructure (`QueryBus…Repository`), never through its tables.
- Commands mutate state via aggregates; Queries are read-only. They contain no domain logic, only orchestration.
- Commands and queries must validate inputs against defined schemas before processing.
- Sagas react to domain events and orchestrate long-running processes.
- **Validation responsibilities are split by layer.** Input/schema validation remains in the application layer (command/query handlers validate payload shape before invoking the domain). Domain-layer defensive code is limited to enforcing business invariants and rule checks (for example, allowed status transitions) inside aggregates or domain assertion classes. When those domain rules are violated, raise domain-specific errors rather than raw `throw new Error(...)` statements in application-layer handlers. Command handlers contain only orchestration logic.

### Event Driven

- Events contain: name, timestamp (epoch), eventId (UUID), payload (data).
- Must contain only simple types: number, string, enum.
- Must be defined using zod schema.
- Events travel in memory through the `@nestjs/cqrs` `EventBus`, wrapped in a Nest event class (`FieldResultPublishedNestEvent`).

## 2. TypeScript

- Always use strict typing (no `any`, no `as`).
- No forced cast using `as`, except in `.spec` or `.test` files.
- Every nx project, app or lib, sets `"strict": true` in its own `tsconfig.json`. Not in `tsconfig.app.json` / `tsconfig.lib.json`: the spec tsconfig would miss it and the tests would fail while the build passes. Never fall back to `strictNullChecks` alone to silence errors — fix them.
- **Every `private` member is prefixed with `_`**: properties, constructor parameters, methods, statics (`private readonly _raceRepository`, `private _mapEntity()`). Enforced by `@typescript-eslint/naming-convention`.
- Avoid the generic `Service` suffix for classes. Prefer either no suffix when the name is clear, or a specific domain-related suffix (e.g. `Assertion`, `Factory`, `Builder`, `Calculator`, `Generator`).
- **Enums use PascalCase for both the enum name and its members** — `RaceStatus.Open`, not `RACE_STATUS.OPEN`. The member _values_ keep whatever the domain or the persisted contract requires (`Open = 'open'`).
  - Renaming members of an enum exposed through `registerEnumType` renames the GraphQL enum values too (they are the TS keys), so regenerate the schema and the client codegen with it.
- Don't over-comment. When the business code is clear, no comment is needed — expressive names are the documentation. Keep only comments that encode a non-obvious _why_ (a hidden invariant, a workaround, a constraint) or functional JSDoc tags like `@deprecated`.

## 3. Tests

- Use function or class names in `describe` name.
- Do not use `jest.Mocked<...>`.
- No FakeClass; use simple mocks (`{ getById: jest.fn() } as unknown as RaceRepository`). Handlers are instantiated by hand, without `TestingModule`.
- Produce clear and deterministic tests: `jest.useFakeTimers({ now })` when time matters.
- All jest config files must have coverage thresholds: 100 % for `domain` libs, 90 % for `application` and feature libs, 80 % for `infrastructure` and the rest.
- Run a specific test file with `npx nx run <project>:test --testFile=path/to/file.spec.ts`.

## 4. TypeORM

- Entities and migrations live in `libs/shared/database/data-access-main`, with snake_case columns written by hand.
- Explicit relations (`relations: [...]`).
- Filtering on a relation loads the matching children only: to load a whole aggregate by a child id, find the parent id first, then load the parent.
- Consider SQL indexing.
- Avoid QueryBuilders when possible.
- Called only in repositories implementations, never in queries or commands.

### Migrations

- **Index creation on an existing table must use `CREATE INDEX CONCURRENTLY IF NOT EXISTS`** (and `DROP INDEX CONCURRENTLY IF EXISTS` for `down`). A plain `CREATE INDEX` takes an `ACCESS EXCLUSIVE` lock on the table and blocks all reads/writes for the duration of the build — on large tables this freezes the DB in production.
  - Because `CONCURRENTLY` cannot run inside a transaction, set `public transaction: 'none' = 'none';` (or split the migration) so TypeORM doesn't wrap it.
  - Example:
    ```ts
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        `CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_xxx" ON "table" ("column")`,
      );
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`DROP INDEX CONCURRENTLY IF EXISTS "public"."IDX_xxx"`);
    }
    ```
- **Run risky migrations manually before deploying to production.** Any migration that may lock or rewrite a large table (adding/dropping indexes, adding NOT NULL columns, altering column types, backfills, large `UPDATE`/`DELETE`, `ALTER TABLE` taking `ACCESS EXCLUSIVE`) must be played manually on production **before** the deployment so the deploy itself becomes a no-op.
- When in doubt about a migration's blast radius (table size, locking, duration), ask before merging.
- After generating a migration, export it from `libs/shared/database/data-access-main/src/lib/migrations/index.ts`.

## 5. Nest

- Servers must have HealthModule configured.
- No Nest controller or service in the apps: everything goes GraphQL → bus → handler → aggregate. Only `HealthModule` exposes HTTP routes.

### CQRS

- **Always type commands and queries with `@trail/shared/cqrs/util-nestjs`, never with the `@nestjs/cqrs` types directly.** The shared types carry the result type, which `ICommand` / `IQuery` lose:
  - a command extends `Command<TResult>` (never `implements ICommand`), a query extends `Query<TResult>` (never `implements IQuery`);
  - a handler implements `IEnhancedCommandHandler<MyCommand>` / `IEnhancedQueryHandler<MyQuery>` (never `ICommandHandler` / `IQueryHandler`), which infers the result type from the command or query;
  - dispatch through `EnhancedCommandBus` / `EnhancedQueryBus`, whose `execute` returns `Promise<TResult>` instead of `any`.
- `@CommandHandler` / `@QueryHandler` remain imported from `@nestjs/cqrs`: these decorators have no equivalent in the shared library, and they are wiring rather than types.
- Each command and query declares a zod schema `XxxInput` and parses it in its constructor.
- Each module exposes an `XxxApplicationModule` that imports `XxxInfrastructureModule.register()` and registers its handlers.

## 6. React / Next.js

- Use strict TypeScript.
- No business logic in UI components.
- See `.claude/frontend/CLAUDE.md` for detailed frontend architecture rules.
- See `docs/architecture/domain-driven-frontend.md` for architecture documentation.
- **Image assets in a Next.js app**: max **1920×1920 px** and ideally <2 Mpx per file. Next.js hardcodes a short sharp timeout when generating blur placeholders, which makes the build fail on large images. File size in KB is not a reliable signal — only **pixel count** matters.

## 7. GraphQL

- Code-first with Apollo. GraphQL types wrap the aggregate and expose getters (`RaceType`, `RaceFieldType`).
- Resolvers are thin transport adapters: extract args, delegate to a single command/query via the bus, map the result to the GraphQL type. No orchestration logic in resolvers (no fan-out, fallback resolution, merge/sort/slice, multi-source error handling). That logic belongs in an application-layer query handler of a BFF feature lib.
  - `@ResolveField` that only loads via a dataloader and maps to a type is fine as-is.
- **Cross-module data is stitched by the BFF, never denormalized into a module's result.** A module returns the ids of what it references (`userId`, `runnerIdList`); a `@ResolveField` on the GraphQL type turns them into the real type through the dataloaders (`UserDataLoader` → `PlayerType`). Never expose flattened labels like `userPseudo`, and never let a module's repository query tables owned by another module to fill them.
- **No business logic in resolvers — a resolver only: (1) extracts args, (2) checks authorizations, (3) calls a query/command via the bus, (4) maps the result to the GraphQL type.** Anything else (a rule, a computation, a decision) belongs elsewhere.
  - **Authorization is never inlined.** Authentication and roles go through guards (`AuthGuard`, `AdminGuard`); rules tied to the business (league owner, private league visibility, predictions revealed after the lock) are domain methods or assertions (`league.assertViewableBy(actor)`), called by the handlers.
- Domain errors thrown in field resolvers go through the same filters thanks to `fieldResolverEnhancers: ['filters']`.
- Clients define their own graphql queries/mutation with graphql files alongside the typescript file using it.
- Use codegen in clients to generate graphql apollo hooks.
- Run `npx nx run backend-web:schema-generate` when graphql code is affected to update `apps/backend/web/output/schema.graphql`.
- Run `npx nx affected -t codegen` when graphql code is affected to update clients.
- Naming conventions:
  - Component `MyComponent.ts`, graphql file `MyComponent.graphql`, query/mutation `MyComponent`, `MyComponentGetThis`, or `MyComponentMutateThat`.
  - Hook `useMyHook.ts`, graphql file `useMyHook.graphql`, query/mutation `useMyHook`, `useMyHookGetThis`, or `useMyHookMutateThat`.

## 8. Design

- We use tailwindcss for styling.
- The design system library contains only components without business logic (generic, domain-agnostic).
- Domain-specific UI components live in `modules-frontend/<module>/ui/`, not in the design system.
- SCSS imports: path aliases (e.g., `@trail/...`) do not work in SCSS files. Use relative paths instead.

## 9. Monitoring

- Every application must have Sentry instrumentation configuration (not wired yet).
- Use `MonitoringLogger` from `@trail/shared/monitoring/util-logger` for all application logging. Always provide a `LoggerContext` with relevant business IDs.
- Logging is part of the development process: every command, query, saga, domain service, and job must include relevant logs.

## 10. Conventional Commits

- All commits must follow [Conventional Commits](https://www.conventionalcommits.org/), checked by `@commitlint/config-conventional`.
- Format: `<type>(<scope>): <subject>`
  - `<type>` is required and lowercase. Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`, `revert`.
  - `<scope>` is optional and lowercase (e.g. module name, area: `race`, `scoring`, `league`, `auth`).
  - `<subject>` is lowercase, imperative, no trailing period, ≤ 72 chars.
- Breaking changes: append `!` after the type/scope (e.g. `feat(api)!: drop legacy mutation`) and/or include a `BREAKING CHANGE:` footer.
- Examples:
  - `feat(league): add private leagues with invite codes`
  - `fix(race): load every field when getting a race by field id`
  - `refactor(scoring): extract LeaderboardCalculator`
- Keep commits focused: one logical change per commit. Avoid mixing refactor + feature in the same commit.

## NX monorepo

- Run `npx nx format:write` after finishing to edit files and before commit.
- Run `npx nx run-many -t lint test build` to make sure every project lints, tests and builds.
- Generate js lib with command `npx nx g @nx/js:lib libs/folder/my-library --name=folder-my-library --importPath=@trail/folder/my-library --strict=true --bundler=tsc --unitTestRunner=jest --linter=eslint`. Keep `--strict=true`, and check the generated `tsconfig.json` actually carries it.
- NX projects, or libs, must not have their own modules: no dependencies in the package.json file of a nx project, no lint rule `@nx/dependency-checks`. Remove them after generating a lib, and add `coverageThreshold` to its `jest.config.cts`.
