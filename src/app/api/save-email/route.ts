import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Upstash Redis client
let redis: Redis | null = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
} catch (error) {
  console.error('Failed to initialize Redis client:', error);
}

export async function POST(request: NextRequest) {
  // Check if Redis is available
  if (!redis) {
    return NextResponse.json({ 
      success: false, 
      message: 'Database connection not available. Please check environment variables.'
    }, { status: 500 });
  }

  try {
    const { responseId, email } = await request.json();

    if (!responseId || !email) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing responseId or email' 
      }, { status: 400 });
    }

    // Get the existing response data
    const responseData = await redis.get(responseId);
    if (!responseData) {
      return NextResponse.json({ 
        success: false, 
        message: 'Response not found' 
      }, { status: 404 });
    }

    // Update the response with the email
    const updatedResponse = {
      ...responseData,
      email: email
    };

    // Save the updated response
    await redis.set(responseId, updatedResponse);

    // Update email counts
    await redis.incr('with_email_count');
    await redis.decr('no_email_count');

    return NextResponse.json({ 
      success: true, 
      message: 'Email saved successfully' 
    });

  } catch (error) {
    console.error('Error saving email:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to save email',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : 'Internal server error'
    }, { status: 500 });
  }
} 