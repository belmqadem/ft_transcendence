export function Overlay() {
  return (
    <div
      className={`
	 	absolute inset-0 z-[-2] opacity-70 
		bg-[url('/background.png')] bg-repeat bg-cover 
		animate-backgroundPan 
	`}
    />
  );
}
