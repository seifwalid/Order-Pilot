'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Clock, Phone, User, DollarSign, ChefHat, CheckCircle, ShoppingBag, X } from 'lucide-react'

interface Order {
  id: string
  customer_name: string | null
  customer_phone: string | null
  customer_email: string | null
  type: 'dine_in' | 'takeout' | 'delivery' | null
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled' | null
  total_amount: number | null
  special_instructions: string | null
  placed_at: string | null
  estimated_ready_at: string | null
  source: string | null
  order_items: Array<{
    id: string
    item_name: string
    quantity: number
    unit_price: number
    total_price: number
    notes: string | null
    order_item_options: Array<{
      option_name: string
      price_delta: number | null
    }>
  }> | null
  customers: {
    name: string | null
    phone: string | null
    email: string | null
  } | null
}

interface OrdersBoardProps {
  orders: Order[]
  restaurant: any
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  preparing: 'bg-blue-100 text-blue-800 border-blue-200',
  ready: 'bg-green-100 text-green-800 border-green-200',
  completed: 'bg-gray-100 text-gray-800 border-gray-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
}

const statusIcons = {
  pending: Clock,
  preparing: ChefHat,
  ready: CheckCircle,
  completed: CheckCircle,
  cancelled: X,
}

export default function OrdersBoard({ orders: initialOrders, restaurant }: OrdersBoardProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  // Real-time subscription for orders
  useEffect(() => {
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `restaurant_id=eq.${restaurant.id}`,
        },
        (payload) => {
          console.log('Order change received:', payload)
          // Refetch orders when changes occur
          fetchOrders()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [restaurant.id])

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          order_item_options(*)
        ),
        customers(name, phone, email)
      `)
      .eq('restaurant_id', restaurant.id)
      .order('placed_at', { ascending: false })

    if (data) {
      setOrders(data)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled') => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          ...(newStatus === 'completed' && { completed_at: new Date().toISOString() })
        })
        .eq('id', orderId)

      if (error) throw error

      // Create status event
      const currentOrder = orders.find(o => o.id === orderId)
      if (currentOrder?.status && currentOrder.status !== null) {
        await supabase
          .from('order_status_events')
          .insert({
            order_id: orderId,
            from_status: currentOrder.status as 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled',
            to_status: newStatus,
          })
      }

      // Update local state
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus }
            : order
        )
      )
    } catch (error) {
      console.error('Error updating order status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getNextStatus = (currentStatus: Order['status']): 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled' | null => {
    if (!currentStatus) return null
    const statusFlow = {
      pending: 'preparing',
      preparing: 'ready',
      ready: 'completed',
      completed: null,
      cancelled: null,
    }
    return statusFlow[currentStatus] as 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled' | null
  }

  const getStatusAction = (status: Order['status']) => {
    if (!status) return 'Unknown'
    const actions = {
      pending: 'Start Preparing',
      preparing: 'Mark Ready',
      ready: 'Complete Order',
      completed: 'Completed',
      cancelled: 'Cancelled',
    }
    return actions[status]
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
        <p className="mt-2 text-gray-500">
          Orders will appear here when customers place them.
        </p>
      </div>
    )
  }

  const groupedOrders = {
    pending: orders.filter(o => o.status === 'pending'),
    preparing: orders.filter(o => o.status === 'preparing'),
    ready: orders.filter(o => o.status === 'ready'),
    completed: orders.filter(o => o.status === 'completed'),
  }

  return (
    <div className="space-y-6">
      {/* Active Orders Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Orders */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Pending ({groupedOrders.pending.length})
            </h2>
          </div>
          <div className="space-y-3">
            {groupedOrders.pending.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStatusUpdate={updateOrderStatus}
                isLoading={isLoading}
              />
            ))}
          </div>
        </div>

        {/* Preparing Orders */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Preparing ({groupedOrders.preparing.length})
            </h2>
          </div>
          <div className="space-y-3">
            {groupedOrders.preparing.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStatusUpdate={updateOrderStatus}
                isLoading={isLoading}
              />
            ))}
          </div>
        </div>

        {/* Ready Orders */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Ready ({groupedOrders.ready.length})
            </h2>
          </div>
          <div className="space-y-3">
            {groupedOrders.ready.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStatusUpdate={updateOrderStatus}
                isLoading={isLoading}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Completed Orders */}
      {groupedOrders.completed.length > 0 && (
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Completed Orders ({groupedOrders.completed.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedOrders.completed.slice(0, 6).map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStatusUpdate={updateOrderStatus}
                isLoading={isLoading}
                compact
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface OrderCardProps {
  order: Order
  onStatusUpdate: (orderId: string, status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled') => void
  isLoading: boolean
  compact?: boolean
}

function OrderCard({ order, onStatusUpdate, isLoading, compact = false }: OrderCardProps) {
  const getNextStatusForOrder = (currentStatus: Order['status']): 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled' | null => {
    if (!currentStatus) return null
    const statusFlow = {
      pending: 'preparing',
      preparing: 'ready',
      ready: 'completed',
      completed: null,
      cancelled: null,
    }
    return statusFlow[currentStatus] as 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled' | null
  }

  const nextStatus = getNextStatusForOrder(order.status)
  const StatusIcon = order.status ? statusIcons[order.status] : Clock

  const getStatusAction = (status: Order['status']) => {
    if (!status) return 'Unknown'
    const actions = {
      pending: 'Start Preparing',
      preparing: 'Mark Ready',
      ready: 'Complete Order',
      completed: 'Completed',
      cancelled: 'Cancelled',
    }
    return actions[status]
  }

  return (
    <Card className={`${compact ? 'opacity-75' : ''} transition-all duration-200 hover:shadow-md`}>
      <CardHeader className={compact ? 'pb-3' : 'pb-4'}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            #{order.id.slice(-6)}
          </CardTitle>
          <Badge className={order.status ? statusColors[order.status] : 'bg-gray-100 text-gray-800 border-gray-200'} variant="outline">
            <StatusIcon className="h-3 w-3 mr-1" />
            {order.status || 'Unknown'}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          {order.customer_name}
          {order.customer_phone && (
            <>
              <Phone className="h-4 w-4 ml-2" />
              {order.customer_phone}
            </>
          )}
        </div>
      </CardHeader>
      
      <CardContent className={compact ? 'pt-0' : ''}>
        <div className="space-y-3">
          {/* Order Items */}
          <div className="space-y-1">
            {order.order_items?.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.quantity}x {item.item_name}
                  {item.order_item_options?.length > 0 && (
                    <span className="text-gray-500 text-xs ml-1">
                      ({item.order_item_options.map(opt => opt.option_name).join(', ')})
                    </span>
                  )}
                </span>
                <span className="font-medium">
                  {formatCurrency(item.total_price)}
                </span>
              </div>
            )) || <p className="text-gray-500 text-sm">No items</p>}
          </div>

          {/* Special Instructions */}
          {order.special_instructions && (
            <div className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
              <strong>Note:</strong> {order.special_instructions}
            </div>
          )}

          {/* Order Details */}
          <div className="flex items-center justify-between text-sm border-t pt-2">
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span className="font-semibold">{formatCurrency(order.total_amount || 0)}</span>
            </div>
            <div className="text-gray-500">
              {order.placed_at ? formatDate(order.placed_at) : 'Unknown'}
            </div>
          </div>

          {/* Action Button */}
          {nextStatus && !compact && (
            <Button
              onClick={() => onStatusUpdate(order.id, nextStatus)}
              disabled={isLoading}
              className="w-full"
              size="sm"
            >
              {getStatusAction(order.status)}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
