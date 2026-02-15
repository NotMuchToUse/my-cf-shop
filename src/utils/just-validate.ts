import JustValidate from "just-validate";

export const createValidator = (selector: string) => {
  return new JustValidate(selector, {
    validateBeforeSubmitting: true,
    errorFieldCssClass: "is-invalid",
    errorLabelStyle: {
      color: "#dc3545",
      fontSize: "14px",
      marginTop: "5px",
    },
    successFieldCssClass: "is-valid",
  });
};
