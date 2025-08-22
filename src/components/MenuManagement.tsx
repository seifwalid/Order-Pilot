'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'

interface MenuManagementProps {
  restaurant: any
  role: string
  categories: any[]
}

export default function MenuManagement({ restaurant, role, categories }: MenuManagementProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: '', description: '' })
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
  })

  const supabase = createClient()

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('categories')
        .insert({
          restaurant_id: restaurant.id,
          name: newCategory.name,
          description: newCategory.description,
          display_order: categories.length + 1,
        })

      if (error) throw error

      alert('Category added successfully!')
      setNewCategory({ name: '', description: '' })
      window.location.reload()
    } catch (error) {
      console.error('Error adding category:', error)
      alert('Failed to add category')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('menu_items')
        .insert({
          restaurant_id: restaurant.id,
          category_id: newItem.categoryId,
          name: newItem.name,
          description: newItem.description,
          price: parseFloat(newItem.price),
          is_available: true,
        })

      if (error) throw error

      alert('Menu item added successfully!')
      setNewItem({ name: '', description: '', price: '', categoryId: '' })
      window.location.reload()
    } catch (error) {
      console.error('Error adding menu item:', error)
      alert('Failed to add menu item')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleItemAvailability = async (itemId: string, currentAvailability: boolean) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_available: !currentAvailability })
        .eq('id', itemId)

      if (error) throw error

      window.location.reload()
    } catch (error) {
      console.error('Error updating item availability:', error)
      alert('Failed to update item availability')
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return

    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      alert('Menu item deleted successfully!')
      window.location.reload()
    } catch (error) {
      console.error('Error deleting menu item:', error)
      alert('Failed to delete menu item')
    }
  }

  // Only owners and managers can manage menu
  const canManageMenu = role === 'owner' || role === 'manager'

  return (
    <div className="space-y-6">
      {canManageMenu && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Add Category</CardTitle>
              <CardDescription>
                Create a new menu category to organize your items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input
                      id="categoryName"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Appetizers, Main Courses"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="categoryDescription">Description</Label>
                    <Input
                      id="categoryDescription"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of the category"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Adding...' : 'Add Category'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Menu Item</CardTitle>
              <CardDescription>
                Add a new item to your menu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="itemName">Item Name</Label>
                    <Input
                      id="itemName"
                      value={newItem.name}
                      onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Caesar Salad"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="itemPrice">Price ($)</Label>
                    <Input
                      id="itemPrice"
                      type="number"
                      step="0.01"
                      value={newItem.price}
                      onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="12.99"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="itemCategory">Category</Label>
                    <select
                      id="itemCategory"
                      value={newItem.categoryId}
                      onChange={(e) => setNewItem(prev => ({ ...prev, categoryId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="itemDescription">Description</Label>
                    <textarea
                      id="itemDescription"
                      value={newItem.description}
                      onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder="Describe the dish..."
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isLoading || !newItem.categoryId}>
                  {isLoading ? 'Adding...' : 'Add Menu Item'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Current Menu</CardTitle>
          <CardDescription>
            Your restaurant's menu organized by categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length > 0 ? (
            <div className="space-y-6">
              {categories.map((category) => (
                <div key={category.id} className="border rounded-lg p-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-gray-600">{category.description}</p>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {category.menu_items?.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{item.name}</h4>
                            <Badge variant={item.is_available ? "default" : "secondary"}>
                              {item.is_available ? 'Available' : 'Unavailable'}
                            </Badge>
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          )}
                          <p className="text-sm font-medium text-green-600 mt-1">
                            ${item.price}
                          </p>
                        </div>
                        
                        {canManageMenu && (
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleItemAvailability(item.id, item.is_available)}
                            >
                              {item.is_available ? 'Hide' : 'Show'}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-4">No items in this category</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No menu categories yet</p>
              {canManageMenu && (
                <p className="text-sm text-gray-600">
                  Start by adding a category above, then add menu items to it.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
