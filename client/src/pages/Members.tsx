import { NavBar } from "@/components/layout/NavBar";
import { styles } from "@/styles/styles";
import { hydrateAllMembers } from "@/handlers/hydrate-all-members";
import { SecondaryHeader } from "@/components/common/SecondaryHeader";
import { getCurrentUser } from "@/utils/user-store";
import { hydrateFriends } from "@/handlers/hydrate-friends";
import { Loader } from "@/components/common/Loader";
import { FriendsList } from "@/components/friends/FriendsList";
import { AllMembersList } from "@/components/friends/AllMembersList";
import { PendingRequestsList } from "@/components/friends/PendingRequestsList";
import { hydratePendingRequests } from "@/handlers/hydrate-pending";

export function Members() {
  const user = getCurrentUser();
  if (!user) {
    return <Loader text="Preparing your club profile..." />;
  }

  setTimeout(() => {
    hydratePendingRequests(user);
    hydrateFriends(user);
    hydrateAllMembers(user);

    const tabs = {
      pending: {
        btn: document.getElementById("pending-requests-item") as HTMLLIElement,
        container: document.getElementById(
          "pending-container"
        ) as HTMLDivElement,
      },
      friends: {
        btn: document.getElementById("friends-item") as HTMLLIElement,
        container: document.getElementById(
          "friends-container"
        ) as HTMLDivElement,
      },
      members: {
        btn: document.getElementById("all-members-item") as HTMLLIElement,
        container: document.getElementById(
          "members-container"
        ) as HTMLDivElement,
      },
    };

    if (!tabs.friends.btn || !tabs.members.btn || !tabs.pending.btn) return;

    const allTabs = Object.values(tabs);

    function activateTab(tabKey: keyof typeof tabs) {
      allTabs.forEach(({ btn, container }) => {
        btn.className = styles.membersInactiveBtn;
        container?.classList.add("hidden");
      });

      tabs[tabKey].btn.className = styles.membersActiveBtn;
      tabs[tabKey].container?.classList.remove("hidden");
    }

    activateTab("pending");

    tabs.pending.btn.addEventListener("click", () => activateTab("pending"));
    tabs.friends.btn.addEventListener("click", () => activateTab("friends"));
    tabs.members.btn.addEventListener("click", () => activateTab("members"));
  }, 0);

  return (
    <section className={styles.pageLayoutDark}>
      <NavBar />
      <div className="w-full relative">
        <main className={styles.pageContent}>
          <SecondaryHeader
            title="Meet the Members"
            subtitle="Welcome to the beating heart of your club — grow your circle, connect with legends, and discover new challengers."
          />

          <ul className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-center">
            <li id="pending-requests-item" className={styles.membersActiveBtn}>
              Rally Requests
            </li>
            <li id="friends-item" className={styles.membersInactiveBtn}>
              My Inner Circle
            </li>
            <li id="all-members-item" className={styles.membersInactiveBtn}>
              Entire Clubhouse
            </li>
          </ul>

          <div id="pending-container" className={styles.membersListStyle}>
            <h2 className="text-white text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3 mb-8">
              <span className="inline-block w-1.5 h-8 bg-pong-accent rounded-sm"></span>
              Incoming Connections
            </h2>
            <p className="text-sm text-white/60 mt-[-1rem] mb-6 pl-6">
              Fellow members have sent you a rally invite — accept their
              challenge and expand your crew.
            </p>
            <PendingRequestsList />
          </div>

          <div id="friends-container" className={styles.membersListStyle}>
            <h2 className="text-white text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3 mb-8">
              <span className="inline-block w-1.5 h-8 bg-pong-accent rounded-sm"></span>
              Trusted Allies
            </h2>
            <p className="text-sm text-white/60 mt-[-1rem] mb-6 pl-6">
              These are your confirmed club companions — ready for a match or a
              message at any time.
            </p>
            <FriendsList />
          </div>

          <div id="members-container" className={styles.membersListStyle}>
            <h2 className="text-white text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3 mb-8">
              <span className="inline-block w-1.5 h-8 bg-pong-accent rounded-sm"></span>
              The Club Directory
            </h2>
            <p className="text-sm text-white/60 mt-[-1rem] mb-6 pl-6">
              Explore the full roster of BHV PONG — find future teammates,
              rivals, or just someone to spectate with.
            </p>
            <AllMembersList />
          </div>
        </main>
      </div>
    </section>
  );
}
