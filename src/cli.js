#!/usr/bin/env node

const { Command } = require('commander');
const { Client } = require('pg');
const Database = require('better-sqlite3');
const path = require('path');
const { loadSqlFile, loadSqlDirectory } = require('./loader');
const packageJson = require('../package.json');

const program = new Command();

program
  .name('sql-loader')
  .description('A lean CLI utility for loading SQL scripts')
  .version(packageJson.version);

program
  .command('load')
  .description('Load SQL file(s) into a database')
  .argument('<path>', 'Path to SQL file or directory')
  .option('-t, --type <type>', 'Database type (postgres|sqlite)', 'sqlite')
  .option('-h, --host <host>', 'Database host (for PostgreSQL)', 'localhost')
  .option('-p, --port <port>', 'Database port (for PostgreSQL)', '5432')
  .option('-d, --database <database>', 'Database name', 'postgres')
  .option('-u, --user <user>', 'Database user (for PostgreSQL)', 'postgres')
  .option('-w, --password <password>', 'Database password (for PostgreSQL)', '')
  .option('-f, --file <file>', 'SQLite database file', ':memory:')
  .action(async (targetPath, options) => {
    let db;
    try {
      // Resolve the target path
      const resolvedPath = path.resolve(targetPath);

      // Initialize database connection
      if (options.type === 'postgres') {
        console.log('Connecting to PostgreSQL...');
        db = new Client({
          host: options.host,
          port: parseInt(options.port),
          database: options.database,
          user: options.user,
          password: options.password
        });
        await db.connect();
        console.log('Connected to PostgreSQL');
      } else if (options.type === 'sqlite') {
        console.log(`Opening SQLite database: ${options.file}`);
        db = new Database(options.file);
        console.log('Connected to SQLite');
      } else {
        throw new Error(`Unsupported database type: ${options.type}`);
      }

      // Load SQL files
      const fs = require('fs');
      const stats = fs.statSync(resolvedPath);

      if (stats.isFile()) {
        await loadSqlFile(db, resolvedPath);
      } else if (stats.isDirectory()) {
        await loadSqlDirectory(db, resolvedPath);
      } else {
        throw new Error(`Invalid path: ${resolvedPath}`);
      }

      console.log('✓ All SQL files loaded successfully');
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    } finally {
      // Close database connection
      if (db) {
        if (db.close) {
          // SQLite
          db.close();
        } else if (db.end) {
          // PostgreSQL
          await db.end();
        }
      }
    }
  });

// Parse command line arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
