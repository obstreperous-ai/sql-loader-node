const fs = require('fs').promises;
const path = require('path');

/**
 * Load and execute a single SQL file
 * @param {Object} db - Database connection (SQLite or pg client)
 * @param {string} filePath - Path to the SQL file
 */
async function loadSqlFile(db, filePath) {
  try {
    const sqlContent = await fs.readFile(filePath, 'utf-8');
    
    if (!sqlContent.trim()) {
      console.warn(`Skipping empty file: ${filePath}`);
      return;
    }

    // Split by semicolons to handle multiple statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      try {
        // Check if this is a SQLite database (better-sqlite3)
        if (db.prepare) {
          db.prepare(statement).run();
        } else {
          // PostgreSQL (pg)
          await db.query(statement);
        }
      } catch (error) {
        throw new Error(`Error executing statement in ${filePath}: ${error.message}`);
      }
    }

    console.log(`Loaded: ${filePath}`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`File not found: ${filePath}`);
    }
    throw error;
  }
}

/**
 * Load and execute all SQL files from a directory
 * @param {Object} db - Database connection
 * @param {string} dirPath - Path to directory containing SQL files
 */
async function loadSqlDirectory(db, dirPath) {
  try {
    const files = await fs.readdir(dirPath);
    
    // Filter and sort SQL files alphabetically
    const sqlFiles = files
      .filter(file => file.endsWith('.sql'))
      .sort();

    if (sqlFiles.length === 0) {
      console.warn(`No SQL files found in directory: ${dirPath}`);
      return;
    }

    console.log(`Found ${sqlFiles.length} SQL file(s) in ${dirPath}`);

    for (const file of sqlFiles) {
      const filePath = path.join(dirPath, file);
      await loadSqlFile(db, filePath);
    }

    console.log(`Successfully loaded ${sqlFiles.length} file(s)`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Directory not found: ${dirPath}`);
    }
    throw error;
  }
}

module.exports = {
  loadSqlFile,
  loadSqlDirectory
};
