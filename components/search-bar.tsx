"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
     <div className="flex-1 relative">
  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
  <Input
    placeholder="Search for nylon production machinery..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="pl-12 h-12 text-base text-black bg-white border-2 border-gray-200 focus:border-primary placeholder-white"
  />
</div>

      <div className="flex gap-2 w-full md:w-auto">
        <Select>
          <SelectTrigger className="w-full bg-white text-black md:w-[180px] h-12">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-white text-black">
            <SelectItem value="spinning">Spinning Machines</SelectItem>
            <SelectItem value="extruders">Extruders</SelectItem>
            <SelectItem value="twisting">Twisting Machines</SelectItem>
            <SelectItem value="heat-treatment">Heat Treatment</SelectItem>
            <SelectItem value="drawing">Drawing Machines</SelectItem>
            <SelectItem value="mixing">Mixing Equipment</SelectItem>
          </SelectContent>
        </Select>

        <Button size="lg" className="px-8">
          <Search className="mr-2 h-5 w-5" />
          Search
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="px-4 bg-white text-black hover:bg-white hover:text-black hover:shadow-none hover:no-underline"
        >
      <Filter className="h-5 w-5" />
  </Button>
      </div>
    </div>
  )
}
