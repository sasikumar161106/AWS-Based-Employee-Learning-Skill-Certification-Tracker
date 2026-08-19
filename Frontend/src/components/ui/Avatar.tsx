import React from 'react';
import { cn } from '../../utils/helpers';
import { User } from 'lucide-react';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 'md',
  className
}) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

 

  return (
    <div
      className={cn(
       'relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden bg-slate-100 text-slate-450 border border-slate-200 select-none',
        sizes[size],
        className
      )}
    >
      <User className="w-1/2 h-1/2 text-slate-400" />
    </div>
  );
};
export default Avatar;
