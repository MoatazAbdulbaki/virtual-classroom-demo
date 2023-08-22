interface Props {
  tip: string;
  text: string;
  stylingClasses?: string;
  buttonStylingClasses?: string;
}

export const Tooltip: React.FC<Props> = ({
  text,
  tip,
  stylingClasses = "",
  buttonStylingClasses = "",
}) => {
  return (
    <div className={`tooltip ${stylingClasses}`} data-tip={tip}>
      <button
        className={`btn w-full cursor-not-allowed ${buttonStylingClasses}`}
      >
        {text}
      </button>
    </div>
  );
};

export default Tooltip;
