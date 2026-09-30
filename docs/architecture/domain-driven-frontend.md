# Frontend Architecture Guide

This repository follows a hybrid architecture combining:

- horizontal shared layers
- vertical feature modules

This architecture keeps the codebase scalable, readable and maintainable.

---

# Core Principles

### Design system first

Reusable UI primitives live in the design system.

### Shared abstractions

Cross-application logic lives in shared libraries.

### Feature modules

Business features are implemented in vertical modules.

### Application shell

The shell defines layout and global UI structure.

### Applications orchestrate everything

Apps compose modules, shell, and shared libraries.

---

# Key Architectural Concepts

## Smart vs Dumb Components

We distinguish two types of components:

### Dumb (UI) components

- Pure rendering
- Receive data via props
- No business logic
- No orchestration

### Smart components (Containers)

- Orchestrate logic
- Use hooks and adapters
- Transform data
- Pass props to UI

👉 Rule: **UI displays, containers decide**

---

## Dependency Rule (Critical)

Dependencies must always flow downward:

apps
↓
shell
↓
modules-frontend
↓
shared
↓
design system (ui-react)

Forbidden:

- shared importing modules ❌
- design system importing anything ❌
- circular dependencies ❌

---

## Placement Rule (Very Important)

👉 A file must live in the **highest layer of its dependencies**

Examples:

| Uses            | Must live in |
| --------------- | ------------ |
| shared only     | shared       |
| shared + UI     | shell        |
| domain + shared | modules      |
| everything      | app          |

---

# Repository Structure

apps/
spa/
ssr/www/

libs/
shared/
design/
ui-react/
ui-component-react/

```
locale/
socials/
apps/
```

modules-frontend/
race/
league/

shell/
fantrail/

---

# Design System

Location:
libs/shared/design/ui-react

Purpose:

- pure UI primitives
- reusable across applications

Rules:

- no business logic
- no domain knowledge
- no adapters
- no API dependencies

---

# Shared Libraries

Location:
libs/shared

Purpose:
Cross-application logic and abstractions.

Examples:

- locale adapters
- authentication
- formatting (currency, dates)
- global hooks

---

## Important Rule

👉 Shared must remain **headless**

Meaning:

- JSX allowed ONLY for technical components
- no UI components
- no branding
- no feature logic

---

## Adapters

Adapters expose:

- state (locale, auth, etc.)
- actions (setters)
- utilities (t, formatters)

Example:

type LocaleAdapter = {
locale: {
country: string;
language: string;
};
setLocale: (locale) => void;
t: (key: string) => string;
};

---

## Shared vs Domain (Important Distinction)

| Type            | Goes in          |
| --------------- | ---------------- |
| Generic utility | shared           |
| Business logic  | modules-frontend |

Examples:

- formatCurrency → shared
- getBonusTypeLabel → domain

---

# Feature Modules (Domain)

Location:
libs/modules-frontend/<feature>

Each module represents a business feature.

---

## Structure

<feature>/
lang/
mappers/
logic/
ui/
containers/

---

## Lang Layer

- translation keys
- translations per language

---

## Mappers

- pure functions
- no React
- no adapters

---

## Logic (Hooks)

- uses adapters
- uses mappers
- no UI

---

## UI

- dumb components
- domain-specific naming allowed
- no logic

---

## Containers

- orchestrate logic
- use hooks
- pass props to UI

---

# Shell Layer

Location:
libs/shell

Purpose:

- layout
- branding
- global UI

Examples:

- Header
- Footer
- Layout

---

## Shell Rules

- can use shared + modules
- can contain containers
- must not contain business logic
- must not expose domain concepts (enums, rules)

---

# Important: Containers in Shell

Containers belong in **shell when they depend on UI**

Example:

- IntlMenuContainer → shell
- FooterContainer → shell

Reason:

They depend on:

- shared hooks ✔️
- shell UI ✔️

Putting them in shared would create circular dependencies ❌

---

# Hooks Usage Rules

## Allowed in UI

- simple hooks (e.g. useIntlAdapter)
- no transformation
- no orchestration

## Require Container

- multiple hooks
- state management
- routing / side effects
- data transformation

---

# Domain Leakage Rule

👉 UI must never understand domain concepts

❌ Bad:
if (country === CountryEnum.FR)

✅ Good:
const options = useCountryOptions();

---

# Cross-cutting Features

These are NOT domain features.

They belong in:

shared/
locale/
socials/
auth/

---

## Pattern for Cross-cutting Logic

shared → exposes hooks
shell → composes with UI

---

## Example: Intl Menu

shared/locale
useCountryOptions
useLanguageOptions

shell
IntlMenu (UI)
IntlMenuContainer (logic)

---

## Example: Social Links

shared/socials
getSocialNetworkUrlForCountry
useSocialLinks

shell
FooterSocialList (UI)
FooterContainer (logic)

---

# Single Source of Truth

All computed data must come from shared/domain:

- country options
- language options
- social links

Never duplicate logic in apps.

---

# Applications

Location:
apps/

Responsibilities:

- bootstrap
- providers
- routing
- data fetching
- composition

---

# SCSS Imports

Use relative paths only.

---

# Decision Guide

## Where should code go?

| Type            | Location      |
| --------------- | ------------- |
| UI primitive    | design system |
| Domain UI       | modules       |
| Cross-app logic | shared        |
| Business logic  | modules       |
| Layout          | shell         |
| Composition     | apps          |

---

# Final Rules

1. Shared is headless
2. UI is dumb
3. Containers orchestrate
4. Domain contains business logic only
5. Shell contains UI + composition
6. No circular dependencies
7. No domain leakage into UI

---

# Key Insight

👉 Do not share components
👉 Share behavior and logic
