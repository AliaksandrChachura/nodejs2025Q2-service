# Step-by-Step Guide to Start the Project

## Prerequisites

Before starting, make sure you have the following installed:

1. **Docker Desktop** - [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
   - Make sure Docker Desktop is running before proceeding
   - You can verify by running: `docker --version`

2. **Node.js** (optional, for local development) - Version >= 22.14.0
   - [Download Node.js](https://nodejs.org/)

## Starting the Project with Docker (Recommended)

### Step 1: Navigate to Project Directory

```bash
cd /path/to/nodejs2025Q2-service
```

### Step 2: Create Environment File (Optional)

If you need to customize environment variables, create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` if needed. The default values should work for basic setup.

### Step 3: Start Docker Desktop

Make sure Docker Desktop is running:
- On macOS: Open Docker Desktop from Applications
- On Windows: Start Docker Desktop from Start Menu
- On Linux: Start Docker service: `sudo systemctl start docker`

Verify Docker is running:
```bash
docker ps
```

### Step 4: Build and Start the Application

```bash
docker compose up --build
```

This command will:
- Build the Docker image
- Start the container
- Run the NestJS application in development mode

**Note:** The first time you run this, it may take a few minutes to download dependencies and build the image.

### Step 5: Verify the Application is Running

Once you see the log message:
```
[NestApplication] Nest application successfully started
```

The application is ready! You can now:

- **Access the API:** http://localhost:4000
- **View API Documentation (Swagger):** http://localhost:4000/doc
- **Test an endpoint:** http://localhost:4000/user (should return `[]`)

### Step 6: View Logs (Optional)

To see the application logs in real-time:

```bash
docker compose logs -f app
```

Press `Ctrl+C` to stop viewing logs.

### Step 7: Stop the Application

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

If you prefer to run the application locally without Docker:

### Step 1: Install Dependencies

```bash
npm install --legacy-peer-deps
```

### Step 2: Set Up Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Update the `DATABASE_URL` if you're using a local PostgreSQL database.

### Step 3: Set Up Prisma (if using database)

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

## Common Commands

### Docker Commands

```bash
# Start containers in background
docker compose up -d

# View logs
docker compose logs -f app

# Stop containers
docker compose down

# Rebuild and restart
docker compose up --build

# Execute command in container
docker compose exec app sh
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
│   └── main.ts            # Application entry point
├── prisma/                # Prisma schema
│   └── schema.prisma
├── test/                  # E2E tests
├── docker-compose.yml     # Docker Compose configuration
├── Dockerfile             # Docker image definition
├── package.json           # Dependencies and scripts
└── .env.example           # Environment variables template
```

---

## Next Steps

1. Explore the API documentation at http://localhost:4000/doc
2. Test the endpoints using the Swagger UI
3. Check out the test files in the `test/` directory
4. Review the Prisma schema in `prisma/schema.prisma`

---

## Support

If you encounter any issues:
1. Check the logs: `docker compose logs app`
2. Verify all prerequisites are installed
3. Ensure Docker Desktop is running
4. Check that ports 4000 (and 5432 if using database) are available
