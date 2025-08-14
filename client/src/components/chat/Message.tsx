export function Message(props: { message: string; fromWho: "Me" | "Friend" }) {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-white text-lg">This is a message component.</p>
    </div>
  );
}
