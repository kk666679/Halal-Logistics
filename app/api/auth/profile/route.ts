import { NextResponse, NextRequest } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'

export async function GET(req: NextRequest) {
  // If there is no signed in user, this will return a 404 error
  await auth.protect()

  const { userId } = await auth()

  if (!userId) return NextResponse.redirect(new URL('/sign-in', req.url))

  const client = await clerkClient()

  const user = await client.users.getUser(userId)

  return NextResponse.json({ user })
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()

  if (!userId) return NextResponse.redirect(new URL('/sign-in', req.url))

  const params = { firstName: 'John', lastName: 'Wick' }

  const client = await clerkClient()

  const user = await client.users.updateUser(userId, params)

  return NextResponse.json({ user })
}
