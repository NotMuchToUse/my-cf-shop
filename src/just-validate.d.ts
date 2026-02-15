declare module "just-validate" {
  export default class JustValidate {
    constructor(selector: string | Element, options?: any);

    addField(
      selector: string,
      rules: Array<{
        rule: string;
        errorMessage?: string;
        value?: any;
        validator?: (value: any) => boolean;
      }>,
      config?: any,
    ): JustValidate;

    addRequiredGroup(
      groupSelector: string,
      errorMessage?: string,
      config?: any,
    ): JustValidate;

    onSuccess(callback: (event?: Event) => void): void;

    onFail(callback: (fields: any) => void): void;

    revalidate(): boolean;
  }
}
