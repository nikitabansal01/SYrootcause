import Link from 'next/link'
import Image from 'next/image'
import styles from './Home.module.css'
import { HormoneBuddiesGroup } from './components/HormoneBuddies'
import buddyStyles from './components/HormoneBuddies.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logoSection}>
          <Image
            src="/Logo.png"
            alt="Hormone Health Platform Logo"
            width={120}
            height={60}
            style={{
              width: 'auto',
              height: '60px',
              marginBottom: '1rem'
            }}
            priority
          />
        </div>
        
        <p className={styles.healingTagline}>Healing starts with understanding your hormones</p>
        
        <HormoneBuddiesGroup className={buddyStyles.hormoneBuddiesGroup} />
        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>📋</span>
            <span>8-question hormone assessment</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🔬</span>
            <span>Lab value analysis</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>💡</span>
            <span>Personalized recommendations</span>
          </div>
        </div>
        <Link href="/survey" className={styles.startButton}>
          Start Assessment
        </Link>
        
        {/* Admin Link - Only show in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className={styles.adminLink}>
            <Link href="/admin-dashboard" className={styles.adminButton}>
              🔬 Medical Expert Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  )
} 