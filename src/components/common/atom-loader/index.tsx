import styles from "./styles.module.css";

interface Props {
  width?: string;
  height?: string;
}

export function AtomLoader({ height = "100px", width = "100px" }: Props) {
  return (
    <div
      className={`${styles.cssloadLoader}`}
      style={{ width: width, height: height }}
    >
      <div className={`${styles.cssloadInner} ${styles.cssloadOne}`}></div>
      <div className={`${styles.cssloadInner} ${styles.cssloadTwo}`}></div>
      <div className={`${styles.cssloadInner} ${styles.cssloadThree}`}></div>
    </div>
  );
}

export default AtomLoader
