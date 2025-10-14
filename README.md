# Pet Store API Testing

A comprehensive API testing framework built with Playwright, TypeScript, Zod, and Faker.

## Features

- ✅ **Playwright** - Modern API testing framework
- ✅ **TypeScript** - Type-safe test development
- ✅ **Zod** - Schema validation for API responses
- ✅ **Faker** - Dynamic test data generation
- ✅ **dotenv** - Environment variable management

## Project Structure

```
pet-store-api-testing/
├── tests/
│   └── example.spec.ts      # API test examples
├── schemas/
│   └── example.schema.ts    # Zod validation schemas
├── .gitignore
├── package.json
├── playwright.config.ts      # Playwright configuration
├── tsconfig.json            # TypeScript configuration
└── README.md
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers (optional for API testing):
```bash
npx playwright install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

## Running Tests

Run all tests:
```bash
npm test
```

Run tests in headed mode:
```bash
npm run test:headed
```

Run tests in debug mode:
```bash
npm run test:debug
```

Run tests in UI mode:
```bash
npm run test:ui
```

View test report:
```bash
npm run test:report
```

## Configuration

Edit `playwright.config.ts` to customize:
- Test directory
- Timeout settings
- Reporters
- Base URL
- HTTP headers

## Environment Variables

Configure in `.env` file:
- `BASE_URL` - API base URL (default: https://jsonplaceholder.typicode.com)
- Add any API keys or tokens as needed

## Writing Tests

### Example Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { UserSchema } from '../schemas/example.schema';

test('should create user', async ({ request }) => {
  const newUser = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
  };
  
  const response = await request.post('/users', { data: newUser });
  expect(response.ok()).toBeTruthy();
  
  const data = await response.json();
  const validatedUser = UserSchema.parse(data);
});
```

### Schema Validation

Define schemas in `schemas/` folder:

```typescript
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});
```

## Test Examples Included

- ✅ GET requests with schema validation
- ✅ POST requests with faker data
- ✅ PUT/PATCH requests for updates
- ✅ DELETE requests
- ✅ Error handling (404, etc.)
- ✅ Response header validation
- ✅ Schema validation failure tests

## Contributing

Feel free to add more test cases and schemas as needed for your API testing requirements.

## License

ISC
