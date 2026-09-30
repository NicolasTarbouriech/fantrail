// Marks an error as a business rule violation, safe to expose to clients with its message.
export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }

  get code(): string {
    return this.name
      .replace(/Error$/, '')
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .toUpperCase();
  }
}

export abstract class NotFoundDomainError extends DomainError {}
