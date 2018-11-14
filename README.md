# Frontend Package for Ridi Unlimited

## React App Folder Structure

```bash
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
