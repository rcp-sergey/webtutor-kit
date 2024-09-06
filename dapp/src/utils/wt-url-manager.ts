import { optDecimalString } from "@/utils/convert";

export default class WTURLManager {
  private url: URL;
  private segments: string[];
  private isPathSegmentFormat: boolean;

  constructor(url: string) {
    this.url = new URL(url);
    this.segments = this.url.pathname.split("/").filter(Boolean);
    this.isPathSegmentFormat = this._isSegmentFormat();
  }

  private _isSegmentFormat(): boolean {
    // Adjust this logic based on the specific pattern of URLs
    return (
      this.segments.length > 0 &&
      this.segments.length % 2 === 0 &&
      !this.url.pathname.includes("?")
    );
  }

  public get(
    key: string,
    convertToDecimalString: boolean = false
  ): string | null {
    if (this.isPathSegmentFormat) {
      const index = this.segments.indexOf(key);
      const value =
        index !== -1 && this.segments[index + 1]
          ? this.segments[index + 1]
          : null;
      return convertToDecimalString ? optDecimalString(value) ?? null : value;
    } else {
      return this.url.searchParams.get(key);
    }
  }

  public set(key: string, value: string): void {
    if (this.isPathSegmentFormat) {
      const index = this.segments.indexOf(key);
      if (index !== -1) {
        this.segments[index + 1] = value;
      } else {
        this.segments.push(key, value);
      }
      this._updatePathname();
    } else {
      this.url.searchParams.set(key, value);
    }
  }

  public delete(key: string): void {
    if (this.isPathSegmentFormat) {
      const index = this.segments.indexOf(key);
      if (index !== -1) {
        this.segments.splice(index, 2);
        this._updatePathname();
      }
    } else {
      this.url.searchParams.delete(key);
    }
  }

  public append(key: string, value: string): void {
    if (this.isPathSegmentFormat) {
      this.segments.push(key, value);
      this._updatePathname();
    } else {
      this.url.searchParams.append(key, value);
    }
  }

  public toString(): string {
    return this.url.toString();
  }

  private _updatePathname(): void {
    if (this.isPathSegmentFormat) {
      this.url.pathname = "/" + this.segments.join("/");
    }
  }

  public pushState(): void {
    history.pushState({}, "", this.url.toString());
  }

  public replaceState(): void {
    history.replaceState({}, "", this.url.toString());
  }

  public redirect(): void {
    window.location.href = this.url.toString();
  }
}
