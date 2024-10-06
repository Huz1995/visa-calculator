// src/app/api/calendars/route.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Handle GET requests (Fetch calendars)
export async function GET() {
  try {
    const values = await prisma.calender.findMany();
    const calendars = values.map((value) => ({
      id: value.id,
      name: value.name,
      startDate: value.startDate,
      endDate: value.endDate,
      highlightedRange: value.highlightedRange.split(','),
      selectedDays: value.selectedDays.split(','),
    }));
    return new Response(JSON.stringify(calendars), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch calendars' }),
      {
        status: 500,
      }
    );
  }
}

// Handle POST requests (Add a calendar)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, startDate, endDate, highlightedRange, selectedDays } = body;

    const selectedDayStr =
      selectedDays.length === 0 ? '' : selectedDays.join(',');

    const highlightedRangeStr = highlightedRange
      ? highlightedRange.join(',')
      : '';

    const calender = {
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      highlightedRange: highlightedRangeStr,
      selectedDays: selectedDayStr,
    };

    await prisma.calender.create({
      data: calender,
    });

    return new Response(JSON.stringify('newCalender'), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Handle PUT requests (Update a calendar)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, startDate, endDate, highlightedRange, selectedDays } =
      body;

    const selectedDayStr =
      selectedDays.length === 0 ? '' : selectedDays.join(',');

    const highlightedRangeStr = highlightedRange
      ? highlightedRange.join(',')
      : '';

    const calender = {
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      highlightedRange: highlightedRangeStr,
      selectedDays: selectedDayStr,
    };

    await prisma.calender.update({
      where: { id: Number(id) },
      data: calender,
    });

    return new Response(JSON.stringify('updatedCalender'), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
