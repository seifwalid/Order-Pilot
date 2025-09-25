// convex/db_functions.ts
import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
import type { Doc, Id } from './_generated/dataModel';

// =============================================
// RESTAURANTS
// =============================================

export const getRestaurants = query({
  handler: async (ctx) => {
    return ctx.db.query('restaurants').collect();
  },
});

export const getRestaurantById = query({
  args: { id: v.id('restaurants') },
  handler: async (ctx, args) => {
    return ctx.db.get(args.id);
  },
});

export const getRestaurantsByOwner = query({
  args: { ownerId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db.query('restaurants').withIndex('by_owner_id', q => q.eq('ownerId', args.ownerId)).collect();
  },
});

export const createRestaurant = mutation({
  args: {
    name: v.string(),
    ownerId: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // You might add checks for unique emails here before inserting
    const existingRestaurant = await ctx.db.query('restaurants')
      .filter(q => q.eq(q.field('email'), args.email))
      .first();

    if (existingRestaurant) {
      throw new Error('Restaurant with this email already exists.');
    }

    const restaurantId = await ctx.db.insert('restaurants', {
      name: args.name,
      ownerId: args.ownerId,
      email: args.email,
      phone: args.phone,
      address: args.address,
      onboardingCompleted: false, // Default
      isActive: true, // Default
      updatedAt: Date.now(), // Manual timestamp
    });
    return restaurantId;
  },
});

export const updateRestaurant = mutation({
  args: {
    id: v.id('restaurants'),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    onboardingCompleted: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, { ...rest, updatedAt: Date.now() });
  },
});

export const deleteRestaurant = mutation({
  args: { id: v.id('restaurants') },
  handler: async (ctx, args) => {
    // IMPORTANT: Implement cascading deletes for related tables here
    // Example: Delete all restaurant settings, staff, categories, etc.
    const restaurantId = args.id;

    // Delete related restaurant settings
    const settings = await ctx.db.query('restaurantSettings')
      .withIndex('by_restaurant_id', q => q.eq('restaurantId', restaurantId))
      .collect();
    await Promise.all(settings.map(s => ctx.db.delete(s._id)));

    // Delete related staff
    const staff = await ctx.db.query('restaurantStaff')
      .withIndex('by_restaurant_id', q => q.eq('restaurantId', restaurantId))
      .collect();
    await Promise.all(staff.map(s => ctx.db.delete(s._id)));

    // ... continue for all other tables referencing restaurantId (categories, menuItems, etc.)

    await ctx.db.delete(restaurantId);
  },
});

// =============================================
// RESTAURANT SETTINGS
// =============================================

export const getRestaurantSettings = query({
  args: { restaurantId: v.id('restaurants') },
  handler: async (ctx, args) => {
    return ctx.db.query('restaurantSettings')
      .withIndex('by_restaurant_id', q => q.eq('restaurantId', args.restaurantId))
      .first(); // Assuming one setting per restaurant
  },
});

export const createRestaurantSetting = mutation({
  args: {
    restaurantId: v.id('restaurants'),
    timezone: v.optional(v.string()),
    currency: v.optional(v.string()),
    taxRate: v.optional(v.number()),
    serviceFee: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Ensure only one setting per restaurant
    const existingSetting = await ctx.db.query('restaurantSettings')
      .withIndex('by_restaurant_id', q => q.eq('restaurantId', args.restaurantId))
      .first();

    if (existingSetting) {
      throw new Error('Restaurant settings already exist for this restaurant.');
    }

    return ctx.db.insert('restaurantSettings', {
      restaurantId: args.restaurantId,
      timezone: args.timezone ?? 'America/New_York', // Default
      currency: args.currency ?? 'USD', // Default
      taxRate: args.taxRate ?? 0.0875, // Default
      serviceFee: args.serviceFee ?? 0.0000, // Default
      updatedAt: Date.now(),
    });
  },
});

export const updateRestaurantSetting = mutation({
  args: {
    restaurantId: v.id('restaurants'), // Use restaurantId to find the setting
    timezone: v.optional(v.string()),
    currency: v.optional(v.string()),
    taxRate: v.optional(v.number()),
    serviceFee: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const setting = await ctx.db.query('restaurantSettings')
      .withIndex('by_restaurant_id', q => q.eq('restaurantId', args.restaurantId))
      .first();

    if (!setting) {
      throw new Error('Restaurant settings not found.');
    }

    const { restaurantId, ...rest } = args; // Don't try to update restaurantId
    await ctx.db.patch(setting._id, { ...rest, updatedAt: Date.now() });
  },
});

// =============================================
// STAFF MANAGEMENT (RESTAURANT_STAFF & STAFF_INVITATIONS)
// =============================================

export const getRestaurantStaff = query({
  args: { restaurantId: v.id('restaurants') },
  handler: async (ctx, args) => {
    return ctx.db.query('restaurantStaff')
      .withIndex('by_restaurant_id', q => q.eq('restaurantId', args.restaurantId))
      .collect();
  },
});

export const getStaffById = query({
  args: { id: v.id('restaurantStaff') },
  handler: async (ctx, args) => {
    return ctx.db.get(args.id);
  },
});

export const createRestaurantStaff = mutation({
  args: {
    restaurantId: v.id('restaurants'),
    userId: v.string(),
    role: v.union(v.literal('owner'), v.literal('manager'), v.literal('staff')),
    invitedAt: v.optional(v.number()),
    acceptedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Enforce UNIQUE(restaurant_id, user_id)
    const existingStaff = await ctx.db.query('restaurantStaff')
      .withIndex('by_restaurant_user', q =>
        q.eq('restaurantId', args.restaurantId).eq('userId', args.userId)
      )
      .first();

    if (existingStaff) {
      throw new Error('User is already staff at this restaurant.');
    }

    return ctx.db.insert('restaurantStaff', {
      restaurantId: args.restaurantId,
      userId: args.userId,
      role: args.role,
      invitedAt: args.invitedAt ?? Date.now(),
      acceptedAt: args.acceptedAt,
      isActive: true, // Default
    });
  },
});

export const updateRestaurantStaff = mutation({
  args: {
    id: v.id('restaurantStaff'),
    role: v.optional(v.union(v.literal('owner'), v.literal('manager'), v.literal('staff'))),
    isActive: v.optional(v.boolean()),
    acceptedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest); // No updatedAt for this table in SQL schema, so none here
  },
});

export const deleteRestaurantStaff = mutation({
  args: { id: v.id('restaurantStaff') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// STAFF INVITATIONS
export const getStaffInvitations = query({
  args: { restaurantId: v.id('restaurants') },
  handler: async (ctx, args) => {
    return ctx.db.query('staffInvitations')
      .withIndex('by_restaurant_id', q => q.eq('restaurantId', args.restaurantId))
      .collect();
  },
});

export const getStaffInvitationByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    return ctx.db.query('staffInvitations')
      .withIndex('by_token', q => q.eq('token', args.token))
      .first();
  },
});

export const createStaffInvitation = mutation({
  args: {
    restaurantId: v.id('restaurants'),
    email: v.string(),
    role: v.union(v.literal('owner'), v.literal('manager'), v.literal('staff')),
    invitedBy: v.string(),
    // token and expiresAt are generated by default in SQL, here we need to explicitly create
  },
  handler: async (ctx, args) => {
    // Generate a simple token for example, in production use a more robust UUID/crypto
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    return ctx.db.insert('staffInvitations', {
      restaurantId: args.restaurantId,
      email: args.email,
      role: args.role,
      invitedBy: args.invitedBy,
      status: 'pending', // Default
      token: token,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
      acceptedAt: undefined, // Optional field
    });
  },
});

export const updateStaffInvitation = mutation({
  args: {
    id: v.id('staffInvitations'),
    status: v.optional(v.union(v.literal('pending'), v.literal('accepted'), v.literal('expired'))),
    acceptedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const deleteStaffInvitation = mutation({
  args: { id: v.id('staffInvitations') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});


// =============================================
// MENU SYSTEM (CATEGORIES, MENU_ITEMS, OPTION_GROUPS, OPTIONS, MENU_ITEM_OPTION_GROUPS)
// =============================================

// CATEGORIES
export const getCategories = query({
  args: { restaurantId: v.id('restaurants') },
  handler: async (ctx, args) => {
    return ctx.db.query('categories')
      .withIndex('by_restaurant_id', q => q.eq('restaurantId', args.restaurantId))
      .collect();
  },
});

export const createCategory = mutation({
  args: {
    restaurantId: v.id('restaurants'),
    name: v.string(),
    description: v.optional(v.string()),
    position: v.number(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert('categories', {
      restaurantId: args.restaurantId,
      name: args.name,
      description: args.description,
      position: args.position,
      isActive: true,
      updatedAt: Date.now(),
    });
  },
});

export const updateCategory = mutation({
  args: {
    id: v.id('categories'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    position: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, { ...rest, updatedAt: Date.now() });
  },
});

export const deleteCategory = mutation({
  args: { id: v.id('categories') },
  handler: async (ctx, args) => {
    // ON DELETE SET NULL for menu_items.category_id
    // Find all menu items referencing this category and set categoryId to null
    const menuItemsToUpdate = await ctx.db.query('menuItems')
      .filter(q => q.eq(q.field('categoryId'), args.id))
      .collect();

    await Promise.all(
      menuItemsToUpdate.map(item =>
        ctx.db.patch(item._id, { categoryId: undefined, updatedAt: Date.now() }) // undefined effectively removes the field
      )
    );

    await ctx.db.delete(args.id);
  },
});

// MENU ITEMS
export const getMenuItems = query({
  args: { restaurantId: v.id('restaurants') },
  handler: async (ctx, args) => {
    return ctx.db.query('menuItems')
      .withIndex('by_restaurant_id', q => q.eq('restaurantId', args.restaurantId))
      .collect();
  },
});

export const getMenuItemsByCategoryId = query({
  args: { categoryId: v.id('categories') },
  handler: async (ctx, args) => {
    return ctx.db.query('menuItems')
      .withIndex('by_category_id', q => q.eq('categoryId', args.categoryId))
      .collect();
  },
});

export const createMenuItem = mutation({
  args: {
    restaurantId: v.id('restaurants'),
    categoryId: v.optional(v.id('categories')),
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    imageUrl: v.optional(v.string()),
    position: v.number(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert('menuItems', {
      restaurantId: args.restaurantId,
      categoryId: args.categoryId,
      name: args.name,
      description: args.description,
      price: args.price,
      imageUrl: args.imageUrl,
      isAvailable: true,
      position: args.position,
      updatedAt: Date.now(),
    });
  },
});

export const updateMenuItem = mutation({
  args: {
    id: v.id('menuItems'),
    categoryId: v.optional(v.id('categories')),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    isAvailable: v.optional(v.boolean()),
    position: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, { ...rest, updatedAt: Date.now() });
  },
});

export const deleteMenuItem = mutation({
  args: { id: v.id('menuItems') },
  handler: async (ctx, args) => {
    // ON DELETE CASCADE for menuItemOptionGroups and orderItems
    const menuItemId = args.id;

    const menuItemOptionGroupsToDelete = await ctx.db.query('menuItemOptionGroups')
      .filter(q => q.eq(q.field('menuItemId'), menuItemId))
      .collect();
    await Promise.all(menuItemOptionGroupsToDelete.map(doc => ctx.db.delete(doc._id)));

    // For orderItems (ON DELETE SET NULL menu_item_id)
    const orderItemsToUpdate = await ctx.db.query('orderItems')
      .filter(q => q.eq(q.field('menuItemId'), menuItemId))
      .collect();
    await Promise.all(
      orderItemsToUpdate.map(item =>
        ctx.db.patch(item._id, { menuItemId: undefined })
      )
    );

    await ctx.db.delete(menuItemId);
  },
});

// OPTION GROUPS
export const getOptionGroups = query({
  args: { restaurantId: v.id('restaurants') },
  handler: async (ctx, args) => {
    return ctx.db.query('optionGroups')
      .withIndex('by_restaurant_id', q => q.eq('restaurantId', args.restaurantId))
      .collect();
  },
});

export const createOptionGroup = mutation({
  args: {
    restaurantId: v.id('restaurants'),
    name: v.string(),
    description: v.optional(v.string()),
    isRequired: v.optional(v.boolean()),
    maxSelect: v.optional(v.number()),
    position: v.number(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert('optionGroups', {
      restaurantId: args.restaurantId,
      name: args.name,
      description: args.description,
      isRequired: args.isRequired ?? false,
      maxSelect: args.maxSelect ?? 1,
      position: args.position,
    });
  },
});

export const updateOptionGroup = mutation({
  args: {
    id: v.id('optionGroups'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    isRequired: v.optional(v.boolean()),
    maxSelect: v.optional(v.number()),
    position: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const deleteOptionGroup = mutation({
  args: { id: v.id('optionGroups') },
  handler: async (ctx, args) => {
    const optionGroupId = args.id;

    // ON DELETE CASCADE for options
    const optionsToDelete = await ctx.db.query('options')
      .filter(q => q.eq(q.field('optionGroupId'), optionGroupId))
      .collect();
    await Promise.all(optionsToDelete.map(doc => ctx.db.delete(doc._id)));

    // ON DELETE CASCADE for menuItemOptionGroups
    const menuItemOptionGroupsToDelete = await ctx.db.query('menuItemOptionGroups')
      .filter(q => q.eq(q.field('optionGroupId'), optionGroupId))
      .collect();
    await Promise.all(menuItemOptionGroupsToDelete.map(doc => ctx.db.delete(doc._id)));

    await ctx.db.delete(optionGroupId);
  },
});

// OPTIONS
export const getOptionsByOptionGroup = query({
  args: { optionGroupId: v.id('optionGroups') },
  handler: async (ctx, args) => {
    return ctx.db.query('options')
      .withIndex('by_option_group_id', q => q.eq('optionGroupId', args.optionGroupId))
      .collect();
  },
});

export const createOption = mutation({
  args: {
    optionGroupId: v.id('optionGroups'),
    name: v.string(),
    priceDelta: v.optional(v.number()),
    position: v.number(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert('options', {
      optionGroupId: args.optionGroupId,
      name: args.name,
      priceDelta: args.priceDelta ?? 0.00,
      position: args.position,
      isAvailable: true,
    });
  },
});

export const updateOption = mutation({
  args: {
    id: v.id('options'),
    name: v.optional(v.string()),
    priceDelta: v.optional(v.number()),
    position: v.optional(v.number()),
    isAvailable: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const deleteOption = mutation({
  args: { id: v.id('options') },
  handler: async (ctx, args) => {
    // ON DELETE SET NULL for orderItemOptions
    const orderItemOptionsToUpdate = await ctx.db.query('orderItemOptions')
      .filter(q => q.eq(q.field('optionId'), args.id))
      .collect();
    await Promise.all(
      orderItemOptionsToUpdate.map(item =>
        ctx.db.patch(item._id, { optionId: undefined })
      )
    );

    await ctx.db.delete(args.id);
  },
});


// MENU ITEM OPTION GROUPS
// This is a join table. You'll mostly create/delete based on menu item and option group IDs.
export const getMenuItemOptionGroups = query({
  args: { menuItemId: v.optional(v.id('menuItems')), optionGroupId: v.optional(v.id('optionGroups')) },
  handler: async (ctx, args) => {
    if (args.menuItemId && args.optionGroupId) {
      return ctx.db.query('menuItemOptionGroups')
        .withIndex('by_menu_item_option_group', q => q.eq('menuItemId', args.menuItemId!).eq('optionGroupId', args.optionGroupId!))
        .collect();
    }
    if (args.menuItemId) {
      return ctx.db.query('menuItemOptionGroups')
        .withIndex('by_menu_item_id', q => q.eq('menuItemId', args.menuItemId!))
        .collect();
    }
    if (args.optionGroupId) {
      return ctx.db.query('menuItemOptionGroups')
        .withIndex('by_option_group_id', q => q.eq('optionGroupId', args.optionGroupId!))
        .collect();
    }
    return ctx.db.query('menuItemOptionGroups').collect(); // Get all if no filter
  },
});

export const addMenuItemOptionGroup = mutation({
  args: {
    menuItemId: v.id('menuItems'),
    optionGroupId: v.id('optionGroups'),
    position: v.number(),
  },
  handler: async (ctx, args) => {
    // Enforce UNIQUE(menu_item_id, option_group_id)
    const existingLink = await ctx.db.query('menuItemOptionGroups')
      .withIndex('by_menu_item_option_group', q =>
        q.eq('menuItemId', args.menuItemId).eq('optionGroupId', args.optionGroupId)
      )
      .first();

    if (existingLink) {
      throw new Error('This option group is already linked to this menu item.');
    }

    return ctx.db.insert('menuItemOptionGroups', args);
  },
});

export const removeMenuItemOptionGroup = mutation({
  args: { id: v.id('menuItemOptionGroups') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});


// =============================================
// CUSTOMER & ORDER SYSTEM (CUSTOMERS, ORDERS, ORDER_ITEMS, ORDER_ITEM_OPTIONS, ORDER_STATUS_EVENTS)
// =============================================