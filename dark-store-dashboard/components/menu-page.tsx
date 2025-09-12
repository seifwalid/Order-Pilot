"use client"

import type React from "react"

import { useState } from "react"
import {
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Upload,
  FileImage,
  FileText,
  Loader2,
  Check,
  AlertCircle,
  Search,
  Filter,
  MoreVertical,
  Edit,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for categories and menu items
const initialCategories = [
  { id: "1", name: "Appetizers", description: "Start your meal with our delicious appetizers" },
  { id: "2", name: "Main Courses", description: "Hearty and satisfying main dishes" },
  { id: "3", name: "Desserts", description: "Sweet treats to end your meal" },
  { id: "4", name: "Beverages", description: "Refreshing drinks and beverages" },
]

const initialMenuItems = [
  {
    id: "1",
    name: "Caesar Salad",
    price: 12.99,
    description: "Fresh romaine lettuce with parmesan cheese and croutons",
    category: "Appetizers",
    available: true,
  },
  {
    id: "2",
    name: "Margherita Pizza",
    price: 18.99,
    description: "Classic pizza with fresh mozzarella, tomatoes, and basil",
    category: "Main Courses",
    available: true,
  },
  {
    id: "3",
    name: "Chicken Alfredo",
    price: 22.99,
    description: "Grilled chicken breast with creamy alfredo sauce over pasta",
    category: "Main Courses",
    available: false,
  },
  {
    id: "4",
    name: "Chocolate Cake",
    price: 8.99,
    description: "Rich chocolate cake with chocolate frosting",
    category: "Desserts",
    available: true,
  },
  {
    id: "5",
    name: "Fresh Lemonade",
    price: 4.99,
    description: "Freshly squeezed lemonade with mint",
    category: "Beverages",
    available: true,
  },
]

interface ParsedMenuItem {
  id: string
  name: string
  price: number
  description: string
  category: string
  isNewCategory: boolean
  confidence: number
}

interface ParseResult {
  items: ParsedMenuItem[]
  newCategories: string[]
  processingTime: number
}

export function MenuPage() {
  const [categories, setCategories] = useState(initialCategories)
  const [menuItems, setMenuItems] = useState(initialMenuItems)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showAddItem, setShowAddItem] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [parseResult, setParseResult] = useState<ParseResult | null>(null)
  const [showParseResults, setShowParseResults] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: "", description: "" })
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  })
  const [categorySearch, setCategorySearch] = useState("")
  const [itemSearch, setItemSearch] = useState("")
  const [itemFilter, setItemFilter] = useState("all") // all, available, unavailable
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showEditCategory, setShowEditCategory] = useState(false)
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string; description: string } | null>(null)

  const addCategory = () => {
    if (newCategory.name.trim()) {
      const category = {
        id: Date.now().toString(),
        name: newCategory.name,
        description: newCategory.description,
      }
      setCategories([...categories, category])
      setNewCategory({ name: "", description: "" })
      setShowAddCategory(false)
    }
  }

  const addMenuItem = () => {
    if (newItem.name.trim() && newItem.price && newItem.category) {
      const item = {
        id: Date.now().toString(),
        name: newItem.name,
        price: Number.parseFloat(newItem.price),
        description: newItem.description,
        category: newItem.category,
        available: true,
      }
      setMenuItems([...menuItems, item])
      setNewItem({ name: "", price: "", description: "", category: "" })
      setShowAddItem(false)
    }
  }

  const toggleItemAvailability = (itemId: string) => {
    setMenuItems(menuItems.map((item) => (item.id === itemId ? { ...item, available: !item.available } : item)))
  }

  const deleteItem = (itemId: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== itemId))
  }

  const getItemsByCategory = (categoryName: string) => {
    return menuItems.filter((item) => item.category === categoryName)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && (file.type.startsWith("image/") || file.type === "application/pdf")) {
      setUploadFile(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && (file.type.startsWith("image/") || file.type === "application/pdf")) {
      setUploadFile(file)
    }
  }

  const processUploadedMenu = async () => {
    if (!uploadFile) return

    setIsUploading(true)

    // Simulate API call to n8n backend for AI processing
    try {
      // Mock processing delay
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Mock parsed results
      const mockResult: ParseResult = {
        items: [
          {
            id: Date.now().toString() + "1",
            name: "Grilled Salmon",
            price: 24.99,
            description: "Fresh Atlantic salmon with herbs",
            category: "Main Courses",
            isNewCategory: false,
            confidence: 0.95,
          },
          {
            id: Date.now().toString() + "2",
            name: "Truffle Risotto",
            price: 28.99,
            description: "Creamy risotto with black truffle",
            category: "Pasta & Risotto",
            isNewCategory: true,
            confidence: 0.88,
          },
          {
            id: Date.now().toString() + "3",
            name: "Craft Beer Selection",
            price: 6.99,
            description: "Local craft beer on tap",
            category: "Beverages",
            isNewCategory: false,
            confidence: 0.92,
          },
        ],
        newCategories: ["Pasta & Risotto"],
        processingTime: 2.8,
      }

      setParseResult(mockResult)
      setShowParseResults(true)
      setShowUploadDialog(false)
    } catch (error) {
      console.error("Error processing menu:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const acceptParsedItems = () => {
    if (!parseResult) return

    // Add new categories
    const newCats = parseResult.newCategories.map((catName) => ({
      id: Date.now().toString() + Math.random(),
      name: catName,
      description: `AI-generated category for ${catName.toLowerCase()}`,
    }))

    setCategories((prev) => [...prev, ...newCats])

    // Add new menu items
    const newItems = parseResult.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category,
      available: true,
    }))

    setMenuItems((prev) => [...prev, ...newItems])
    setShowParseResults(false)
    setParseResult(null)
    setUploadFile(null)
  }

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
      category.description.toLowerCase().includes(categorySearch.toLowerCase()),
  )

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(itemSearch.toLowerCase())

    const matchesFilter =
      itemFilter === "all" ||
      (itemFilter === "available" && item.available) ||
      (itemFilter === "unavailable" && !item.available)

    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory

    return matchesSearch && matchesFilter && matchesCategory
  })

  const editCategory = (category: { id: string; name: string; description: string }) => {
    setEditingCategory(category)
    setShowEditCategory(true)
  }

  const updateCategory = () => {
    if (editingCategory && editingCategory.name.trim()) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id
            ? { ...cat, name: editingCategory.name, description: editingCategory.description }
            : cat,
        ),
      )
      setEditingCategory(null)
      setShowEditCategory(false)
    }
  }

  const deleteCategory = (categoryId: string) => {
    setCategories(categories.filter((cat) => cat.id !== categoryId))
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-3 sm:space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Organize your restaurant menu and manage items</p>
        </div>

        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                <Upload className="w-4 h-4 mr-2" />
                Upload Menu
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg">Upload Menu</DialogTitle>
                <DialogDescription className="text-sm">
                  Upload a photo or PDF of your menu. Our AI will extract items and match them with categories.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors relative min-h-[120px] flex items-center justify-center"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {uploadFile ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center">
                        {uploadFile.type.startsWith("image/") ? (
                          <FileImage className="w-8 h-8 text-orange-500" />
                        ) : (
                          <FileText className="w-8 h-8 text-orange-500" />
                        )}
                      </div>
                      <p className="text-sm font-medium break-all px-2">{uploadFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                      <p className="text-sm text-muted-foreground px-2">
                        Drag and drop your menu here, or tap to browse
                      </p>
                      <p className="text-xs text-muted-foreground">Supports images (JPG, PNG) and PDF files</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                {uploadFile && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Ready to process. Our AI will extract menu items and suggest categories.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowUploadDialog(false)
                    setUploadFile(null)
                  }}
                  className="w-full"
                >
                  Cancel
                </Button>
                <Button onClick={processUploadedMenu} disabled={!uploadFile || isUploading} className="w-full">
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Process Menu"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-10 sm:h-auto">
          <TabsTrigger value="categories" className="text-sm sm:text-base">
            Categories
          </TabsTrigger>
          <TabsTrigger value="items" className="text-sm sm:text-base">
            Menu Items
          </TabsTrigger>
        </TabsList>

        {/* Categories Subpage */}
        <TabsContent value="categories" className="space-y-4 mt-4 sm:mt-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                <CardTitle className="text-base sm:text-lg">Categories Management</CardTitle>
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search categories..."
                      className="pl-10 w-full sm:w-64"
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                    />
                  </div>
                  <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
                    <DialogTrigger asChild>
                      <Button className="w-full sm:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto border-border">
                      <DialogHeader>
                        <DialogTitle className="text-lg">Add New Category</DialogTitle>
                        <DialogDescription className="text-sm">
                          Create a new menu category to organize your dishes.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="category-name" className="text-sm font-medium">
                            Category Name
                          </Label>
                          <Input
                            id="category-name"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            placeholder="e.g., Appetizers, Main Courses"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category-description" className="text-sm font-medium">
                            Description
                          </Label>
                          <Textarea
                            id="category-description"
                            value={newCategory.description}
                            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                            placeholder="Brief description of this category"
                            className="min-h-[80px] mt-1"
                          />
                        </div>
                      </div>
                      <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
                        <Button variant="outline" onClick={() => setShowAddCategory(false)} className="w-full">
                          Cancel
                        </Button>
                        <Button onClick={addCategory} className="w-full">
                          Add Category
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCategories.map((category) => (
                  <Card key={category.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm sm:text-base truncate">{category.name}</h3>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {getItemsByCategory(category.name).length} items
                            </Badge>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => editCategory(category)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Category
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => deleteCategory(category.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Category
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                        <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                          <span>
                            Available: {getItemsByCategory(category.name).filter((item) => item.available).length}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Items Subpage */}
        <TabsContent value="items" className="space-y-4 mt-4 sm:mt-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                <CardTitle className="text-base sm:text-lg">Menu Items Management</CardTitle>
                <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-lg">Add New Menu Item</DialogTitle>
                      <DialogDescription className="text-sm">Add a new dish to your restaurant menu.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="item-name" className="text-sm font-medium">
                          Item Name
                        </Label>
                        <Input
                          id="item-name"
                          value={newItem.name}
                          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                          placeholder="e.g., Margherita Pizza"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="item-price" className="text-sm font-medium">
                          Price ($)
                        </Label>
                        <Input
                          id="item-price"
                          type="number"
                          step="0.01"
                          value={newItem.price}
                          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                          placeholder="0.00"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="item-category" className="text-sm font-medium">
                          Category
                        </Label>
                        <Select
                          value={newItem.category}
                          onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="item-description" className="text-sm font-medium">
                          Description
                        </Label>
                        <Textarea
                          id="item-description"
                          value={newItem.description}
                          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                          placeholder="Describe the dish, ingredients, etc."
                          className="min-h-[80px] mt-1"
                        />
                      </div>
                    </div>
                    <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
                      <Button variant="outline" onClick={() => setShowAddItem(false)} className="w-full">
                        Cancel
                      </Button>
                      <Button onClick={addMenuItem} className="w-full">
                        Add Item
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search items..."
                    className="pl-10"
                    value={itemSearch}
                    onChange={(e) => setItemSearch(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:space-x-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={itemFilter} onValueChange={setItemFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <Filter className="w-4 h-4 mr-2 flex-shrink-0" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Items</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm sm:text-base">No items found matching your search criteria.</p>
                  </div>
                ) : (
                  /* Enhanced responsive grid for menu items */
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredItems.map((item) => (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2">
                                  <h4 className="font-semibold text-sm sm:text-base truncate">{item.name}</h4>
                                  <Badge
                                    variant={item.available ? "default" : "secondary"}
                                    className={
                                      item.available
                                        ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-700 text-xs mt-1 sm:mt-0"
                                        : "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-700 text-xs mt-1 sm:mt-0"
                                    }
                                  >
                                    {item.available ? "Available" : "Unavailable"}
                                  </Badge>
                                </div>
                                <Badge variant="outline" className="text-xs mb-2">
                                  {item.category}
                                </Badge>
                                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                                <p className="font-bold text-lg">${item.price.toFixed(2)}</p>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => toggleItemAvailability(item.id)}>
                                    {item.available ? (
                                      <ToggleLeft className="mr-2 h-4 w-4" />
                                    ) : (
                                      <ToggleRight className="mr-2 h-4 w-4" />
                                    )}
                                    {item.available ? "Mark Unavailable" : "Mark Available"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Item
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => deleteItem(item.id)} className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Item
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleItemAvailability(item.id)}
                                className="flex-1 sm:flex-none hidden sm:flex"
                              >
                                {item.available ? (
                                  <ToggleRight className="w-4 h-4 text-green-600 mr-1" />
                                ) : (
                                  <ToggleLeft className="w-4 h-4 text-gray-400 mr-1" />
                                )}
                                <span className="truncate">{item.available ? "Available" : "Unavailable"}</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteItem(item.id)}
                                className="hidden sm:flex"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showEditCategory} onOpenChange={setShowEditCategory}>
        <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Edit Category</DialogTitle>
            <DialogDescription className="text-sm">Update the category name and description.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-category-name" className="text-sm font-medium">
                Category Name
              </Label>
              <Input
                id="edit-category-name"
                value={editingCategory?.name || ""}
                onChange={(e) => setEditingCategory((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                placeholder="e.g., Appetizers, Main Courses"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-category-description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="edit-category-description"
                value={editingCategory?.description || ""}
                onChange={(e) => setEditingCategory((prev) => (prev ? { ...prev, description: e.target.value } : null))}
                placeholder="Brief description of this category"
                className="min-h-[80px] mt-1"
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditCategory(false)
                setEditingCategory(null)
              }}
              className="w-full"
            >
              Cancel
            </Button>
            <Button onClick={updateCategory} className="w-full">
              Update Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Parse Results Dialog */}
      <Dialog open={showParseResults} onOpenChange={setShowParseResults}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Menu Processing Results</DialogTitle>
            <DialogDescription className="text-sm">
              {parseResult && (
                <>
                  Found {parseResult.items.length} items in {parseResult.processingTime}s. Review and accept the
                  extracted menu items below.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {parseResult && (
            <div className="space-y-6">
              {/* New Categories Alert */}
              {parseResult.newCategories.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>New categories detected:</strong> {parseResult.newCategories.join(", ")}
                    <br />
                    These will be created automatically when you accept the results.
                  </AlertDescription>
                </Alert>
              )}

              {/* Parsed Items */}
              <div className="space-y-4">
                <h3 className="font-semibold text-base">Extracted Menu Items</h3>
                {parseResult.items.map((item) => (
                  <Card key={item.id} className="border-l-4 border-l-orange-400">
                    <CardContent className="pt-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2">
                            <h4 className="font-medium text-sm sm:text-base">{item.name}</h4>
                            <div className="flex flex-wrap gap-1 mt-1 sm:mt-0">
                              <Badge
                                variant={item.isNewCategory ? "secondary" : "default"}
                                className={
                                  item.isNewCategory
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 text-xs"
                                    : "text-xs"
                                }
                              >
                                {item.category}
                                {item.isNewCategory && " (New)"}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {Math.round(item.confidence * 100)}% confidence
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                          <p className="font-semibold text-lg">${item.price.toFixed(2)}</p>
                        </div>
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowParseResults(false)
                setParseResult(null)
                setUploadFile(null)
              }}
              className="w-full"
            >
              Cancel
            </Button>
            <Button onClick={acceptParsedItems} className="w-full">
              Accept All Items
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
