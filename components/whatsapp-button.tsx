"use client"

import { PhoneIcon as WhatsappIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface WhatsAppButtonProps {
  productName?: string
  text?: string
  variant?: "default" | "secondary" | "outline"
  size?: "default" | "sm" | "lg"
  className?: string
}

export default function WhatsAppButton({
  productName,
  text = "Contact via WhatsApp",
  variant = "default",
  size = "default",
  className,
}: WhatsAppButtonProps) {
  const phoneNumber = "07060922125" // Replace with your actual WhatsApp number

  const handleWhatsAppClick = () => {
    const message = productName
      ? `Hello, I'm interested in the ${productName}. Can you provide more information?`
      : "Hello, I'm interested in your nylon production machinery. Can you provide more information?"

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

    window.open(whatsappUrl, "_blank")
  }

  return (
    <Button
      onClick={handleWhatsAppClick}
      variant={variant}
      size={size}
      className={cn("flex items-center gap-2", className)}
    >
      <WhatsappIcon className="h-4 w-4" />
      {text}
    </Button>
  )
}
