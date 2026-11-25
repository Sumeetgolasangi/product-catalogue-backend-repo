# Express Backend – Product Catalogue API

A modular, production-style REST API built with **Node.js, Express, TypeScript, and Zod**.

The backend powers the Product Catalogue application by providing product discovery, category filtering, product search, product details, and customer enquiry submission.

The application follows a layered architecture that separates HTTP request handling, business logic, validation, external integrations, and infrastructure concerns.

It is designed to be maintainable, testable, and extensible, allowing external services and data providers to be replaced without changing the core business logic.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [External API Integration](#external-api-integration)
- [Email Integration](#email-integration)
- [API Documentation](#api-documentation)
- [Request and Response Examples](#request-and-response-examples)
- [Validation](#validation)
- [Caching Strategy](#caching-strategy)
- [Error Handling](#error-handling)
- [Security](#security)
- [Testing Strategy](#testing-strategy)
- [Running Tests](#running-tests)
- [Code Quality and Production Build](#code-quality-and-production-build)
- [Architecture Decisions](#architecture-decisions)
- [Future Improvements](#future-improvements)

---

## Overview

The Product Catalogue Backend provides REST APIs for the React frontend application.

Customers can browse products, search the catalogue, explore product categories, view product details, and submit enquiries.

The backend retrieves product information from the public Fake Store API and provides a consistent API interface to the frontend.

Customer enquiries are processed through a configurable email integration.

### Application Responsibilities

- Retrieve and serve product information.
- Filter products by category.
- Search products by keywords.
- Identify and return featured products.
- Retrieve individual product details.
- Validate and process customer enquiries.
- Send enquiry notifications through the configured email provider.
- Handle errors consistently.
- Protect endpoints with appropriate security middleware.

### Data Source

The application currently uses the public Fake Store API:

https://fakestoreapi.com

**Important:** Product data is not stored in a local database. The backend retrieves data from the external API and caches successful responses in memory.

---

## Features

### Product Catalogue

- Retrieve all available products.
- Retrieve featured products.
- Search products using keywords.
- Filter products by category.
- Retrieve product details using product ID.
- Retrieve available product categories.

### External API Integration

- Integration with Fake Store API.
- Configurable upstream API URL.
- Request timeout handling.
- Runtime response validation using Zod.
- In-memory caching to reduce external API requests.
- Centralized upstream error handling.

### Customer Enquiries

- Submit product enquiries.
- Validate enquiry request payloads.
- Send email notifications.
- Support console and SMTP email providers.
- Include honeypot validation to reject automated submissions.
- Apply rate limiting to enquiry submissions.

### Application Architecture

- Layered architecture.
- Controllers for HTTP request and response handling.
- Services for business logic.
- Routes for endpoint registration.
- Middleware for centralized error handling.
- Infrastructure adapters for external integrations.
- Dependency injection for testability.
- Shared API contracts.

### Security

- Helmet security headers.
- Configurable CORS.
- Request body size restrictions.
- Enquiry endpoint rate limiting.
- Input validation using Zod.
- Safe error responses.

### Automated Testing

- Unit tests using Vitest.
- HTTP integration/E2E tests using Supertest.
- Mocked external dependencies.
- Independent testing of services, controllers, adapters, and middleware.

---

## Technology Stack

| Technology | Purpose |
|---|---|
| Node.js 20+ | JavaScript runtime |
| TypeScript | Static typing |
| Express 4 | REST API framework |
| Zod | Request and response validation |
| Fake Store API | External product data provider |
| Nodemailer | Email integration |
| Helmet | HTTP security headers |
| CORS | Cross-origin request configuration |
| express-rate-limit | API rate limiting |
| Vitest | Unit and integration testing |
| Supertest | HTTP API testing |
| npm Workspaces | Monorepo dependency management |

---

## Architecture

The backend follows a layered architecture based on separation of concerns.

Each layer has a clearly defined responsibility.

### High-Level Architecture

```text
                  React Frontend
                        |
                        |
                  HTTP Requests
                        |
                        v
                 Express Routes
                        |
                        v
                   Controllers
                        |
                        v
                    Services
                        |
               +--------+--------+
               |                 |
               v                 v
         ProductSource        EmailSender
               |                 |
               v                 v
          FakeStoreAdapter    EmailAdapter
               |                 |
               v                 v
          Fake Store API      SMTP / Console
```

### Layer Responsibilities

#### 1. Routes

Routes define the HTTP endpoints and connect them to the appropriate controller methods.

Responsibilities:
- Register API endpoints.
- Define HTTP methods.
- Connect requests to controllers.
- Apply route-specific middleware.

#### 2. Controllers

Controllers handle incoming HTTP requests and generate HTTP responses.

Responsibilities:
- Extract request parameters and body data.
- Validate incoming request data.
- Invoke the appropriate service.
- Return appropriate HTTP status codes.
- Forward unexpected errors to centralized error middleware.

Controllers should not contain core business logic.

#### 3. Services

Services contain application and business logic.

Responsibilities:
- Retrieve product information.
- Filter and search products.
- Rank featured products.
- Process customer enquiries.
- Coordinate external integrations through interfaces.

Services should not depend directly on Express request or response objects.

#### 4. Infrastructure

Infrastructure contains implementations of external dependencies.

Responsibilities:
- Communicate with Fake Store API.
- Handle upstream timeouts and failures.
- Validate external API responses.
- Cache product information.
- Send enquiry emails through the configured provider.

#### 5. Middleware

Middleware handles cross-cutting application concerns.

Responsibilities:
- Centralized error handling.
- Unknown route handling.
- Security-related request processing.
- Request-level protections.

#### 6. Shared Contracts

The contracts package contains shared Zod schemas and inferred TypeScript types.

This ensures consistent data structures and validation rules across the frontend and backend.

---

## Project Structure

```text
express-backend-production/
│
├── apps/
│   └── api/
│       │
│       └── src/
│           │
│           ├── controllers/
│           │   ├── catalogue.controller.ts
│           │   └── enquiry.controller.ts
│           │
│           ├── services/
│           │   ├── catalogue.service.ts
│           │   └── enquiry.service.ts
│           │
│           ├── routes/
│           │   ├── catalogue.routes.ts
│           │   └── enquiry.routes.ts
│           │
│           ├── middleware/
│           │   ├── error.middleware.ts
│           │   └── not-found.middleware.ts
│           │
│           ├── infrastructure/
│           │   ├── adapters/
│           │   │   ├── fakestore.adapter.ts
│           │   │   └── email.adapter.ts
│           │   │
│           │   └── ports.ts
│           │
│           ├── tests/
│           │   ├── fixtures/
│           │   │
│           │   ├── unit/
│           │   │   ├── services/
│           │   │   ├── controllers/
│           │   │   ├── middleware/
│           │   │   ├── adapters/
│           │   │   └── config.test.ts
│           │   │
│           │   └── e2e/
│           │       ├── catalogue.e2e.test.ts
│           │       ├── enquiry.e2e.test.ts
│           │       └── health.e2e.test.ts
│           │
│           ├── app.ts
│           ├── server.ts
│           ├── config.ts
│           └── common.errors.ts
│
├── packages/
│   └── contracts/
│       └── src/
│           └── index.ts
│
├── .env.example
├── package.json
├── package-lock.json
└── README.md
```

### Folder Responsibilities

| Folder | Responsibility |
|---|---|
| `controllers` | HTTP request and response handling |
| `services` | Application and business logic |
| `routes` | Express route definitions |
| `middleware` | Error handling and shared request middleware |
| `infrastructure/adapters` | External API and email implementations |
| `infrastructure/ports.ts` | Interfaces for external dependencies |
| `tests/fixtures` | Reusable test data |
| `tests/unit` | Isolated unit tests |
| `tests/e2e` | HTTP-level integration tests |
| `app.ts` | Express application factory |
| `server.ts` | Application entry point |
| `config.ts` | Environment configuration |
| `common.errors.ts` | Shared application errors |
| `packages/contracts` | Shared Zod schemas and TypeScript types |

---

## Prerequisites

Make sure the following tools are installed:

- Node.js 20 or newer.
- npm 10 or newer.
- Git.

Verify your installation:

```bash
node --version
npm --version
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
```

### 2. Navigate to the backend project

```bash
cd express-backend-production
```

### 3. Install dependencies

Run the command from the repository root:

```bash
npm install
```

### 4. Configure environment variables

Create your local environment file.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**macOS / Linux:**

```bash
cp .env.example .env
```

### 5. Update environment variables

The default values are suitable for local development.

Update `.env` if you need to configure the API port, external API URL, cache duration, CORS origin, or email provider.

---

## Environment Configuration

The application uses environment variables for configuration.

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `4000` | Backend HTTP server port |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed frontend origin(s), comma-separated |
| `FAKESTORE_BASE_URL` | `https://fakestoreapi.com` | External product API base URL |
| `PRODUCT_CACHE_TTL_SECONDS` | `300` | Product cache lifetime in seconds |
| `EMAIL_PROVIDER` | `console` | Email provider: `console` or `smtp` |
| `SALES_INBOX_EMAIL` | `sales@example.com` | Destination for enquiry emails |
| `EMAIL_FROM` | `catalogue@example.com` | Sender email address |
| `SMTP_HOST` | Empty | SMTP server hostname |
| `SMTP_PORT` | `587` | SMTP server port |
| `SMTP_USER` | Empty | SMTP authentication username |
| `SMTP_PASS` | Empty | SMTP authentication password |

### Example `.env`

```env
PORT=4000

CORS_ORIGIN=http://localhost:5173

FAKESTORE_BASE_URL=https://fakestoreapi.com

PRODUCT_CACHE_TTL_SECONDS=300

EMAIL_PROVIDER=console

SALES_INBOX_EMAIL=sales@example.com

EMAIL_FROM=catalogue@example.com

SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
```

**Security note:** Never commit `.env` files, SMTP credentials, or other sensitive configuration values to source control.

---

## Running the Application

### Development Mode

From the repository root:

```bash
npm run dev
```

The API starts on:

```text
http://localhost:4000
```

### Health Check

```http
GET http://localhost:4000/api/health
```

Expected response:

```json
{
  "status": "ok"
}
```

### Products Endpoint

```http
GET http://localhost:4000/api/products
```

### Production Mode

First compile the TypeScript application:

```bash
npm run build
```

Then start the compiled application:

```bash
npm start
```

---

## Frontend and Backend Integration

The React frontend and Express backend run as separate applications during local development.

| Application | URL | Responsibility |
|---|---|---|
| React + Vite | `http://localhost:5173` | User interface |
| Express API | `http://localhost:4000` | Backend services |

The frontend uses the Vite development proxy to forward API requests to the backend.

Example:

```text
Browser
   |
   v
http://localhost:5173/api/products
   |
   v
Vite Proxy
   |
   v
http://localhost:4000/api/products
   |
   v
Express API
```

This allows the frontend to use relative API URLs without hardcoding the backend address into every request.

If the frontend uses a different port, update `CORS_ORIGIN` accordingly.

---

## External API Integration

The application retrieves product information from the Fake Store API.

**External API:**

https://fakestoreapi.com

**Products endpoint:**

```http
GET https://fakestoreapi.com/products
```

### Integration Location

```text
apps/api/src/infrastructure/adapters/fakestore.ts
```

### Product Data Flow

1. The catalogue service requests product data through the `ProductSource` interface.
2. The Fake Store adapter sends a request to the configured external API.
3. The upstream response is validated against the shared Zod `ProductSchema`.
4. Valid product data is stored in the in-memory cache.
5. Subsequent requests reuse the cached product data while the cache remains valid.
6. Product lookup by ID, category filtering, and search are derived from the loaded product list.

### Timeout and Failure Handling

- Upstream requests have a 5-second timeout.
- Invalid upstream responses are rejected.
- External API failures are converted into an upstream-unavailable application error.
- The API returns HTTP `503 Service Unavailable` when product data cannot be retrieved.

### Extensibility

The catalogue service depends on the `ProductSource` interface rather than directly depending on Fake Store API.

This makes it possible to replace the external provider with another implementation without changing the catalogue business logic.

---

## Email Integration

The enquiry workflow uses an `EmailSender` interface.

This separates enquiry processing from the underlying email provider.

Two email providers are supported.

### 1. Console Provider

```env
EMAIL_PROVIDER=console
```

This is the default local development configuration.

The formatted enquiry email is printed to the backend console.

It does not send an actual email.

### 2. SMTP Provider

```env
EMAIL_PROVIDER=smtp

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password

SALES_INBOX_EMAIL=sales@example.com
EMAIL_FROM=catalogue@example.com
```

The SMTP adapter uses Nodemailer to send enquiry notifications.

Configure the SMTP settings with valid credentials before enabling SMTP delivery.

---

## API Documentation

All API endpoints are prefixed with:

```text
/api
```

### Endpoint Summary

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check API health |
| GET | `/api/products` | Retrieve products |
| GET | `/api/products/featured` | Retrieve featured products |
| GET | `/api/products/:id` | Retrieve a product by ID |
| GET | `/api/categories` | Retrieve product categories |
| POST | `/api/enquiries` | Submit a product enquiry |

### 1. Health Check

```http
GET /api/health
```

Checks whether the API is running.

### 2. Get All Products

```http
GET /api/products
```

Returns available products.

Optional query parameters:

| Parameter | Description |
|---|---|
| `search` | Search products by keyword |
| `category` | Filter products by category |

Example:

```http
GET /api/products?search=jacket
```

```http
GET /api/products?category=men
```

### 3. Get Featured Products

```http
GET /api/products/featured
```

Returns up to five featured products ranked using product rating and rating count.

### 4. Get Product by ID

```http
GET /api/products/1
```

Returns the product matching the supplied ID.

Returns `404 Not Found` if the product does not exist.

### 5. Get Categories

```http
GET /api/categories
```

Returns the available product categories.

### 6. Submit Product Enquiry

```http
POST /api/enquiries
```

Submits a customer enquiry for a product.

The request is validated using the shared enquiry schema before processing.

---

## Request and Response Examples

### Get Products

**Request:**

```http
GET /api/products
```

**Response:**

The response contains the available products in the application's product response format.

### Search Products

**Request:**

```http
GET /api/products?search=jacket
```

**Response:**

Returns products matching the supplied search keyword.

### Filter Products by Category

**Request:**

```http
GET /api/products?category=men
```

**Response:**

Returns products belonging to the selected category.

### Submit an Enquiry

**Request:**

```http
POST /api/enquiries
Content-Type: application/json
```

**Request body:**

```json
{
  "productId": 1,
  "productTitle": "Example product",
  "name": "Alex",
  "email": "alex@example.com",
  "phone": "+1 555 0100",
  "message": "I would like more information about this product.",
  "website": ""
}
```

The `phone` and `website` fields are optional.

The `website` field is a honeypot field and must remain empty for normal submissions.

A non-empty honeypot value is rejected.

**Note:** The exact success response is determined by the enquiry controller implementation.

---

## Validation

The application uses Zod for request validation.

Shared schemas are maintained in:

```text
packages/contracts/src/index.ts
```

### Validation Responsibilities

- Validate incoming request parameters.
- Validate query parameters.
- Validate enquiry payloads.
- Validate external product API responses.
- Infer TypeScript types from Zod schemas.

Using shared contracts reduces duplicated validation definitions and helps keep the frontend and backend aligned.

### Honeypot Validation

The enquiry request includes a `website` field.

Normal users leave this field empty.

If the field contains a value, the backend rejects the request as an invalid submission.

This provides a basic mechanism for detecting automated form submissions.

---

## Caching Strategy

The backend uses in-memory caching for product information.

### Cache Configuration

```env
PRODUCT_CACHE_TTL_SECONDS=300
```

The default cache duration is 300 seconds (5 minutes).

### Cache Workflow

```text
Incoming Product Request
          |
          v
     Check Cache
          |
     +----+----+
     |         |
   Valid     Expired
     |         |
     v         v
Return Cache  Call Fake Store API
               |
               v
          Validate Data
               |
               v
          Update Cache
               |
               v
          Return Products
```

### Benefits

- Reduces repeated external API requests.
- Improves response time for cached product data.
- Reduces dependency on upstream API availability for requests during the cache lifetime.

### Cache Limitations

- Cache data is stored in application memory.
- Restarting the API clears the cache.
- Multiple application instances maintain separate caches.
- This implementation does not provide distributed cache synchronization.

---

## Error Handling

The application uses centralized error handling to provide consistent API responses.

### Standard Error Response

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "A safe description of the error"
  }
}
```

### Common HTTP Errors

| HTTP Status | Error Code | Description |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Request data failed validation |
| 400 | `INVALID_SUBMISSION` | Enquiry honeypot field was populated |
| 404 | `NOT_FOUND` | Requested product does not exist |
| 404 | `ROUTE_NOT_FOUND` | Requested API route does not exist |
| 503 | `UPSTREAM_UNAVAILABLE` | External product API is unavailable or returned invalid data |
| 500 | `INTERNAL_SERVER_ERROR` | Unexpected server error |

### Error Handling Flow

1. A route receives an HTTP request.
2. The controller validates the incoming data.
3. The service executes the required operation.
4. Errors are forwarded to the centralized error middleware.
5. The middleware converts known application errors into consistent HTTP responses.
6. Unexpected errors are handled without exposing internal implementation details.

---

## Security

The application includes several baseline security protections.

### Helmet

Helmet adds security-related HTTP headers.

### CORS

CORS controls which frontend origins are permitted to access the API.

The allowed origin is configured using:

```env
CORS_ORIGIN=http://localhost:5173
```

Multiple origins can be supplied as comma-separated values.

### Rate Limiting

The enquiry endpoint has a rate limit of:

- 10 requests.
- 15-minute time window.
- Applied per client IP.

This helps reduce repeated automated enquiry submissions.

### Request Body Size

JSON request bodies are restricted to 10 KB to avoid unnecessarily large payloads.

### Input Validation

Zod validates incoming requests before business logic is executed.

### Credentials

SMTP credentials and other sensitive configuration values are loaded from environment variables and should never be committed to source control.

---

## Testing Strategy

The project uses Vitest and Supertest to validate the backend at different levels.

The testing approach focuses on isolating business logic while also verifying the complete HTTP request-response flow.

### 1. Unit Testing

**Tool:** Vitest

Unit tests verify individual application components independently.

Coverage includes:

- Catalogue service.
- Enquiry service.
- Product controller.
- Enquiry controller.
- Fake Store adapter.
- Email adapter.
- Configuration validation.
- Error middleware.
- Not-found middleware.

External dependencies are mocked to keep unit tests deterministic.

### 2. HTTP Integration / E2E Testing

**Tools:** Vitest and Supertest

These tests exercise the Express application through actual HTTP requests without requiring a separately running server.

Coverage includes:

- Health check endpoint.
- Product listing endpoint.
- Product search.
- Category filtering.
- Featured products.
- Product detail lookup.
- Invalid product ID.
- Enquiry submission.
- Invalid enquiry payload.
- Honeypot validation.
- Error response handling.

### 3. Test Fixtures

Reusable test data is maintained in:

```text
apps/api/src/tests/fixtures/
```

Fixtures help maintain consistent test inputs across different test suites.

### 4. Dependency Injection

The Express application exposes an application factory:

```ts
createApp()
```

It accepts injected dependencies so tests can supply mock services instead of calling real external integrations.

This allows testing without:

- A live Fake Store API.
- A configured SMTP server.
- A separately running backend server.
- A fixed local port.

### Test Documentation

Keep detailed test cases, coverage information, and execution instructions in the backend test documentation.

---

## Running Tests

Run commands from the repository root.

### Run All Tests

```bash
npm test
```

### Run Unit Tests

```bash
npm run test:unit
```

### Run HTTP E2E Tests

```bash
npm run test:e2e
```

### Type Checking

```bash
npm run typecheck
```

### Production Build

```bash
npm run build
```

### Start Production Build

```bash
npm start
```

The production application should be built before running `npm start`.

---

## Code Quality and Production Build

Before submitting changes, run:

```bash
npm test
npm run typecheck
npm run build
```

The project follows these development practices:

- Strict separation of responsibilities.
- TypeScript for static type checking.
- Shared Zod contracts.
- Dependency injection.
- Centralized error handling.
- Reusable infrastructure adapters.
- Isolated unit tests.
- HTTP-level integration tests.
- Environment-based configuration.

---

## Architecture Decisions

### 1. Layered Architecture

Controllers, services, routes, and adapters are separated to make the application easier to maintain and test.

### 2. Dependency Inversion

Business logic depends on interfaces rather than concrete external integrations.

For example:

- `ProductSource` abstracts product data retrieval.
- `EmailSender` abstracts email delivery.

This allows the application to change external providers without rewriting business logic.

### 3. External Product Provider

Fake Store API is used as the initial product data source to keep the MVP simple.

A separate product database is not required for the current implementation.

### 4. In-Memory Caching

Product data is cached to reduce unnecessary external API requests and improve response time.

### 5. Configurable Email Provider

The email integration supports console logging during development and SMTP delivery when configured.

### 6. Application Factory

The `createApp()` function separates Express application configuration from server startup.

This improves testability and allows the application to be instantiated with mock dependencies.

### 7. Shared Contracts

The contracts package provides reusable validation schemas and inferred types, reducing inconsistencies between frontend and backend.

### 8. Independent Testing

Unit tests and HTTP tests do not require live external services, making automated testing more predictable.

---

## Future Improvements

The following enhancements can be considered beyond the current MVP:

- PostgreSQL database integration for persistent product data.
- Redis caching for distributed application deployments.
- Pagination for product listings.
- Advanced filtering and sorting.
- Product inventory management.
- Authentication and authorization.
- Structured logging with correlation IDs.
- API versioning.
- Swagger / OpenAPI documentation.
- Request tracing and monitoring.
- Retry and circuit-breaker strategies for external services.
- Docker-based deployment.
- CI/CD pipeline integration.
- Integration with a production email provider.

---

## Development Guidelines

When introducing new functionality:

1. Keep HTTP request and response handling inside controllers.
2. Keep business logic inside services.
3. Register endpoints inside route files.
4. Keep external integrations inside infrastructure adapters.
5. Define external dependency interfaces in the ports layer.
6. Reuse shared contracts for validation and TypeScript types.
7. Add unit tests for new services, controllers, and adapters.
8. Add HTTP integration tests for new or modified endpoints.
9. Handle failures through centralized error middleware.
10. Run tests, type checking, and the production build before submitting changes.

---

## License

This project was developed as a Product Catalogue API and technical demonstration.

Add the appropriate license information before public distribution.
