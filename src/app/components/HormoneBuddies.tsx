import React from 'react';
import Image from 'next/image';

interface HormoneBuddiesGroupProps {
  className?: string;
}

export const HormoneBuddiesGroup: React.FC<HormoneBuddiesGroupProps> = ({ className = '' }) => {
  return (
    <Image
      src="/hormone_buddies.avif"
      alt="Hormone Buddies - Friendly cartoon characters representing different hormones"
      width={600}
      height={200}
      style={{
        width: '100%',
        height: 'auto',
        maxWidth: '600px'
      }}
      priority
    />
  );
};

export const ProgressBuddies: React.FC<{
  current: number;
  total: number;
  className?: string
}> = ({ current, total, className = '' }) => {
  return (
    <div className={`progress-buddies ${className}`}>
      <Image
        src="/hormone_buddies.avif"
        alt="Hormone Buddies Progress"
        width={400}
        height={100}
        style={{
          width: '100%',
          height: 'auto',
          maxWidth: '400px'
        }}
      />
      <div className="progress-text">
        Question {current} of {total}
      </div>
    </div>
  );
};

export default HormoneBuddiesGroup; 