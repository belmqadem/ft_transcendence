import { styles } from "@/styles/styles";
import { handleGoogleSignin, handle42Signin } from "@/handlers/remote-signin";

export function RemoteLink() {
  setTimeout(() => {
    handleGoogleSignin();
    handle42Signin();
  }, 0);

  return (
    <div className="w-full">
      <div className="line-divider relative w-full flex items-center justify-center mb-6">
        <i className="fa-solid fa-table-tennis-paddle-ball"></i>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <button
          type="button"
          id="google-signin-btn"
          className={`
			${styles.lightPrimaryBtn}
			border border-pong-primary/20
			!text-pong-primary !bg-white
			hover:!text-pong-accent hover:!bg-pong-secondary/10
          `}
        >
          <i
            className={`fa-brands fa-google ${styles.lightPrimaryBtnIcon}`}
          ></i>
          enter with google
        </button>
        <button
          type="button"
          id="ft-signin-btn"
          className={`
    		${styles.lightPrimaryBtn}
			border border-pong-primary/20
            !bg-[#2c2c2c] !text-white
            hover:!bg-pong-accent hover:!text-white
          `}
        >
          <i
            className={`fa-solid fa-chess-knight ${styles.lightPrimaryBtnIcon}`}
          ></i>
          enter with 42
        </button>
      </div>
    </div>
  );
}
