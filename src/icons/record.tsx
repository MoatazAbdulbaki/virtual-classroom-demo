interface Props {
  width?: string;
  height?: string;
  stylingClasses?: string;
}
export function RecordIcon({
  height = "25px",
  width = "25px",
  stylingClasses = "",
}: Props) {
  return (
    <svg
      width={width}
      height={height}
      fill="grey"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={stylingClasses}
    >
      <path
        d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="4" fill="grey" />
    </svg>
  );
}
