import { handleLogout } from "@/handlers/logout";
import { fontSizes } from "@/styles/fontSizes";

let hasLoggedOut: boolean = false;

export function Logout() {
  if (!hasLoggedOut) {
    hasLoggedOut = true;
    setTimeout(() => {
      handleLogout();
    }, 1200);
  }

  return (
    <section className="flex flex-col items-center justify-center h-screen bg-pong-bg px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
      <p
        className={`text-pong-primary ${fontSizes.bodyFontSize} font-semibold mb-4 text-center animate-myPulse`}
      >
        checking you out — your paddle awaits your next rally.
      </p>
      <i className="fas fa-spinner fa-spin text-pong-accent text-2xl animate-spin"></i>
    </section>
  );
}
