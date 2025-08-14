import { fontSizes } from "@/styles/fontSizes";
import { NavBar } from "../layout/NavBar";
import { styles } from "@/styles/styles";

export function Loader(props: { text: string }) {
  return (
    <section className={styles.pageLayoutDark}>
      <NavBar />
      <div className="w-full relative">
        <main className="h-[100vh] flex items-center justify-center bg-gradient-to-br from-black via-[#111] to-[#0d0d0d]">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-pong-accent border-t-transparent rounded-full animate-spin"></div>
            <p
              className={`text-white ${fontSizes.bodyFontSize} font-semibold animate-pulse`}
            >
              {props.text}
            </p>
          </div>
        </main>
      </div>
    </section>
  );
}
