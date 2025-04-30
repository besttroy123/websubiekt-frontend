import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT ID_STOCK, NAZWA_PRODUKTU, OPCJE, CENA_SPRZEDAZY_BRUTTO, CENA_ZAKUPU_NETTO, CENA_ZAKUPU_BRUTTO, STAN_MAGAZYNOWY, EAN13, GRUPA_TOWAROWA FROM stan_magazynowy');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory data' }, { status: 500 });
  }
}