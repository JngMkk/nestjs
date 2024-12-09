export class CookiePayload {
  constructor(
    public id: number,
    public name: string,
  ) {}

  static fromJsonString(jsonString: string): CookiePayload {
    const data = JSON.parse(jsonString);

    return new CookiePayload(data.id, data.name);
  }

  toString(): string {
    return JSON.stringify(this);
  }
}
