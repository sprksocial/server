# Agent Guidelines for Spark AppView

## Commands

- **Format**: `deno fmt`
- **Lint**: `deno lint`
- **Test all**: `deno test -P`
- **Test single**: `deno test -P tests/main_test.ts`
- **Dev**: `deno task dev` (requires MongoDB)
- **Codegen**: `deno task codegen` (generate types from lexicons)

## Code Style

- **Runtime**: Deno with TypeScript, imports use JSR/npm prefixes
- **Imports**: Use absolute imports from root (e.g., `../../../lex/index.ts`),
  group by external/internal
- **Types**: Explicit interface definitions, use TypeScript interfaces over
  types. Avoid using `any` type.
- **Naming**: camelCase for variables/functions, PascalCase for
  types/interfaces, UPPER_CASE for constants. Always use double quotes.
- **Error handling**: Use InvalidRequestError from `@atp/xrpc-server`, log
  errors before throwing
- **Patterns**: Pipeline pattern (skeleton → hydration → presentation) for
  endpoints in `api/`, plugin architecture for indexing in
  `data-plane/indexing/`
- **Database**: Mongoose models with explicit schemas, use findOneAndUpdate with
  upsert for idempotency. Only interact with database directly in the
  `data-plane/` directory, otherwise use the `DataPlane` API.
