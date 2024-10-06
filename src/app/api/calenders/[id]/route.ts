// pages/api/calendars/[id].ts
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

// Handle DELETE requests (Delete a calendar)
export async function DELETE(request: Request) {
  try {
    // Extract the id from the query parameters
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    console.log(id);

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Delete the calendar from the database
    await prisma.calender.delete({
      where: { id: Number(id) },
    });

    return new Response(
      JSON.stringify({ message: 'Calendar deleted successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
