import React from 'react';

const ProfileAvatar = ({ name, email, size = 'md', className = '' }) => {
  const getInitials = () => {
    if (name) {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email
        .split('@')[0]
        .slice(0, 2)
        .toUpperCase();
    }
    return '??';
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-32 h-32 text-2xl',
  };

  // Using a consistent blue color based on oklch(0.488 0.243 264.376)
  const getBackgroundColor = () => {
    return 'bg-[#3B82F6]'; // This is the equivalent hex color for the oklch value
  };

  return (
    <div 
      className={`${sizeClasses[size]} ${getBackgroundColor()} rounded-full flex items-center justify-center text-white font-medium ${className}`}
    >
      {getInitials()}
    </div>
  );
};

export default ProfileAvatar; 