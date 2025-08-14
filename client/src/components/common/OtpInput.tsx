import { styles } from "@/styles/styles";

export function OtpInput(props: { id: string }) {
  return (
    <div id={props.id} className="flex justify-center gap-2 md:gap-4 w-full">
      {[...Array(6)].map((i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className={styles.otpInputStyle}
        />
      ))}
    </div>
  );
}
