
import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "../../../lib/generated/prisma"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: "Missing email or password" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  // Here you should create a session or JWT token instead of sending user info directly
  // For demo, return user info without password
  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  })
}
