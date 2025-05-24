import { Building, Mail, MapPin, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import WhatsAppButton from "@/components/whatsapp-button"

export default function ContactPage() {
  return (
    <div className="container bg-white text-black px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Contact Us</h1>
          <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400">
            Have questions about our nylon production machinery? Get in touch with our team for expert advice and
            support.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
          <CardContent className="p-6">
  <form className="grid gap-4">
    <div className="grid gap-2">
      <Label htmlFor="name">Name</Label>
      <Input
        id="name"
        placeholder="Enter your name"
        className="bg-white text-black placeholder-black"
      />
    </div>
    <div className="grid gap-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        placeholder="Enter your email"
        className="bg-white text-black placeholder-black"
      />
    </div>
    <div className="grid gap-2">
      <Label htmlFor="phone">Phone</Label>
      <Input
        id="phone"
        type="tel"
        placeholder="Enter your phone number"
        className="bg-white text-black placeholder-black"
      />
    </div>
    <div className="grid gap-2">
      <Label htmlFor="message">Message</Label>
      <Textarea
        id="message"
        placeholder="Enter your message"
        className="min-h-[150px] bg-white text-black placeholder-black"
      />
    </div>
    <Button type="submit" className="w-full">
      Send Message
    </Button>
  </form>
</CardContent>

          </Card>

          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Our team is ready to assist you with any inquiries about our nylon production machinery.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-gray-500 dark:text-gray-400">+1 (234) 567-8900</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-gray-500 dark:text-gray-400">info@nylonmachinery.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    123 Industrial Parkway
                    <br />
                    Manufacturing District
                    <br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Business Hours</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Monday - Friday: 9:00 AM - 5:00 PM
                    <br />
                    Saturday: 10:00 AM - 2:00 PM
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-medium mb-2">Connect via WhatsApp</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                For quick responses and direct negotiations, connect with our sales team on WhatsApp.
              </p>
              <WhatsAppButton text="Chat with Sales Team" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
