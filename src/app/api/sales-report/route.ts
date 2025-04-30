import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM raport_sprzedazy');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Failed to fetch sales report data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { dateFilter } = await request.json();
    
    let dateCondition = '';
    
    // Create date filter conditions
    if (dateFilter === 'today') {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      dateCondition = `WHERE DATE(date_add) = '${formattedDate}'`;
    } else if (dateFilter === 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const formattedDate = yesterday.toISOString().split('T')[0];
      dateCondition = `WHERE DATE(date_add) = '${formattedDate}'`;
    } else if (dateFilter === 'month') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const formattedDate = thirtyDaysAgo.toISOString().split('T')[0];
      dateCondition = `WHERE date_add >= '${formattedDate}'`;
    }
    
    // Build and execute the query with the updated table name
    const sql = `
      SELECT 
        reference,
        unit_price_tax_incl,
        product_quantity,
        total_price_brutto,
        date_add,
        product_name,
        stock_quantity,
        rabat
      FROM raport_sprzedazy
      ${dateCondition}
      ORDER BY date_add DESC
    `;
    
    const result = await query(sql);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}