import * as React from 'react';
import { Button as Buttonx, buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

type ButtonProps = {
  isLoading?: boolean;
  isDarkBg?: boolean;
  variant?: ButtonVariant;
  size?: 'default' | 'sm' | 'lg' | 'icon';
} & React.ComponentPropsWithRef<'button'>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant = 'default', size = 'default', isLoading, isDarkBg, ...rest }, ref) => {
    return (
      <Buttonx
        className={cn(
          // Custom styles for your specific design
          isDarkBg && "bg-fg text-bg shadow-fg/50 hover:bg-fg/90",
          isLoading && "opacity-50 cursor-not-allowed",
          // Add any additional custom classes
          className
        )}
        variant={variant}
        size={size}
        ref={ref}
        disabled={isLoading}
        {...rest}
      >
        {isLoading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </Buttonx>
    );
  }
);

Button.displayName = 'Button';

export default Button;