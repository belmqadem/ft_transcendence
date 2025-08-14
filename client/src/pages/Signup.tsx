import { styles } from "@/styles/styles";
import { Footer } from "@/components/layout/Footer";
import { TitleDark } from "@/components/common/TitleDark";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Overlay } from "@/components/layout/Overlay";

export function Signup() {
  return (
    <section className={styles.pageLayoutLight}>
      <Overlay />
      <TitleDark
        title="join"
        titleSpan="the club"
        subtitle="become a member"
        subtitleParagraph="sign your name into club history"
      />
      <SignUpForm />
      <Footer />
    </section>
  );
}
