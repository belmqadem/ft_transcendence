import { displayPerformanceMetrics } from "@/utils/display-metrics";
import { UserProfile } from "types/types";

export function PerformanceMetrics(props: { user: UserProfile }) {
  setTimeout(() => {
    displayPerformanceMetrics(props.user);
  }, 0);

  return <div id="performance-metrics"></div>;
}
