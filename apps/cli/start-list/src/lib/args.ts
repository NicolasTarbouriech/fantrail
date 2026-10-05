export type ParsedArgs = {
  command: string | null;
  flags: Map<string, string>;
};

/** `command --key value --other=value --switch` */
export function parseArgs(argv: string[]): ParsedArgs {
  const flags = new Map<string, string>();
  let command: string | null = null;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index] ?? '';
    if (arg.startsWith('--')) {
      const [key = '', inlineValue] = arg.slice(2).split('=', 2);
      const next = argv[index + 1];
      if (inlineValue !== undefined) {
        flags.set(key, inlineValue);
      } else if (next !== undefined && !next.startsWith('--')) {
        flags.set(key, next);
        index += 1;
      } else {
        flags.set(key, 'true');
      }
    } else if (command === null) {
      command = arg;
    }
  }
  return { command, flags };
}

export function requireFlag(flags: Map<string, string>, key: string): string {
  const value = flags.get(key);
  if (!value || value === 'true') {
    throw new Error(`--${key} est obligatoire`);
  }
  return value;
}

export function intFlag(
  flags: Map<string, string>,
  key: string,
  fallback: number,
): number {
  const value = flags.get(key);
  if (value === undefined) {
    return fallback;
  }
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(`--${key} attend un entier positif`);
  }
  return parsed;
}
