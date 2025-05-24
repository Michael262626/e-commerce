import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "../../../lib/generated/prisma"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword, // ✅ store hashed password
    },
  })

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  })
}
