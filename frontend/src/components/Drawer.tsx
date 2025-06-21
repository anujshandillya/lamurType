import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import Iconify from './Iconify';

interface DrawerProps {
  /**
   * Whether the drawer is open
   */
  open: boolean;
  
  /**
   * Callback when close button is clicked
   */
  onClose: () => void;
  
  /**
   * Drawer position
   */
  position?: 'left' | 'right' | 'top' | 'bottom';
  
  /**
   * Drawer width (for left/right) or height (for top/bottom)
   */
  size?: string;
  
  /**
   * Drawer title
   */
  title?: string;
  
  /**
   * Drawer content
   */
  children: React.ReactNode;
  
  /**
   * Additional class names for the drawer
   */
  className?: string;
  
  /**
   * Whether to show overlay
   */
  hasOverlay?: boolean;
}

export default function Drawer({
  open,
  onClose,
  position = 'right',
  size = position === 'left' || position === 'right' ? '320px' : '320px',
  title,
  children,
  className,
  hasOverlay = true,
}: DrawerProps) {
  const [isVisible, setIsVisible] = useState(open);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside drawer to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node) && open) {
        onClose();
      }
    };

    if (open && hasOverlay) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose, hasOverlay]);

  // Handle transitions and visibility
  useEffect(() => {
    if (open) {
      setIsVisible(true);
    } else {
      // Keep the element in DOM during transition
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // Match this with the CSS transition time
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Don't render anything if not visible
  if (!isVisible && !open) {
    return null;
  }

  // Determine drawer position styles
  const positionStyles = {
    left: {
      drawer: 'top-0 left-0 h-full',
      transform: open ? 'translateX(0)' : 'translateX(-100%)',
      width: size,
    },
    right: {
      drawer: 'top-0 right-0 h-full',
      transform: open ? 'translateX(0)' : 'translateX(100%)',
      width: size,
    },
    top: {
      drawer: 'top-0 left-0 w-full',
      transform: open ? 'translateY(0)' : 'translateY(-100%)',
      height: size,
    },
    bottom: {
      drawer: 'bottom-0 left-0 w-full',
      transform: open ? 'translateY(0)' : 'translateY(100%)',
      height: size,
    },
  }[position];

  return (
    <>
      {/* Overlay */}
      {hasOverlay && (
        <div
          className={clsx(
            'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
            open ? 'opacity-100' : 'opacity-0'
          )}
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={clsx(
            className,
          'fixed z-50 bg-black shadow-lg flex flex-col transition-transform duration-300 ease-in-out',
          positionStyles.drawer
        )}
        style={{
          transform: positionStyles.transform,
          width: position === 'left' || position === 'right' ? positionStyles.width : undefined,
          height: position === 'top' || position === 'bottom' ? positionStyles.height : undefined,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
            <div className='flex items-center gap-2'>
              <h2 className="text-xl font-medium">{title}</h2>
              <Iconify icon="mdi:chat" className="text-gray-500" width={32} />
            </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close drawer"
          >
            <Iconify icon="mdi:close" width={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-auto p-4">
          {children}
        </div>
      </div>
    </>
  );
}
