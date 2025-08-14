import { styles } from "@/styles/styles";
import { Footer } from "@/components/layout/Footer";
import { TitleDark } from "@/components/common/TitleDark";
import { SignInForm } from "@/components/auth/SignInForm";
import { Overlay } from "@/components/layout/Overlay";

export function Signin() {
  return (
    <section className={styles.pageLayoutLight}>
      <Overlay />
      <TitleDark
        title="welcome back,"
        titleSpan="champion"
        subtitle="step into the club"
        subtitleParagraph="enter your credentials to continue your legacy."
      />
      <SignInForm />
      <Footer />
    </section>
  );
}
