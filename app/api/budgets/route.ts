import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Budget from '@/models/Budget';

export async function GET() {
  try {
    await dbConnect();
    const budgets = await Budget.find({});
    return NextResponse.json(budgets || []);
  } catch (error) {
    console.error('Failed to fetch budgets:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const budget = await Budget.create(data);
    return NextResponse.json(budget);
  } catch (error) {
    console.error('Failed to create budget:', error);
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 });
  }
}