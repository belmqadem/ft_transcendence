import { displayToast } from "@/utils/display-toast";
import { UploadAvatarRes } from "@/utils/response-messages";
import { getCurrentUser } from "@/utils/user-store";

export async function uploadAvatar(): Promise<boolean> {
  const btn = document.getElementById("upload-avatar-btn") as HTMLButtonElement;
  const avatar = document.getElementById("member-avatar") as HTMLImageElement;
  if (!btn || !avatar) return false;

  let fileInput = document.getElementById(
    "avatar-file-input"
  ) as HTMLInputElement | null;
  if (!fileInput) {
    fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.id = "avatar-file-input";
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);
  }

  btn.addEventListener("click", (e: Event) => {
    e.preventDefault();
    fileInput!.click();
  });

  fileInput.addEventListener("change", async () => {
    const file = fileInput!.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/profile/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data?.data?.avatar_url) {
        const fileName = data.data.avatar_url;
        const avatarUrl = `/profile/avatar/${fileName}`;
        avatar.src = avatarUrl;
        displayToast(UploadAvatarRes.AVATAR_UPLOADED, "success");
      } else {
        displayToast(
          UploadAvatarRes[data.code] || "Failed to upload avatar",
          "error"
        );
      }
    } catch {
      displayToast(UploadAvatarRes.INTERNAL_SERVER_ERROR, "error");
    } finally {
      fileInput!.value = "";
    }
  });

  return true;
}
