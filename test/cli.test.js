const { execSync } = require('child_process');
const path = require('path');

describe('CLI', () => {
  const cliPath = path.join(__dirname, '..', 'src', 'cli.js');

  test('should display help when --help flag is used', () => {
    const output = execSync(`node ${cliPath} --help`, { encoding: 'utf-8' });
    
    expect(output).toContain('Usage:');
    expect(output).toContain('sql-loader');
  });

  test('should display version when --version flag is used', () => {
    const output = execSync(`node ${cliPath} --version`, { encoding: 'utf-8' });
    const packageJson = require('../package.json');
    
    expect(output.trim()).toContain(packageJson.version);
  });

  test('should have load command', () => {
    const output = execSync(`node ${cliPath} --help`, { encoding: 'utf-8' });
    
    expect(output).toContain('load');
  });
});
