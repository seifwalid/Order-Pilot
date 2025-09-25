// convex/schema.ts
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  restaurants: defineTable({
    name: v.string(),
    ownerId: v.string(), // Assuming auth.users(id) is a string UUID
    email: v.string(),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    onboardingCompleted: v.boolean(),
    isActive: v.boolean(),
    // Timestamps are automatically handled for _creationTime.
    // updated_at from SQL can be handled manually in mutations:
    updatedAt: v.number(),
  })
    .index('by_owner_id', ['ownerId'])
    .index('by_is_active', ['isActive']),
  
  restaurantSettings: defineTable({
    restaurantId: v.id('restaurants'),
    timezone: v.string(),
    currency: v.string(),
    taxRate: v.number(),
    serviceFee: v.number(),
    updatedAt: v.number(), // manual
  })
    .index('by_restaurant_id', ['restaurantId']),

  restaurantStaff: defineTable({
    restaurantId: v.id('restaurants'),
    userId: v.string(), // Assuming auth.users(id) is a string UUID
    role: v.union(v.literal('owner'), v.literal('manager'), v.literal('staff')),
    invitedAt: v.number(), // Unix timestamp
    acceptedAt: v.optional(v.number()),
    isActive: v.boolean(),
  })
    .index('by_restaurant_id', ['restaurantId'])
    .index('by_user_id', ['userId'])
    .index('by_restaurant_user', ['restaurantId', 'userId']), // For the UNIQUE constraint

  staffInvitations: defineTable({
    restaurantId: v.id('restaurants'),
    email: v.string(),
    role: v.union(v.literal('owner'), v.literal('manager'), v.literal('staff')),
    invitedBy: v.string(), // Assuming auth.users(id) is a string UUID
    status: v.union(v.literal('pending'), v.literal('accepted'), v.literal('expired')),
    token: v.string(),
    expiresAt: v.number(), // Unix timestamp
    acceptedAt: v.optional(v.number()),
  })
    .index('by_restaurant_id', ['restaurantId'])
    .index('by_email', ['email'])
    .index('by_token', ['token']),

  categories: defineTable({
    restaurantId: v.id('restaurants'),
    name: v.string(),
    description: v.optional(v.string()),
    position: v.number(),
    isActive: v.boolean(),
    updatedAt: v.number(), // manual
  })
    .index('by_restaurant_id', ['restaurantId'])
    .index('by_restaurant_position', ['restaurantId', 'position']),

  menuItems: defineTable({
    restaurantId: v.id('restaurants'),
    categoryId: v.optional(v.id('categories')), // ON DELETE SET NULL
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    imageUrl: v.optional(v.string()),
    isAvailable: v.boolean(),
    position: v.number(),
    updatedAt: v.number(), // manual
  })
    .index('by_restaurant_id', ['restaurantId'])
    .index('by_category_id', ['categoryId'])
    .index('by_restaurant_is_available', ['restaurantId', 'isAvailable']),

  optionGroups: defineTable({
    restaurantId: v.id('restaurants'),
    name: v.string(),
    description: v.optional(v.string()),
    isRequired: v.boolean(),
    maxSelect: v.number(),
    position: v.number(),
  })
    .index('by_restaurant_id', ['restaurantId']),

  options: defineTable({
    optionGroupId: v.id('optionGroups'),
    name: v.string(),
    priceDelta: v.number(),
    position: v.number(),
    isAvailable: v.boolean(),
  })
    .index('by_option_group_id', ['optionGroupId']),

  menuItemOptionGroups: defineTable({
    menuItemId: v.id('menuItems'),
    optionGroupId: v.id('optionGroups'),
    position: v.number(),
  })
    .index('by_menu_item_id', ['menuItemId'])
    .index('by_option_group_id', ['optionGroupId'])
    .index('by_menu_item_option_group', ['menuItemId', 'optionGroupId']),

  customers: defineTable({
    restaurantId: v.id('restaurants'),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    updatedAt: v.number(), // manual
  })
    .index('by_restaurant_id', ['restaurantId'])
    .index('by_restaurant_phone', ['restaurantId', 'phone']),

  orders: defineTable({
    restaurantId: v.id('restaurants'),
    customerId: v.optional(v.id('customers')), // ON DELETE SET NULL
    customerName: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    type: v.union(v.literal('dine_in'), v.literal('takeout'), v.literal('delivery')),
    status: v.union(v.literal('pending'), v.literal('preparing'), v.literal('ready'), v.literal('completed'), v.literal('cancelled')),
    subtotal: v.number(),
    taxAmount: v.number(),
    serviceFee: v.number(),
    totalAmount: v.number(),
    specialInstructions: v.optional(v.string()),
    source: v.string(), // 'manual', 'vapi', 'online'
    placedAt: v.number(), // Unix timestamp
    estimatedReadyAt: v.optional(v.number()), // Unix timestamp
    completedAt: v.optional(v.number()), // Unix timestamp
    updatedAt: v.number(), // manual
  })
    .index('by_restaurant_id', ['restaurantId'])
    .index('by_restaurant_status', ['restaurantId', 'status'])
    .index('by_restaurant_placed_at', ['restaurantId', 'placedAt']),

  orderItems: defineTable({
    orderId: v.id('orders'),
    menuItemId: v.optional(v.id('menuItems')), // ON DELETE SET NULL
    itemName: v.string(),
    itemDescription: v.optional(v.string()),
    quantity: v.number(),
    unitPrice: v.number(),
    totalPrice: v.number(),
    notes: v.optional(v.string()),
  })
    .index('by_order_id', ['orderId']),

  orderItemOptions: defineTable({
    orderItemId: v.id('orderItems'),
    optionId: v.optional(v.id('options')), // ON DELETE SET NULL
    optionName: v.string(),
    priceDelta: v.number(),
  })
    .index('by_order_item_id', ['orderItemId']),

  orderStatusEvents: defineTable({
    orderId: v.id('orders'),
    fromStatus: v.optional(v.union(v.literal('pending'), v.literal('preparing'), v.literal('ready'), v.literal('completed'), v.literal('cancelled'))),
    toStatus: v.union(v.literal('pending'), v.literal('preparing'), v.literal('ready'), v.literal('completed'), v.literal('cancelled')),
    actorUserId: v.optional(v.string()), // Assuming auth.users(id) is a string UUID
    notes: v.optional(v.string()),
  })
    .index('by_order_id', ['orderId']),

  agentChannels: defineTable({
    restaurantId: v.id('restaurants'),
    channelName: v.string(),
    did: v.optional(v.string()),
    agentConfig: v.any(), // JSONB can be mapped to v.any() or a more specific object schema
    isActive: v.boolean(),
    updatedAt: v.number(), // manual
  })
    .index('by_restaurant_id', ['restaurantId']),
});