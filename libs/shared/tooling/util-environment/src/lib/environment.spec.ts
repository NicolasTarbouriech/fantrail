import { bool, enumeration, integer, requireStr, str } from './environment';

enum Color {
  Red = 'red',
  Blue = 'blue',
}

describe('environment', () => {
  const KEY = 'TRAIL_ENVIRONMENT_SPEC';

  afterEach(() => {
    delete process.env[KEY];
  });

  it('str returns the default value when the variable is missing or empty', () => {
    expect(str(KEY, 'fallback')).toBe('fallback');
    process.env[KEY] = '';
    expect(str(KEY, 'fallback')).toBe('fallback');
    process.env[KEY] = 'value';
    expect(str(KEY, 'fallback')).toBe('value');
  });

  it('requireStr throws when the variable is missing', () => {
    expect(() => requireStr(KEY)).toThrow(
      `Missing environment variable ${KEY}`,
    );
    process.env[KEY] = 'value';
    expect(requireStr(KEY)).toBe('value');
  });

  it('bool parses true and false only', () => {
    expect(bool(KEY, true)).toBe(true);
    process.env[KEY] = 'false';
    expect(bool(KEY, true)).toBe(false);
    process.env[KEY] = 'yes';
    expect(() => bool(KEY, true)).toThrow();
  });

  it('integer parses integers only', () => {
    expect(integer(KEY, 5432)).toBe(5432);
    process.env[KEY] = '5433';
    expect(integer(KEY, 5432)).toBe(5433);
    process.env[KEY] = '1.5';
    expect(() => integer(KEY, 5432)).toThrow();
  });

  it('enumeration accepts enum values only', () => {
    expect(enumeration(KEY, Color, Color.Red)).toBe(Color.Red);
    process.env[KEY] = 'blue';
    expect(enumeration(KEY, Color, Color.Red)).toBe(Color.Blue);
    process.env[KEY] = 'green';
    expect(() => enumeration(KEY, Color, Color.Red)).toThrow();
  });
});
