# Home Library Service

A NestJS-based REST API service for managing a home library with users, artists, albums, tracks, and favorites. The application uses PostgreSQL as the database (via Prisma ORM) and can be run using Docker or locally.

## Prerequisites

Before starting, make sure you have the following installed:

1. **Docker Desktop** (Recommended) - [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
   - Make sure Docker Desktop is running before proceeding
   - You can verify by running: `docker --version`

2. **Node.js** (optional, for local development) - Version >= 22.14.0
   - [Download Node.js](https://nodejs.org/en/download/) and the npm package manager

3. **Git** - [Download & Install Git](https://git-scm.com/downloads)

## Getting Started

### Downloading

```bash
git clone {repository URL}
cd nodejs2025Q2-service
```

### Starting the Project with Docker (Recommended)

This is the recommended way to run the application. It requires no local PostgreSQL installation - the database runs in a Docker container.

#### Step 1: Create Environment File

If you need to customize environment variables, create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` if needed. The default values should work for basic setup.

#### Step 2: Start Docker Desktop

Make sure Docker Desktop is running:
- On macOS: Open Docker Desktop from Applications
- On Windows: Start Docker Desktop from Start Menu
- On Linux: Start Docker service: `sudo systemctl start docker`

Verify Docker is running:
```bash
docker ps
```

#### Step 3: Build and Start the Application

```bash
docker compose up --build
```

This command will:
- Build the Docker image
- Start the PostgreSQL database container
- Start the application container
- Run the NestJS application in development mode

**Note:** The first time you run this, it may take a few minutes to download dependencies and build the image.

#### Step 4: Verify the Application is Running

Once you see the log message:
```
[NestApplication] Nest application successfully started
```

The application is ready! You can now:

- **Access the API:** http://localhost:4000
- **View API Documentation (Swagger):** http://localhost:4000/doc
- **Test an endpoint:** http://localhost:4000/user (should return `[]`)

#### Step 5: View Logs (Optional)

To see the application logs in real-time:

```bash
docker compose logs -f app
```

Press `Ctrl+C` to stop viewing logs.

#### Step 6: Stop the Application

To stop the application:

```bash
docker compose down
```

To stop and remove volumes (clean restart):

```bash
docker compose down -v
```

---

## Alternative: Running Locally (Without Docker)

**Note:** This requires a local PostgreSQL installation. For the recommended setup, use Docker as described above.

### Step 1: Install Dependencies

```bash
npm install --legacy-peer-deps
```

### Step 2: Set Up Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

**Important:** Update the `DATABASE_URL` to point to your local PostgreSQL installation (e.g., `postgresql://user:password@localhost:5432/dbname?schema=public`). The default `.env.example` uses `db:5432` which only works within Docker containers.

### Step 3: Set Up Prisma

```bash
npx prisma generate
npx prisma migrate dev
```

### Step 4: Start the Application

For development mode (with hot reload):

```bash
npm run start:dev
```

For production mode:

```bash
npm run build
npm run start:prod
```

### Step 5: Access the Application

- **API:** http://localhost:4000
- **Swagger Docs:** http://localhost:4000/doc

---

## Swagger Documentation

After starting the app on port 4000 (default), you can open the OpenAPI documentation in your browser by typing http://localhost:4000/doc/.

The Swagger documentation provides an interactive API testing interface where you can:
- View all available endpoints with detailed descriptions
- See request/response schemas and examples
- Test API endpoints directly from the browser
- Understand data validation rules and error responses

For more information about OpenAPI/Swagger, please visit https://swagger.io/.

---

## Testing

After the application is running, open a new terminal and enter:

### Run All Tests Without Authorization

```bash
npm run test
```

### Run Only One Test Suite

```bash
npm run test -- <path to suite>
```

Example:
```bash
npm run test -- test/users.e2e.spec.ts
```

### Run All Tests With Authorization

```bash
npm run test:auth
```

### Run Only Specific Test Suite With Authorization

```bash
npm run test:auth -- <path to suite>
```

### Other Test Commands

```bash
# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# Debug mode
npm run test:debug
```

---

## Database Migrations

The project uses Prisma for database migrations. All migration commands can be run from the project root.

### Generate and Apply Migration

Creates a new migration from schema changes and applies it:

```bash
npm run migration:generate -- --name migration_name
```

Example:
```bash
npm run migration:generate -- --name add_user_table
```

### Create Empty Migration

Creates an empty migration file without applying it (useful for custom SQL):

```bash
npm run migration:create -- --name migration_name
```

### Run Pending Migrations

Applies all pending migrations (production-safe):

```bash
npm run migration:run
```

### Revert Migration

Marks a migration as rolled back (requires manual rollback SQL):

```bash
npm run migration:revert -- migration_name
```

### Show Migration Status

Shows which migrations have been applied and displays pending migrations:

```bash
npm run migration:show
```

**Note:** When running migrations inside Docker containers, use:
```bash
docker compose exec app npm run migration:show
```

---

## Common Commands

### Docker Commands

```bash
# Start containers in background
docker compose up -d

# View logs
docker compose logs -f app

# View database logs
docker compose logs -f db

# Stop containers
docker compose down

# Rebuild and restart
docker compose up --build

# Execute command in container
docker compose exec app sh

# Access database directly
docker compose exec db psql -U nest -d nestdb
```

### Development Commands

```bash
# Run tests
npm run test

# Run tests with authorization
npm run test:auth

# Lint code
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Start in development mode
npm run start:dev

# Start in production mode
npm run start:prod
```

### Docker Scout (Security Scanning)

Scan Docker images for vulnerabilities:

```bash
npm run docker:scout
```

Or scan a specific image:
```bash
docker scout cves <image-name>
```

---

## Troubleshooting

### Port Already in Use

If port 4000 is already in use:

1. Change the port in `docker-compose.yml`:
   ```yaml
   ports:
     - '4001:4000'  # Change 4001 to any available port
   ```

2. Or stop the process using port 4000:
   ```bash
   # Find process using port 4000
   lsof -i :4000
   # Kill the process (replace PID with actual process ID)
   kill -9 PID
   ```

### Docker Not Running

If you get "Cannot connect to Docker daemon":
- Make sure Docker Desktop is running
- On Linux, you may need to start the Docker service:
  ```bash
  sudo systemctl start docker
  ```

### Container Keeps Restarting

Check the logs to see what's wrong:
```bash
docker compose logs app
```

### Application Not Accessible

1. Verify the container is running:
   ```bash
   docker compose ps
   ```

2. Check if the port is correctly mapped:
   ```bash
   docker compose ps
   # Should show: 0.0.0.0:4000->4000/tcp
   ```

3. Test from inside the container:
   ```bash
   docker compose exec app curl http://localhost:4000/user
   ```

### Database Connection Issues

If you're having trouble connecting to the database:

1. Verify the database container is running:
   ```bash
   docker compose ps db
   ```

2. Check database logs:
   ```bash
   docker compose logs db
   ```

3. Test database connection:
   ```bash
   docker compose exec db psql -U nest -d nestdb -c "SELECT version();"
   ```

4. Verify `DATABASE_URL` in `.env` file points to `db:5432` (for Docker) or `localhost:5432` (for local)

---

## Project Structure

```
nodejs2025Q2-service/
├── src/                    # Source code
│   ├── albums/            # Album module
│   ├── artists/           # Artist module
│   ├── tracks/            # Track module
│   ├── users/             # User module
│   ├── favorites/         # Favorites module
│   ├── prisma/            # Prisma service
│   └── main.ts            # Application entry point
├── prisma/                # Prisma configuration
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
├── test/                  # E2E tests
├── doc/                   # API documentation
│   └── api.yaml           # OpenAPI specification
├── docker-compose.yml     # Docker Compose configuration
├── Dockerfile             # Docker image definition
├── package.json           # Dependencies and scripts
├── prisma.config.ts       # Prisma configuration
└── .env.example           # Environment variables template
```

---

## Next Steps

1. Explore the API documentation at http://localhost:4000/doc
2. Test the endpoints using the Swagger UI
3. Check out the test files in the `test/` directory
4. Review the Prisma schema in `prisma/schema.prisma`
5. Run migrations to set up the database schema

---

## Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging

---

## Support

If you encounter any issues:

1. Check the logs: `docker compose logs app`
2. Verify all prerequisites are installed
3. Ensure Docker Desktop is running
4. Check that ports 4000 (and 5432 if using database) are available
5. Review the troubleshooting section above

---

## License

UNLICENSED
