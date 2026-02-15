interface ContainerProps {
  children: Promise<string> | string;
  className?: string;
}

const Container = ({ children, className = "container" }: ContainerProps) => {
  return /*html*/ `
        <div class="${className}">${children}</div>
    `;
};

export default Container;
