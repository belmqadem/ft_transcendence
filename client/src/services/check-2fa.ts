export async function check2FA(): Promise<
  Array<{ type: "app" | "email"; enabled: 1 | 0; is_primary: 1 | 0 }>
> {
  try {
    const response = await fetch("/2fa/", {
      credentials: "include",
    });
    const result = await response.json();
    if (response.ok) {
      return result.data.methods;
    }
    return [];
  } catch {
    return [];
  }
}
