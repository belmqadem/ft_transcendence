import { fontSizes } from "@/styles/fontSizes";

export function SecondaryHeader(props: { title: string; subtitle: string }) {
  return (
    <div className="text-center mb-10 w-full max-w-2xl mx-auto px-4">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
        {props.title}
      </h1>
      <p className={`text-white/70 mt-2 ${fontSizes.subtitleFontSize}`}>
        {props.subtitle}
      </p>
      <div className="mx-auto mt-3 w-16 h-1 bg-pong-dark-accent rounded-full" />
    </div>
  );
}
