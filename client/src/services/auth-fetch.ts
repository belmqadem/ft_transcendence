async function refreshToken() {
  const res = await fetch("/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  return res.status === 200;
}

export async function authFetch(
  url: string,
  options: RequestInit = {},
  retry = true
): Promise<Response> {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (res.status === 400) {
    let retries = 5;
    let delay = 500;

    for (let i = 0; i < retries; i++) {
      const res = await fetch(url, {
        ...options,
        credentials: "include",
      });
      if (res.ok) break;
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
    }
  }
  if (res.status === 401 && retry) {
    const refreshed = await refreshToken();

    if (refreshed) {
      return authFetch(url, options, false);
    } else {
      return res;
    }
  }

  return res;
}
