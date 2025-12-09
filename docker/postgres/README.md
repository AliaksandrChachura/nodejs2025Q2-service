# PostgreSQL Docker Setup

This directory contains configuration and initialization scripts for the PostgreSQL database container.

## Dockerfile.postgres

The `Dockerfile.postgres` extends the official `postgres:16-alpine` image and sets up:
- Default environment variables
- Initialization script directory
- Proper permissions

## Initialization Scripts

If you need to run SQL scripts when the database is first initialized, place them in the `init-scripts/` directory.

### How it works:

1. The PostgreSQL container will automatically execute any `.sql`, `.sh`, or `.sql.gz` files found in `/docker-entrypoint-initdb.d/` when the container is first started
2. Scripts are executed in alphabetical order
3. Scripts only run if the data directory is empty (first initialization)

### Example:

To add an initialization script:

1. Create a SQL file in `docker/postgres/init-scripts/`:
   ```sql
   -- docker/postgres/init-scripts/01-init.sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```

2. Uncomment the COPY line in `Dockerfile.postgres`:
   ```dockerfile
   COPY ./docker/postgres/init-scripts/*.sql /docker-entrypoint-initdb.d/
   ```

3. Rebuild the image:
   ```bash
   docker compose build db
   ```

## Building the Image

```bash
# Build the PostgreSQL image
docker build -f Dockerfile.postgres -t postgres-home-library .

# Or use docker-compose
docker compose build db
```

## Environment Variables

The following environment variables can be set (via `.env` or `docker-compose.yml`):

- `POSTGRES_USER` - Database user (default: nest)
- `POSTGRES_PASSWORD` - Database password (default: nest)
- `POSTGRES_DB` - Database name (default: nestdb)
- `PGDATA` - PostgreSQL data directory (default: /var/lib/postgresql/data/pgdata)

## Health Check

The docker-compose.yml includes a health check that verifies PostgreSQL is ready to accept connections.
