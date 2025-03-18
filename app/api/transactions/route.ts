import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

export const dynamic = "force-dynamic"; 

export async function GET() {
  try {
    await dbConnect();
    const transactions = await Transaction.find({}).sort({ date: -1 });
    return NextResponse.json(transactions || []);
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const transaction = await Transaction.create(data);
    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Failed to create transaction:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}