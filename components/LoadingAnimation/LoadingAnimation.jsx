import styles from "./LoadingAnimation.module.scss";
import CircularProgress from "@mui/material/CircularProgress";

function LoadingAnimation() {
  return (
    <div className={styles.loadingContainer}>
      <CircularProgress />
    </div>
  );
}

export default LoadingAnimation;
