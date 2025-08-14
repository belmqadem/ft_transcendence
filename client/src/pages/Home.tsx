import { NavBar } from "@/components/layout/NavBar";
import { Hero } from "@/components/home/Hero";
import { RecentActivityFeed } from "@/components/home/RecentActivityFeed";
import { LeaderboardPreview } from "@/components/home/LeaderboardPreview";
import { styles } from "@/styles/styles";
import { getCurrentUser } from "@/utils/user-store";
import { Loader } from "@/components/common/Loader";
import { QuickStatsCards } from "@/components/home/QuickStatsCards";
import { startRecentActivityListener } from "@/services/recent-activity-service";

export function Home() {
  const user = getCurrentUser();
  if (!user) {
    return <Loader text="Preparing your club profile..." />;
  }

  setTimeout(() => {
    startRecentActivityListener();
  }, 1500);

  return (
    <section className={styles.pageLayoutDark}>
      <NavBar />
      <div className="w-full relative">
        <main className={styles.pageContent}>
          <Hero user={user} />
          <QuickStatsCards user={user} />
          <RecentActivityFeed />
          <LeaderboardPreview user={user} />
        </main>
      </div>
    </section>
  );
}
