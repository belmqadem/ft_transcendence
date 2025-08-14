import { NavBar } from "@/components/layout/NavBar";
import { MemberCard } from "@/components/profile/MemberCard";
import { styles } from "@/styles/styles";
import { getCurrentUser } from "@/utils/user-store";
import { Loader } from "@/components/common/Loader";
import { SecondaryHeader } from "@/components/common/SecondaryHeader";
import { MatchHistory } from "@/components/profile/MatchHistory";
import { PerformanceMetrics } from "@/components/profile/PerformanceMetrics";
import { QuickLinks } from "@/components/profile/QuickLinks";
import { fontSizes } from "@/styles/fontSizes";
import { NoPerformanceData } from "@/components/profile/NoPerformanceData";

export function Profile() {
  const user = getCurrentUser();
  if (!user) {
    return <Loader text="Preparing your club profile..." />;
  }

  const hasPerformanceData = user.matches_played > 0;

  const containerClassName = hasPerformanceData
    ? "w-full md:w-[90%] xl:w-[95%] mx-auto flex flex-col 2xl:flex-row gap-8 md:gap-12"
    : "w-full md:w-[90%] xl:w-[95%] mx-auto flex flex-col 2xl:flex-row gap-8 md:gap-12 justify-center";

  const userDataClassName = hasPerformanceData
    ? "w-full 2xl:w-1/3 2xl:sticky 2xl:top-24 flex 2xl:self-start flex-col 2xl:flex-col items-center justify-center gap-6"
    : "w-full 2xl:w-1/3 flex 2xl:self-start flex-col 2xl:flex-col items-center justify-center gap-6";

  return (
    <section className={`${styles.pageLayoutDark} relative`}>
      <NavBar />
      <div className="w-full relative">
        <main className={styles.pageContent}>
          <SecondaryHeader
            title="Member Profile"
            subtitle="Your identity, matches & achievements in the BHV Club."
          />

          <div className={containerClassName}>
            <div className={userDataClassName}>
              <MemberCard user={user} showUpdateOptions={true} />
              <QuickLinks />
            </div>

            {hasPerformanceData ? (
              <div className="flex-1 flex flex-col gap-8 w-full">
                <PerformanceMetrics user={user} />
                <MatchHistory user={user} />
              </div>
            ) : (
              <NoPerformanceData
                spanText="The club’s leaderboard awaits you! Play your first match to start building your stats, earn XP, and unlock exclusive BHV achievements."
                isMember={false}
              />
            )}
          </div>
        </main>
      </div>
    </section>
  );
}
