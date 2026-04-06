import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    
    // const path = window.location.pathname
    let audienceId: string = process.env.RESEND_NEWSLETTER_AUDIENCE_ID || ''// default to newsletter
    // if (path.includes('kids-corner')) {
    //   audienceId = process.env.RESEND_NOTIFY_AUDIENCE_ID || ''
    // }

    await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error subscribing:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}