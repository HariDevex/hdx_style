import pc from 'picocolors';

/**
 * Log a success message
 * @param {string} msg
 */
export function success(msg) {
  console.log(pc.green(`✓ ${msg}`));
}

/**
 * Log an info message
 * @param {string} msg
 */
export function info(msg) {
  console.log(pc.cyan(`ℹ ${msg}`));
}

/**
 * Log a warning message
 * @param {string} msg
 */
export function warn(msg) {
  console.log(pc.yellow(`⚠ ${msg}`));
}

/**
 * Log an error message
 * @param {string} msg
 */
export function error(msg) {
  console.error(pc.red(`✗ ${msg}`));
}

/**
 * Log a step message
 * @param {string} msg
 */
export function step(msg) {
  console.log(pc.blue(`→ ${msg}`));
}
