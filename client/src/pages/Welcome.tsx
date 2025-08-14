import { styles } from "@/styles/styles";
import { Footer } from "@/components/layout/Footer";
import { HeroTitle } from "@/components/welcome/HeroTitle";
import { HeroCta } from "@/components/welcome/HeroCta";
import { Overlay } from "@/components/layout/Overlay";
import Mascot from "@/assets/pong-mascot.png";

export function Welcome() {
  return (
    <section className={styles.pageLayoutLight}>
      <Overlay />
      <img src={Mascot} alt="Ping Pong Mascot" className={styles.heroMascot} />
      <div className="flex flex-col items-center justify-center gap-16 min-h-[80vh] animate-fadeInUp">
        <HeroTitle />
        <HeroCta />
      </div>
      <Footer />
    </section>
  );
}
