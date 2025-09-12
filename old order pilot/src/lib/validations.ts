import { z } from "zod"

// Restaurant schemas
export const createRestaurantSchema = z.object({
  name: z.string().min(2, "Restaurant name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
})

export const updateRestaurantSchema = createRestaurantSchema.partial()

// Menu item schemas
export const createMenuItemSchema = z.object({
  name: z.string().min(1, "Menu item name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  category_id: z.string().uuid().optional(),
  is_available: z.boolean().default(true),
  position: z.number().int().min(0).default(0),
})

export const updateMenuItemSchema = createMenuItemSchema.partial()

// Category schemas
export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  position: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
})

export const updateCategorySchema = createCategorySchema.partial()

// Order schemas
export const createOrderSchema = z.object({
  customer_name: z.string().min(1, "Customer name is required"),
  customer_phone: z.string().optional(),
  customer_email: z.string().email().optional().or(z.literal("")),
  type: z.enum(["dine_in", "takeout", "delivery"]).default("takeout"),
  special_instructions: z.string().optional(),
  items: z.array(z.object({
    menu_item_id: z.string().uuid().optional(),
    item_name: z.string().min(1),
    item_description: z.string().optional(),
    quantity: z.number().int().min(1),
    unit_price: z.number().min(0),
    notes: z.string().optional(),
    options: z.array(z.object({
      option_id: z.string().uuid().optional(),
      option_name: z.string().min(1),
      price_delta: z.number().default(0),
    })).optional(),
  })).min(1, "At least one item is required"),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "preparing", "ready", "completed", "cancelled"]),
  notes: z.string().optional(),
})

// Staff schemas
export const inviteStaffSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["manager", "staff"]),
})

export const updateStaffSchema = z.object({
  role: z.enum(["owner", "manager", "staff"]),
  is_active: z.boolean(),
})

// VAPI schemas
export const createAgentChannelSchema = z.object({
  channel_name: z.string().min(1, "Channel name is required"),
  did: z.string().optional(),
  agent_config: z.record(z.any()).optional(),
})

export const updateAgentChannelSchema = createAgentChannelSchema.partial()

// Settings schemas
export const updateRestaurantSettingsSchema = z.object({
  timezone: z.string().optional(),
  currency: z.string().length(3).optional(),
  tax_rate: z.number().min(0).max(1).optional(),
  service_fee: z.number().min(0).max(1).optional(),
})

// Type exports
export type CreateRestaurant = z.infer<typeof createRestaurantSchema>
export type UpdateRestaurant = z.infer<typeof updateRestaurantSchema>
export type CreateMenuItem = z.infer<typeof createMenuItemSchema>
export type UpdateMenuItem = z.infer<typeof updateMenuItemSchema>
export type CreateCategory = z.infer<typeof createCategorySchema>
export type UpdateCategory = z.infer<typeof updateCategorySchema>
export type CreateOrder = z.infer<typeof createOrderSchema>
export type UpdateOrderStatus = z.infer<typeof updateOrderStatusSchema>
export type InviteStaff = z.infer<typeof inviteStaffSchema>
export type UpdateStaff = z.infer<typeof updateStaffSchema>
export type CreateAgentChannel = z.infer<typeof createAgentChannelSchema>
export type UpdateAgentChannel = z.infer<typeof updateAgentChannelSchema>
export type UpdateRestaurantSettings = z.infer<typeof updateRestaurantSettingsSchema>
