"use client"

import * as React from "react"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"

interface PopoverContextType {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLDivElement | null>
}

const PopoverContext = React.createContext<PopoverContextType | null>(null)

function usePopoverContext() {
  const context = React.useContext(PopoverContext)
  if (!context) {
    throw new Error("Popover components must be used within a Popover")
  }
  return context
}

interface PopoverProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

function Popover({ open: controlledOpen, onOpenChange, children }: PopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLDivElement>(null)
  
  const open = controlledOpen ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  const value = React.useMemo(
    () => ({
      open,
      setOpen,
      triggerRef,
    }),
    [open, setOpen]
  )

  return (
    <PopoverContext.Provider value={value}>
      {children}
    </PopoverContext.Provider>
  )
}

interface PopoverTriggerProps {
  children: React.ReactNode
}

function PopoverTrigger({ children }: PopoverTriggerProps) {
  const { setOpen, triggerRef } = usePopoverContext()

  const handleClick = () => {
    setOpen(true)
  }

  return (
    <div
      ref={triggerRef}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </div>
  )
}

interface PopoverContentProps {
  className?: string
  align?: "start" | "center" | "end"
  sideOffset?: number
  children: React.ReactNode
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  children 
}: PopoverContentProps) {
  const { open, setOpen, triggerRef } = usePopoverContext()
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [position, setPosition] = React.useState({ top: 0, left: 0 })

  React.useEffect(() => {
    if (!open || !triggerRef.current || !contentRef.current) return

    const updatePosition = () => {
      const triggerRect = triggerRef.current!.getBoundingClientRect()
      const contentRect = contentRef.current!.getBoundingClientRect()
      
      let left = triggerRect.left
      if (align === "center") {
        left = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2)
      } else if (align === "end") {
        left = triggerRect.right - contentRect.width
      }

      const top = triggerRect.bottom + sideOffset

      setPosition({ top, left })
    }

    updatePosition()
    window.addEventListener("resize", updatePosition)
    return () => window.removeEventListener("resize", updatePosition)
  }, [open, align, sideOffset])

  React.useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open, setOpen])

  if (!open) return null

  const content = (
    <div
      ref={contentRef}
        className={cn(
        "bg-popover text-popover-foreground z-50 w-72 rounded-md border p-4 shadow-md outline-hidden",
        "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2",
          className
        )}
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
      }}
    >
      {children}
    </div>
  )

  return createPortal(content, document.body)
}

interface PopoverAnchorProps {
  children: React.ReactNode
}

function PopoverAnchor({ children }: PopoverAnchorProps) {
  return <>{children}</>
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
