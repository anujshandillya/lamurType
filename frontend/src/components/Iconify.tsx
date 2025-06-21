import { forwardRef } from "react";
import { Icon } from "@iconify/react";

type IconifyProps = {
  className?: React.HTMLAttributes<HTMLElement>["className"];
  width?: number | string;
  icon: string;
  color?: string;
};

const Iconify = forwardRef<HTMLDivElement, IconifyProps>(
  ({ icon, width = 20, className, color }: IconifyProps, ref) => {
    return (
      <div ref={ref} className={className}>
        <Icon icon={icon} width={width} height={width} color={color} />
      </div>
    );
  }
);

export default Iconify;
