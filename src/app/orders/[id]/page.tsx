import { fetchOrderById, TurneoOrderResponse } from '@/lib/turneo-api';
import OrderDetailsClient from './OrderDetailsClient';
import { Metadata } from 'next';

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

function isTurneoOrderResponse(obj: unknown): obj is TurneoOrderResponse {
  return obj !== null && typeof obj === 'object' && 'id' in obj && 'status' in obj;
}

export async function generateMetadata({ params }: OrderDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const order = await fetchOrderById(id);
  
  if (!isTurneoOrderResponse(order)) {
    return {
      title: 'Order Not Found - Turneo Experiences',
    };
  }
  
  return {
    title: `Order ${order.id} - Turneo Experiences`,
    description: `Order details for order ${order.id}`,
  };
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = await params;
  
  const order = await fetchOrderById(id);
  
  if (!isTurneoOrderResponse(order)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> Failed to load order details
        </div>
      </div>
    );
  }

  return <OrderDetailsClient order={order} />;
} 