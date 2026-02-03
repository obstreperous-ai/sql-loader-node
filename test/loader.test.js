const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { loadSqlFile, loadSqlDirectory } = require('../src/loader');

describe('SQL Loader', () => {
  let db;
  let testDir;

  beforeEach(() => {
    // Create in-memory SQLite database for testing
    db = new Database(':memory:');
    
    // Create a temporary directory for test SQL files
    testDir = path.join(__dirname, 'fixtures');
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    if (db) {
      db.close();
    }
    // Clean up test fixtures
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  describe('loadSqlFile', () => {
    test('should load and execute a single SQL file', async () => {
      const sqlFile = path.join(testDir, 'create_table.sql');
      const sqlContent = `
        CREATE TABLE users (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL
        );
      `;
      fs.writeFileSync(sqlFile, sqlContent);

      await loadSqlFile(db, sqlFile);

      // Verify table was created
      const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").all();
      expect(tables).toHaveLength(1);
      expect(tables[0].name).toBe('users');
    });

    test('should handle multiple statements in a single file', async () => {
      const sqlFile = path.join(testDir, 'multiple_statements.sql');
      const sqlContent = `
        CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT);
        INSERT INTO products (name) VALUES ('Product 1');
        INSERT INTO products (name) VALUES ('Product 2');
      `;
      fs.writeFileSync(sqlFile, sqlContent);

      await loadSqlFile(db, sqlFile);

      const count = db.prepare('SELECT COUNT(*) as count FROM products').get();
      expect(count.count).toBe(2);
    });

    test('should throw error for non-existent file', async () => {
      const nonExistentFile = path.join(testDir, 'nonexistent.sql');
      
      await expect(loadSqlFile(db, nonExistentFile)).rejects.toThrow();
    });

    test('should throw error for invalid SQL', async () => {
      const sqlFile = path.join(testDir, 'invalid.sql');
      fs.writeFileSync(sqlFile, 'INVALID SQL STATEMENT;');

      await expect(loadSqlFile(db, sqlFile)).rejects.toThrow();
    });
  });

  describe('loadSqlDirectory', () => {
    test('should load all SQL files from a directory', async () => {
      // Create multiple SQL files
      fs.writeFileSync(
        path.join(testDir, '001_create_users.sql'),
        'CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);'
      );
      fs.writeFileSync(
        path.join(testDir, '002_create_posts.sql'),
        'CREATE TABLE posts (id INTEGER PRIMARY KEY, title TEXT);'
      );

      await loadSqlDirectory(db, testDir);

      // Verify both tables were created
      const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
      expect(tables).toHaveLength(2);
      expect(tables[0].name).toBe('posts');
      expect(tables[1].name).toBe('users');
    });

    test('should load files in alphabetical order', async () => {
      // Create files with specific order
      fs.writeFileSync(
        path.join(testDir, '001_first.sql'),
        'CREATE TABLE test_table (id INTEGER PRIMARY KEY, step INTEGER);'
      );
      fs.writeFileSync(
        path.join(testDir, '002_second.sql'),
        "INSERT INTO test_table (step) VALUES (1);"
      );
      fs.writeFileSync(
        path.join(testDir, '003_third.sql'),
        "INSERT INTO test_table (step) VALUES (2);"
      );

      await loadSqlDirectory(db, testDir);

      const rows = db.prepare('SELECT * FROM test_table ORDER BY id').all();
      expect(rows).toHaveLength(2);
      expect(rows[0].step).toBe(1);
      expect(rows[1].step).toBe(2);
    });

    test('should ignore non-SQL files', async () => {
      fs.writeFileSync(
        path.join(testDir, 'schema.sql'),
        'CREATE TABLE test (id INTEGER PRIMARY KEY);'
      );
      fs.writeFileSync(
        path.join(testDir, 'readme.txt'),
        'This is not a SQL file'
      );

      await loadSqlDirectory(db, testDir);

      const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
      expect(tables).toHaveLength(1);
    });

    test('should throw error for non-existent directory', async () => {
      await expect(loadSqlDirectory(db, '/nonexistent/path')).rejects.toThrow();
    });
  });
});
