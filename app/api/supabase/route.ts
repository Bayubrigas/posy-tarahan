import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, table, select, filter, order } = body;

    if (action === 'select') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query: any = supabase.from(table).select(select);

      if (filter) {
        // Handle different operators explicitly
        switch (filter.operator) {
          case 'eq':
            query = query.eq(filter.column, filter.value);
            break;
          case 'neq':
            query = query.neq(filter.column, filter.value);
            break;
          case 'gt':
            query = query.gt(filter.column, filter.value);
            break;
          case 'gte':
            query = query.gte(filter.column, filter.value);
            break;
          case 'lt':
            query = query.lt(filter.column, filter.value);
            break;
          case 'lte':
            query = query.lte(filter.column, filter.value);
            break;
          case 'like':
            query = query.like(filter.column, filter.value);
            break;
          case 'ilike':
            query = query.ilike(filter.column, filter.value);
            break;
          case 'in':
            query = query.in(filter.column, filter.value);
            break;
          default:
            return NextResponse.json(
              { error: 'Invalid operator' }, 
              { status: 400 }
            );
        }
      }

      if (order) {
        query = query.order(order.column, { ascending: order.ascending });
      }

      const { data, error } = await query;

      if (error) {
        return NextResponse.json({ error }, { status: 400 });
      }

      return NextResponse.json({ data });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}