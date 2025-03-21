import { FC } from 'react';
import styles from './WaveAnimation.module.css';

interface WaveAnimationProps {
  isActive: boolean;
  scale?: number;
}

const WaveAnimation: FC<WaveAnimationProps> = ({ isActive, scale = 1 }) => {
  if (!isActive) return null;
  
  return (
    <div className={styles.waveContainer} style={{ transform: `scale(${scale})` }}>
      <div className={`${styles.wave} ${styles.wave1}`}></div>
      <div className={`${styles.wave} ${styles.wave2}`}></div>
      <div className={`${styles.wave} ${styles.wave3}`}></div>
      <div className={`${styles.wave} ${styles.wave4}`}></div>
    </div>
  );
};

export default WaveAnimation;
