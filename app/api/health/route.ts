import { NextResponse } from 'next/server'
import { env, getIntegrationStatus, isLiveReady } from '@/lib/providers/env'

export async function GET() {
  return NextResponse.json({
    requestedMode: env.verificationMode,
    effectiveMode: isLiveReady() ? 'live' : 'demo',
    integrations: getIntegrationStatus(),
  })
}
