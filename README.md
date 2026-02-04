# sql-loader-node

A lean CLI utility in Node.js for loading SQL scripts into PostgreSQL or SQLite databases. Built with Commander.js and pg, emphasizing simplicity and minimal dependencies.

## Features

- 🚀 Simple CLI interface for loading SQL scripts
- 📁 Load single SQL files or entire directories
- 🔄 Supports PostgreSQL and SQLite
- 📦 Lightweight with minimal dependencies
- ✅ Test-first development with comprehensive test suite
- 🔧 Can be used as a CLI tool or programmatically

## Installation

### Global Installation (CLI)

```bash
npm install -g sql-loader-node
```

### Local Installation (Programmatic Use)

```bash
npm install sql-loader-node
```

## Usage

### CLI Usage

#### Load a single SQL file into SQLite

```bash
sql-loader load schema.sql --type sqlite --file database.db
```

#### Load all SQL files from a directory into SQLite

```bash
sql-loader load ./migrations --type sqlite --file database.db
```

#### Load SQL files into PostgreSQL

```bash
sql-loader load ./migrations \
  --type postgres \
  --host localhost \
  --port 5432 \
  --database mydb \
  --user postgres \
  --password secret
```

#### Command Options

```
sql-loader load <path> [options]

Arguments:
  path                    Path to SQL file or directory

Options:
  -t, --type <type>       Database type (postgres|sqlite) (default: "sqlite")
  -h, --host <host>       Database host (for PostgreSQL) (default: "localhost")
  -p, --port <port>       Database port (for PostgreSQL) (default: "5432")
  -d, --database <db>     Database name (default: "postgres")
  -u, --user <user>       Database user (for PostgreSQL) (default: "postgres")
  -w, --password <pass>   Database password (for PostgreSQL) (default: "")
  -f, --file <file>       SQLite database file (default: ":memory:")
```

### Programmatic Usage

```javascript
const { loadSqlFile, loadSqlDirectory } = require('sql-loader-node');
const Database = require('better-sqlite3');

// With SQLite
const db = new Database('database.db');
await loadSqlFile(db, './schema.sql');
await loadSqlDirectory(db, './migrations');
db.close();

// With PostgreSQL
const { Client } = require('pg');
const client = new Client({
  host: 'localhost',
  database: 'mydb',
  user: 'postgres',
  password: 'secret'
});
await client.connect();
await loadSqlFile(client, './schema.sql');
await loadSqlDirectory(client, './migrations');
await client.end();
```

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/obstreperous-ai/sql-loader-node.git
cd sql-loader-node

# Install dependencies
npm install

# Or using Task
task install
```

### Running Tests

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Or using Task
task test
task test:watch
```

### Linting

```bash
npm run lint

# Or using Task
task lint
```

### Building

This project doesn't require a build step as it's plain Node.js. However, you can create binary releases:

```bash
# Install pkg globally
npm install -g pkg

# Create binaries for all platforms
pkg . --out-path dist
```

## Project Structure

```
sql-loader-node/
├── src/
│   ├── cli.js           # CLI entry point
│   ├── loader.js        # Core SQL loading logic
│   └── index.js         # Programmatic API
├── test/
│   ├── cli.test.js      # CLI tests
│   └── loader.test.js   # Loader tests
├── .devcontainer/       # VS Code Dev Container config
├── .github/
│   ├── workflows/       # GitHub Actions
│   └── dependabot.yml   # Dependabot config
├── jest.config.js       # Jest configuration
├── Taskfile.yml         # Task runner config
└── package.json
```

## SQL File Conventions

- Files in a directory are loaded in **alphabetical order**
- Prefix files with numbers for explicit ordering (e.g., `001_schema.sql`, `002_data.sql`)
- Multiple SQL statements in a file are separated by semicolons
- Comments are preserved in SQL files
- Empty files are skipped with a warning

## Contributing

Contributions are welcome! This project follows a test-first approach:

1. Write tests for new features
2. Implement the feature
3. Ensure all tests pass
4. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Author

obstreperous-ai
