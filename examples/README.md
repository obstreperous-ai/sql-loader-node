# SQL Loader Examples

This directory contains example SQL files to demonstrate how to use sql-loader-node.

## Files

### schema.sql
A complete PostgreSQL schema example showing:
- User management tables
- Foreign key relationships
- Indexes for performance

**Usage:**
```bash
sql-loader load examples/schema.sql --type postgres --database mydb --user postgres --password secret
```

### migrations/
A directory of numbered migration files that should be loaded in order:

- `001_create_users.sql` - Creates the users table
- `002_create_posts.sql` - Creates the posts table with foreign key to users
- `003_seed_data.sql` - Inserts initial data

**Usage:**
```bash
# Load all migrations into SQLite
sql-loader load examples/migrations --type sqlite --file database.db

# Load all migrations into PostgreSQL
sql-loader load examples/migrations --type postgres --database mydb --user postgres --password secret
```

## Testing the Examples

### With SQLite

```bash
# Create a test database
sql-loader load examples/migrations --type sqlite --file /tmp/example.db

# Query the data
sqlite3 /tmp/example.db "SELECT * FROM users;"
sqlite3 /tmp/example.db "SELECT posts.title, users.username FROM posts JOIN users ON posts.user_id = users.id;"
```

### With PostgreSQL

First, ensure you have a PostgreSQL instance running. Then:

```bash
# Create a test database
createdb sql_loader_test

# Load the migrations
sql-loader load examples/migrations \
  --type postgres \
  --database sql_loader_test \
  --user postgres \
  --password yourpassword

# Query the data
psql sql_loader_test -c "SELECT * FROM users;"
psql sql_loader_test -c "SELECT posts.title, users.username FROM posts JOIN users ON posts.user_id = users.id;"
```

## Migration Naming Convention

Files in the migrations directory follow a numbered prefix pattern:
- `001_`, `002_`, `003_`, etc.
- This ensures files are loaded in the correct order
- Use descriptive names after the number

## Best Practices

1. **Idempotent Scripts**: Use `CREATE TABLE IF NOT EXISTS` and `INSERT OR IGNORE` to make scripts safe to run multiple times
2. **Numbered Migrations**: Prefix migration files with numbers for explicit ordering
3. **Single Responsibility**: Each migration file should do one thing (create a table, add an index, etc.)
4. **Comments**: Add comments to explain complex operations
5. **Database Compatibility**: Consider using separate directories for PostgreSQL and SQLite if needed
