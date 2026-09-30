# Frontend Architecture Rules (AI-Friendly)

This document defines strict rules for code organization in this repository.

---

# 🔥 Core Principles

1. Separate **UI from logic**
2. Keep **business logic isolated**
3. Avoid **circular dependencies**
4. Share **behavior, not components**
5. Respect **layer boundaries**

---

# 🧠 Architecture Layers

apps → shell → modules-frontend → shared → design-system

---

# 📦 Layer Responsibilities

## Design System (`shared/design/ui-react`)

- UI primitives only
- No business logic
- No hooks
- No adapters

✅ Button, Card, Text
❌ LeaderboardCard, IntlMenu

---

## Shared (`shared/*`)

- Cross-app logic
- Adapters (intl, auth, etc.)
- Generic hooks
- No JSX
- No domain knowledge

✅ useIntlAdapter
✅ formatCurrency
❌ useRaceDisplayName
❌ Scoring logic

---

## Modules (Domain) (`modules-frontend/*`)

- Business logic
- Domain hooks
- Mappers
- Domain UI (dumb)

✅ useRaceDisplayName
✅ getBonusTypeLabelKey
❌ useIntlAdapter implementation
❌ Header / Footer

---

## Shell (`shell/*`)

- Branding
- Layout
- UI composition
- Containers (UI + logic glue)

✅ Header, Footer
✅ IntlMenu (UI)
✅ IntlMenuContainer

❌ Business logic
❌ Domain enums usage

---

## Apps (`apps/*`)

- Providers
- Routing
- Data fetching
- Composition

---

# 🧠 Smart vs Dumb Components

## Dumb Component (UI)

- receives props
- no logic
- no data fetching

```ts
const Card = ({ title }) => <div>{title}</div>;
```

---

## Smart Component (Container)

- uses hooks
- computes data
- passes props

```ts
const CardContainer = () => {
  const title = useTitle();
  return <Card title={title} />;
};
```

---

# ⚠️ Critical Rules

## 1. No Circular Dependencies

❌ shell → shared → shell
❌ shared → modules

---

## 2. Placement Rule

A file belongs to the **highest layer of its dependencies**

| Uses         | Location |
| ------------ | -------- |
| shared only  | shared   |
| shared + UI  | shell    |
| domain logic | modules  |
| everything   | app      |

---

## 3. No Domain Leakage

UI must NOT know business concepts

❌ Bad:

```ts
if (bonus === BonusType.Top5Exact)
```

❌ Bad:

```ts
if (country === CountryEnum.FR)
```

✅ Good:

```ts
const options = useCountryOptions();
```

---

## 4. Shared Must Be Headless

- no JSX
- no UI imports
- no branding

---

## 5. Domain != Shared

| Question              | Answer  |
| --------------------- | ------- |
| Is it business logic? | modules |
| Is it generic?        | shared  |

---

# 🧩 Hooks Rules

## Allowed in UI

- simple adapters
- no transformation

✅ useIntlAdapter
✅ useTheme

---

## Require Container

- multiple hooks
- state (useState)
- routing / side effects
- data transformation

---

# 🧠 Cross-Cutting Features

Not domains:

- locale
- auth
- socials

Location:

shared/locale
shared/auth
shared/socials

---

# 🔁 Standard Pattern

Use this pattern everywhere:

```
mapper → hook → container → UI
```

---

## Example: Intl

shared/locale

- useCountryOptions
- useLanguageOptions

shell

- IntlMenu (UI)
- IntlMenuContainer

---

## Example: Social Links

shared/socials

- getSocialNetworkUrlForCountry
- useSocialLinks

shell

- FooterSocialList (UI)
- FooterContainer

---

# 🧠 Adapter Pattern

Adapters expose:

- state
- actions
- utilities

Example:

```ts
const { locale, setLocale, t } = useIntlAdapter();
```

Adapters are implemented per app (SPA / SSR).

---

# ❌ Anti-Patterns

## UI calling business logic

```ts
const Footer = () => {
  const links = useSocialLinks(); // ❌ too much logic in UI
};
```

---

## Shared importing UI

```ts
import { IntlMenu } from 'shell';

// ❌ forbidden
```

---

## Duplicating logic in apps

```ts
const links = socials.map(...) // ❌ duplication
```

---

## Domain inside shell

```ts
if (raceStatus === RaceStatus.Locked) // ❌
```

---

# ✅ Correct Patterns

## Container in shell

```ts
const FooterContainer = () => {
  const links = useSocialLinks();
  return <Footer links={links} />;
};
```

---

## UI pure

```ts
const Footer = ({ links }) => {
  return links.map(...);
};
```

---

# 🧠 Decision Tree

Where should this code go?

1. Is it UI primitive? → design system
2. Is it domain logic? → modules
3. Is it cross-app logic? → shared
4. Does it combine UI + logic? → shell
5. Is it app-specific orchestration? → apps

---

# 🔥 Golden Rules

- UI displays
- Containers decide
- Shared is headless
- Domain owns business logic
- Shell composes everything

---

# 💡 Final Insight

Do NOT share components.
Share logic, behavior, and contracts.
