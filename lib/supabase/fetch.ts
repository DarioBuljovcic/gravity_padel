const NEW_API_KEY_BEARER_RE = /^Bearer sb_(?:publishable|secret)_/i;

/**
 * New-format Supabase keys are not JWTs. The JS client still sends them as
 * `Authorization: Bearer`, and Kong stalls for tens of seconds trying to parse
 * them. Strip those headers; leave real user access tokens (`eyJ…`) alone.
 */
export const supabaseFetch: typeof fetch = (input, init) => {
  const headers = new Headers(init?.headers);

  if (input instanceof Request) {
    input.headers.forEach((value, key) => {
      if (!headers.has(key)) {
        headers.set(key, value);
      }
    });
  }

  const authorization = headers.get("Authorization");
  if (authorization && NEW_API_KEY_BEARER_RE.test(authorization)) {
    headers.delete("Authorization");
  }

  return fetch(input, { ...init, headers });
};
