import { styles } from "@/styles/styles";

export function DeleteAccount() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-6 m-4 w-full max-w-2xl">
      <h2 className="text-xl font-bold mb-4 text-pong-error">Delete Account</h2>
      <p className="mb-4 text-pong-error">
        This action is irreversible. All your data will be permanently deleted.
      </p>

      {/* <SubmitBtn
		label="Delete Account"
		className="w-full mt-4 bg-pong-error hover:bg-red-700"
	  /> */}
    </div>
  );
}
