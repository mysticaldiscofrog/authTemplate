import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';

export async function GET() {
  await dbConnect();
  try {
    const users = await User.find({}).select('-password');
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body = await request.json();
    const { email } = body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'User already exists' }, { status: 400 });
    }

    const user = await User.create(body);
    const userResponse = user.toObject();
    delete userResponse.password;
    return NextResponse.json({ success: true, data: userResponse }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        return NextResponse.json({ success: false, error: 'Validation failed', details: error.message }, { status: 400 });
      } else {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }
    } else {
      return NextResponse.json({ success: false, error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}