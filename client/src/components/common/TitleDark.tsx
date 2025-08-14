import { styles } from "@/styles/styles";

export function TitleDark(props: {
  title: string;
  titleSpan: string;
  subtitle: string;
  subtitleParagraph: string;
}) {
  const { title, titleSpan, subtitle, subtitleParagraph } = props;

  return (
    <div className="flex flex-col items-center space-y-6 animate-fadeInUp">
      <h1 className={styles.titleDark}>
        {title} <span className={styles.titleSpanDark}>{titleSpan}</span>
      </h1>

      <div className="max-w-2xl">
        <h2 className={styles.subtitleDark}>{subtitle}</h2>
        <p className={styles.subtitleParagraphDark}>{subtitleParagraph}</p>
      </div>
    </div>
  );
}
