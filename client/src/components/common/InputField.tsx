import { styles } from "@/styles/styles";

export function InputField(props: {
  type: string;
  name: string;
  id: string;
  placeholder: string;
  autofocus?: boolean;
}) {
  return (
    <div className="w-full">
      <input
        type={props.type}
        name={props.name}
        id={props.id}
        placeholder={props.placeholder}
        autoFocus={props.autofocus ?? false}
        autoComplete="off"
        className={styles.InputFieldOne}
      />
    </div>
  );
}
