import * as React from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import Iconify from "../Iconify"

interface ShadcnDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  title?: string
  className?: string
  theme?: string
}

const ShadcnDrawer = React.forwardRef<
  React.ElementRef<typeof DrawerContent>,
  React.ComponentPropsWithoutRef<typeof DrawerContent> & ShadcnDrawerProps
>(({ open, onOpenChange, children, title, className, theme, ...props }, ref) => (
  <Drawer open={open} onOpenChange={onOpenChange}>
    <DrawerContent
      ref={ref}
      className={cn(
        "w-[320px] sm:w-[360px]",
        className
      )}
      data-vaul-drawer-direction="right"
      {...props}
    >
      {/* Header */}
      <DrawerHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DrawerTitle>{title}</DrawerTitle>
            <Iconify icon="mdi:chat" className="text-gray-500" width={20} />
          </div>
          <DrawerClose className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <Iconify icon="mdi:close" width={18} />
          </DrawerClose>
        </div>
      </DrawerHeader>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {children}
      </div>
    </DrawerContent>
  </Drawer>
))

ShadcnDrawer.displayName = "ShadcnDrawer"

export default ShadcnDrawer 