# RIDI Select

## Requirements

- [Docker](https://www.docker.com/)
- [traefik](https://github.com/ridi/traefik/blob/master/README.md)
- [Yarn](https://yarnpkg.com/) (for development)

## Getting Started

**Set environments**

```sh
$ cp .env.example .env
```

**Serve with TLS**

> First run [traefik](https://github.com/ridi/traefik/blob/master/README.md),

```sh
$ docker-compose up [-d] [--build]
```

## Development

**Install dependencies for IDE**

```sh
$ yarn install --frozen-lockfile
```

**Rebuild docker image, after modifying depencencies**

```sh
$ yarn add/remove [-D] packages
$ docker-compose up --build [--force-recreate]
```

## Directory structure

```
src/app
├── App.tsx*
├── __mockAPIs
├── components*
│   ├── Footer.tsx
│   ├── GNB.tsx
│   ├── LNB.tsx
│   ├── __spec.tsx
│   ├── __stories.tsx
│   └── index.tsx
├── constants
├── env
├── hocs
├── index.tsx*
├── reducers.states.ts
├── reducers.ts
├── routes.tsx
├── scenes*
├── services*
│   ├── book
│   ├── bookList
│   ├── download
│   ├── home
│   ├── myUnlimited
│   ├── review
│   ├── search
│   └── subscription
│   │   ├── actions.ts
│   │   ├── components
│   │   │   ├── SubscriptionHistoryItem.tsx
│   │   │   ├── __stories.tsx
│   │   │   └── index.tsx
│   │   ├── constants.ts
│   │   ├── index.tsx
│   │   ├── reducer.state.ts
│   │   ├── reducer.ts
│   │   ├── requests.ts
│   │   └── sagas.ts
├── types
└── utils
```

- Root `components` is for common componentes like `GNB` and `Footer`.
- Actions, reducers, sagas and components for **specific feature** like `review`, `search`, etc. should be in `services/{feature}` directory.
- All page entry components to use in `routes.tsx` should be in `scenes` directory.
- Tests can be written anywhere needed with filename `__spec.*`.
- Storybook stories can be written anywhere needed with filename `__stories.*`.
