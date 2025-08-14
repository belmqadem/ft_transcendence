import { NavBar } from "@/components/layout/NavBar";
import { styles } from "@/styles/styles";
import { TwoFa } from "@/components/settings/TwoFa";
import { ChangePassword } from "@/components/settings/ChangePassword";
import { ChangeEmail } from "@/components/settings/ChangeEmail";
import { SecondaryHeader } from "@/components/common/SecondaryHeader";
import { getCurrentUser } from "@/utils/user-store";
import { Loader } from "@/components/common/Loader";

export function Security() {
  const user = getCurrentUser();
  if (!user) {
    return <Loader text="Preparing your club profile..." />;
  }

  const isNotRemoteUser: boolean = user.gender !== null;

  return (
    <section className={styles.pageLayoutDark}>
      <NavBar />
      <div className="w-full relative">
        <main className={styles.pageContent}>
          <SecondaryHeader
            title="Security & Access"
            subtitle="Manage your credentials and protect your club profile."
          />

          {isNotRemoteUser ? (
            <div className="flex flex-col gap-6">
              <TwoFa />
              <ChangePassword />
              <ChangeEmail />
            </div>
          ) : (
            <div className={styles.cardOneStyle}>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                <i className="fa-solid fa-circle-exclamation text-pong-warning mr-2"></i>
                As a remote player, password, email, and 2FA settings are
                managed externally. For security reasons, these fields are
                locked.
              </p>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}
