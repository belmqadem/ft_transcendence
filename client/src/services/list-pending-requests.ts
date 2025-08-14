export async function listPendingRequests(): Promise<{ received: number[]; sent: number[] }> {
  try {
    const res = await fetch("/friends/requests", {
      credentials: "include",
    });

    if (!res.ok) return { received: [], sent: [] };

    const data = await res.json();
    const received = data.data.pendingRequests.map(
      (r: { requester_id: number }) => r.requester_id
    );
    const sent = data.data.sentRequests.map(
      (r: { addressee_id: number }) => r.addressee_id
    );
    return { received, sent };
  } catch {
    return { received: [], sent: [] };
  }
}
