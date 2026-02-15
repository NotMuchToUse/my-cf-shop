export const renderAttributes = (props: Record<string, any>): string => {
  return Object.entries(props)
    .map(([key, value]) => {
      if (value === undefined || value === null || value === false) return "";
      return `${key}="${value}"`;
    })
    .join(" ");
};
