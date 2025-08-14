export function manipulateOtpInput(id: string) {
  const inputs = document.querySelectorAll<HTMLInputElement>(`#${id} input`);
  if (!inputs) return;

  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      const value = input.value;

      if (value.match(/^\d$/) && value.length === 1 && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }

      if (!/^\d$/.test(value)) {
        input.value = "";
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && index > 0) {
        inputs[index - 1].focus();
      }
    });

    input.addEventListener("paste", (e: ClipboardEvent) => {
      const pasted = e.clipboardData?.getData("text") ?? "";
      const digits = pasted.replace(/\D/g, "").slice(0, inputs.length);

      digits.split("").forEach((digit, i) => {
        if (inputs[i]) {
          inputs[i].value = digit;
        }
      });

      if (inputs[digits.length - 1]) {
        inputs[digits.length - 1].focus();
      }

      e.preventDefault();
    });
  });
}
