interface LinkProps {
  content: string;
  className?: string;
  href: string;
}

const Link = ({ content, className = "link", href }: LinkProps): string => {
  return /*html*/ `
        <a href="${href}" class="${className}">
            ${content}
        </a>
    `;
};

export default Link;
