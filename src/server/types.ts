import type { Context } from '@netlify/functions';

import type { Session } from './session';

export type AppRequest = Request & { session: Session };

export type NetlifyFunction = (request: AppRequest, context: Context) => Promise<Response>;

/**
 * Represents the configuration and data of an HTTP cookie,
 * typically used for the `Set-Cookie` header or cookie storage.
 */
export type Cookie = {
  /**
   * The name (key) of the cookie.
   * Must consist of only valid characters as per RFC 6265.
   */
  name: string;

  /**
   * The string value of the cookie.
   * It should generally be URL-encoded (using `encodeURIComponent`)
   * to prevent issues with special characters.
   */
  value: string;

  /**
   * Defines the host(s) to which the cookie will be sent.
   * If omitted, it defaults to the host of the current document location.
   */
  domain?: string;

  /**
   * The URL path that must exist in the requested URL before
   * the browser sends the `Cookie` header.
   */
  path?: string;

  /**
   * The maximum lifetime of the cookie in seconds.
   * A negative or `0` value will expire the cookie immediately.
   */
  maxAge?: number;

  /**
   * The exact date and time at which the cookie expires.
   * If both `expires` and `maxAge` are set, `maxAge` takes precedence.
   */
  expires?: Date;

  /**
   * When `true`, the cookie is only transmitted over an encrypted
   * connection (HTTPS), preventing Man-In-The-Middle attacks.
   */
  secure?: boolean;

  /**
   * When `true`, the cookie cannot be accessed through client-side
   * JavaScript (e.g., `document.cookie`). This mitigates XSS attacks.
   */
  httpOnly?: boolean;

  /**
   * Controls whether the cookie is sent with cross-site requests.
   * `Strict`: Sent only in a first-party context.
   * `Lax`: Withheld on cross-site subrequests (e.g., images) but sent when the user navigates to the origin site.
   * `None`: Sent in all contexts (requires `secure` to also be `true`).
   */
  sameSite?: 'Strict' | 'Lax' | 'None';

  /**
   * When `true`, the cookie is isolated to a specific partitioned storage.
   * This allows third-party cookies to track users across a partitioned architecture.
   */
  partitioned?: boolean;
};
