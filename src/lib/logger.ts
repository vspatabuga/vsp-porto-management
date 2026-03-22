import chalk from 'chalk';

const primary = '#6C5CE7';
const success = '#00B894';
const warning = '#FDCB6E';
const error = '#E17055';
const info = '#74B9FF';
const muted = '#636E72';

export const logger = {
  primary: (msg: string) => console.log(chalk.hex(primary)(msg)),
  success: (msg: string) => console.log(chalk.hex(success)(`✓ ${msg}`)),
  warning: (msg: string) => console.log(chalk.hex(warning)(`⚠ ${msg}`)),
  error: (msg: string) => console.log(chalk.hex(error)(`✗ ${msg}`)),
  info: (msg: string) => console.log(chalk.hex(info)(`ℹ ${msg}`)),
  muted: (msg: string) => console.log(chalk.hex(muted)(msg)),
  
  header: (msg: string) => {
    console.log(chalk.hex(primary)('\n┌' + '─'.repeat(50) + '┐'));
    console.log(chalk.hex(primary)('│') + chalk.white(` ${msg}`.padEnd(50)) + chalk.hex(primary)('│'));
    console.log(chalk.hex(primary)('└' + '─'.repeat(50) + '┘'));
  },
  
  table: (headers: string[], rows: string[][]) => {
    const colWidths = headers.map((h, i) => 
      Math.max(h.length, ...rows.map(r => (r[i] || '').length))
    );
    
    const headerRow = headers.map((h, i) => h.padEnd(colWidths[i])).join(' │ ');
    console.log(chalk.hex(primary)('├' + colWidths.map(w => '─'.repeat(w)).join('─┼─') + '┤'));
    console.log(chalk.hex(primary)('│') + ' ' + chalk.bold(headerRow) + ' ' + chalk.hex(primary)('│'));
    console.log(chalk.hex(primary)('├' + colWidths.map(w => '─'.repeat(w)).join('─┼─') + '┤'));
    
    rows.forEach(row => {
      const dataRow = row.map((d, i) => (d || '').padEnd(colWidths[i])).join(' │ ');
      console.log(chalk.hex(primary)('│') + ' ' + dataRow + ' ' + chalk.hex(primary)('│'));
    });
    console.log(chalk.hex(primary)('└' + colWidths.map(w => '─'.repeat(w)).join('─┴─') + '┘'));
  }
};
