# Land Backend - Integrated Land Management System

## What This System Does

The Land Backend is a **NestJS-based API** that manages land title deed applications and related administrative processes. It serves as the backend for an Integrated Land Management System, handling everything from user authentication to title deed application processing, with support for both individual citizens and organizations.

## Mental Model: How the Platform Works

Here's how a typical request flows through the system:

1. **User Request** → A citizen or employee logs in through the authentication system
2. **Authorization** → The system checks their role and permissions using JWT tokens
3. **Business Logic** → Users can create, view, and manage title deed applications
4. **Data Persistence** → All data is stored in PostgreSQL using Prisma ORM
5. **Response** → The API returns structured JSON responses with proper validation

The system supports two types of users:

- **Citizens** (regular users) who submit title deed applications
- **Employees** (administrators) who process and manage applications

## Repository Map

```
land-backend/
├── 📁 src/                          # Main application code
│   ├── 📁 models/                   # Business logic modules
│   │   ├── 📁 auth/                 # Authentication & authorization
│   │   ├── 📁 basedata/             # Reference data (countries, districts, etc.)
│   │   ├── 📁 title-deed-application/     # Core business logic
│   │   └── 📁 title-deed-application-owner/ # Application owners/beneficiaries
│   ├── 📁 common/                   # Shared utilities and configurations
│   │   ├── 📁 database/             # Database connection and Prisma setup
│   │   ├── 📁 guards/               # Authentication guards
│   │   ├── 📁 decorators/           # Custom decorators
│   │   └── 📁 utils/                # Helper functions
│   └── 📁 i18n/                     # Internationalization files
├── 📁 prisma/                       # Database schema and migrations
├── 📁 test/                         # End-to-end tests
├── 📁 docs/                         # 📚 Documentation (you're here!)
├── 📄 docker-compose.yml           # Production container setup
├── 📄 docker-compose.dev.yml       # Development environment
└── 📄 package.json                 # Dependencies and scripts
```

## Who's Who (Team Structure)

- **Backend Team** - Owns the API, database schema, and business logic
- **DevOps Team** - Manages deployment, infrastructure, and monitoring
- **Product Team** - Defines requirements and user stories
- **QA Team** - Ensures quality and testing coverage

_Note: Replace with actual team names and responsibilities_

## Getting Started: Reading Order for New Hires

### 🚀 First Day (Start Here)

1. **[Project Tour](./docs/Orientation/Project-Tour.md)** - Walk through how requests flow
2. **[Service Catalog](./docs/Orientation/Service-Catalog.md)** - Understand what each part does
3. **[Glossary](./docs/Orientation/Glossary.md)** - Learn the domain language

### 🔧 First Week (Build Understanding)

4. **[System Overview](./docs/Architecture/System-Overview.md)** - High-level architecture
5. **[Data Model](./docs/Architecture/Data-Model.md)** - Database structure and relationships
6. **[Key Journeys](./docs/How-To/Key-Journeys.md)** - Common development tasks

### 🛠️ Ongoing Reference

7. **[Runbook Overview](./docs/Operate/Runbook-Overview.md)** - Operations and troubleshooting
8. **[Security Overview](./docs/Security-and-Compliance/Security-Overview.md)** - Security practices
9. **[Contributing Guidelines](./CONTRIBUTING.md)** - Development workflow
10. **[FAQ](./docs/Appendix/FAQ.md)** - Quick answers to common questions

## Quick Start for Developers

```bash
# 1. Clone and setup
git clone <repository-url>
cd land-backend
yarn install

# 2. Setup environment
cp .env.example .env
# Edit .env with your database credentials

# 3. Start development environment
docker-compose -f docker-compose.dev.yml up -d
yarn run prisma migrate dev
yarn run start:dev

# 4. Access the API
# - API: http://localhost:3000
# - Swagger Docs: http://localhost:3000/api/docs
# - Database: localhost:5432
# - MinIO Console: http://localhost:9001
```

## Technology Stack

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with role-based access control
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker & Docker Compose
- **File Storage**: MinIO (S3-compatible)
- **Internationalization**: nestjs-i18n

## Support & Resources

- **API Documentation**: Available at `/api/docs` when running
- **Database Schema**: See `prisma/schema.prisma`
- **Environment Variables**: Check `.env.example`
- **Testing**: Run `yarn test` for unit tests, `yarn test:e2e` for integration tests

---

## Bibliography

This documentation follows established practices from:

- **Diátaxis documentation framework** - Organizing content by tutorials/how-tos/reference/explanations
- **Architecture Decision Records (ADRs)** - Recording major technical decisions with context
- **Service catalogs** - Helping teams navigate complex systems
- **Google Engineering Practices** - Clear reviews and understandable changes

For questions or improvements to this documentation, please create an issue or submit a pull request.
