import { displayToast } from "@/utils/display-toast";
import { navigateTo } from "@/utils/navigate-to-link";
import { DeleteAccountRes } from "@/utils/response-messages";

export function deleteAccount() {
  const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement;
  if (!submitBtn) return;

  submitBtn.addEventListener("click", async (e: Event) => {
    e.preventDefault();

    const spinner = document.querySelector<HTMLSpanElement>("#spinner");
    const btnLabel = document.querySelector<HTMLSpanElement>("#btn-label");

    if (!spinner || !btnLabel) return;

    const btnLabelText = btnLabel.textContent;
    const feedbackDelay = 900;
    const redirectDelay = 1500;

    submitBtn.disabled = true;
    submitBtn.setAttribute("aria-busy", "true");
    spinner.classList.remove("hidden");
    btnLabel.textContent = "deleting...";

    try {
      const response = await fetch("/auth/delete", {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        setTimeout(() => {
          displayToast(DeleteAccountRes.USER_DATA_DELETED, "success");

          setTimeout(() => {
            navigateTo("/welcome");
          }, redirectDelay);
        }, feedbackDelay);
      } else if (response.status === 429) {
        setTimeout(() => {
          displayToast(
            "Easy, champ! Let’s give it a second to catch up.",
            "error"
          );
        }, feedbackDelay);
      } else {
        setTimeout(() => {
          const errorMsg =
            DeleteAccountRes[result?.code] ||
            "Error during delete. Please try again.";
          displayToast(errorMsg, "error");
        }, feedbackDelay);
      }
    } catch (err) {
      displayToast(DeleteAccountRes.INTERNAL_SERVER_ERROR, "error");
    } finally {
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.removeAttribute("aria-busy");
        spinner.classList.add("hidden");
        btnLabel.textContent = btnLabelText;
      }, feedbackDelay + 300);
    }
  });
}
