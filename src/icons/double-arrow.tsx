interface Props {
  width?: string;
  height?: string;
  stylingClasses?: string;
}

export function DoubleArrow({
  height = "25px",
  width = "25px",
  stylingClasses = "",
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="currentColor"
      className={stylingClasses}
      viewBox="0 0 24 24"
    >
      <path d="M16.939 10.939 12 15.879l-4.939-4.94-2.122 2.122L12 20.121l7.061-7.06z"></path>
      <path d="M16.939 3.939 12 8.879l-4.939-4.94-2.122 2.122L12 13.121l7.061-7.06z"></path>
    </svg>
  );
}
