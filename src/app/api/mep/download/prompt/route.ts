import { NextResponse } from 'next/server'

export async function POST(req : Request) {
  const {prompt} = await req.json()

  const json = JSON.stringify(prompt, null, 2)

  return new NextResponse(json, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="Prompt.json"',
    },
  })
}
