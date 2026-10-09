import * as React from "react"
import { cn } from "@/lib/utils"

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, children, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div 
        className={cn("w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-xl", className)}
        role="dialog"
      >
        {children}
      </div>
    </div>
  )
}
