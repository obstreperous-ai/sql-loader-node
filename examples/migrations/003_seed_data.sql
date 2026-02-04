-- Migration 003: Seed initial data

INSERT OR IGNORE INTO users (id, username, email) VALUES 
  (1, 'admin', 'admin@example.com'),
  (2, 'john_doe', 'john@example.com'),
  (3, 'jane_smith', 'jane@example.com');

INSERT OR IGNORE INTO posts (id, user_id, title, content, published) VALUES
  (1, 1, 'Welcome to SQL Loader', 'This is an example post created by the migration.', 1),
  (2, 2, 'Getting Started', 'Here is how you can get started with this tool.', 1),
  (3, 2, 'Draft Post', 'This is a draft post.', 0);
