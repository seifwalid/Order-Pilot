"use client"

import { useState } from "react"
import {
  Save,
  Phone,
  CreditCard,
  Plug,
  Building,
  Paintbrush,
  Zap,
  Sun,
  Moon,
  Shield,
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock restaurant data
const initialRestaurantData = {
  name: "Bella Vista Restaurant",
  email: "contact@bellavista.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main Street, Downtown",
  city: "New York",
  state: "NY",
  zipCode: "10001",
  description: "Authentic Italian cuisine with a modern twist",
}

export function SettingsPage() {
  const [restaurantData, setRestaurantData] = useState(initialRestaurantData)
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleRestaurantSave = () => {
    // In a real app, this would save to backend
    console.log("Saving restaurant data:", restaurantData)
  }

  const handleThemeSave = () => {
    // In a real app, this would save theme preferences
    console.log("Saving theme:", { darkMode })
  }

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!")
      return
    }
    if (passwordData.newPassword.length < 8) {
      alert("Password must be at least 8 characters long!")
      return
    }
    // In a real app, this would validate current password and update
    console.log("Changing password...")
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  const toggleTheme = () => {
    const root = document.documentElement

    // Add transition class for smooth fade
    root.style.transition = "background-color 0.3s ease, color 0.3s ease"

    // Toggle dark mode
    root.classList.toggle("dark")
    setDarkMode(!darkMode)

    // Remove transition after animation completes
    setTimeout(() => {
      root.style.transition = ""
    }, 300)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Tabs defaultValue="restaurant" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 h-auto gap-1 p-1">
          <TabsTrigger
            value="restaurant"
            className="flex items-center justify-center space-x-2 p-3 text-sm font-medium"
          >
            <Building className="w-4 h-4" />
            <span>Restaurant</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center justify-center space-x-2 p-3 text-sm font-medium">
            <Shield className="w-4 h-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center justify-center space-x-2 p-3 text-sm font-medium">
            <Paintbrush className="w-4 h-4" />
            <span>Theme</span>
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            className="flex items-center justify-center space-x-2 p-3 text-sm font-medium"
          >
            <Plug className="w-4 h-4" />
            <span>Integrations</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center justify-center space-x-2 p-3 text-sm font-medium"
          >
            <Zap className="w-4 h-4" />
            <span>Notifications</span>
          </TabsTrigger>
        </TabsList>

        {/* Restaurant Tab */}
        <TabsContent value="restaurant" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg">Restaurant Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="restaurant-name" className="text-sm font-medium">
                    Restaurant Name
                  </Label>
                  <Input
                    id="restaurant-name"
                    value={restaurantData.name}
                    onChange={(e) => setRestaurantData({ ...restaurantData, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="restaurant-email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="restaurant-email"
                    type="email"
                    value={restaurantData.email}
                    onChange={(e) => setRestaurantData({ ...restaurantData, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="restaurant-phone" className="text-sm font-medium">
                    Phone
                  </Label>
                  <Input
                    id="restaurant-phone"
                    value={restaurantData.phone}
                    onChange={(e) => setRestaurantData({ ...restaurantData, phone: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="restaurant-address" className="text-sm font-medium">
                    Address
                  </Label>
                  <Input
                    id="restaurant-address"
                    value={restaurantData.address}
                    onChange={(e) => setRestaurantData({ ...restaurantData, address: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="restaurant-city" className="text-sm font-medium">
                    City
                  </Label>
                  <Input
                    id="restaurant-city"
                    value={restaurantData.city}
                    onChange={(e) => setRestaurantData({ ...restaurantData, city: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="restaurant-state" className="text-sm font-medium">
                    State
                  </Label>
                  <Input
                    id="restaurant-state"
                    value={restaurantData.state}
                    onChange={(e) => setRestaurantData({ ...restaurantData, state: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="restaurant-description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="restaurant-description"
                  value={restaurantData.description}
                  onChange={(e) => setRestaurantData({ ...restaurantData, description: e.target.value })}
                  placeholder="Describe your restaurant..."
                  className="min-h-[80px] mt-1"
                />
              </div>
              <Button onClick={handleRestaurantSave} className="w-full sm:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Save Restaurant Info
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg">Password & Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and
                  symbols.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-password" className="text-sm font-medium">
                    Current Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="new-password" className="text-sm font-medium">
                    New Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirm-password" className="text-sm font-medium">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    className="mt-1"
                  />
                </div>

                <Button onClick={handlePasswordChange} className="w-full sm:w-auto">
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg">Two-Factor Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <Label className="text-base font-medium">Enable 2FA</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account with two-factor authentication
                  </p>
                </div>
                <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
              </div>

              {twoFactorEnabled && (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Two-factor authentication is enabled. You'll need your authenticator app to sign in.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg">Account Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Last Login</p>
                    <p className="text-sm text-muted-foreground">Today at 9:30 AM from New York, NY</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-700"
                  >
                    Secure
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Active Sessions</p>
                    <p className="text-sm text-muted-foreground">1 active session on this device</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme Tab */}
        <TabsContent value="theme" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg">Theme Customization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <Label className="text-base font-medium">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark theme with smooth fade transition
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-12 w-20 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                    darkMode ? "bg-orange-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
                      darkMode ? "translate-x-10" : "translate-x-2"
                    }`}
                  >
                    <span className="flex h-full w-full items-center justify-center transition-all duration-300 ease-in-out">
                      {darkMode ? (
                        <Moon className="h-4 w-4 text-orange-600 transition-all duration-300 ease-in-out" />
                      ) : (
                        <Sun className="h-4 w-4 text-yellow-500 transition-all duration-300 ease-in-out" />
                      )}
                    </span>
                  </span>
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg">VAPI Voice Agent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <Phone className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm sm:text-base">Phone Ordering Integration</h3>
                    <p className="text-sm text-muted-foreground">
                      Enable customers to place orders via phone using AI voice agent
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-700 text-xs"
                >
                  Coming Soon
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg">Payment Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm sm:text-base">Payment Gateway</h3>
                    <p className="text-sm text-muted-foreground">Connect payment processing for online orders</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-700 text-xs"
                >
                  Coming Soon
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex-1">
                  <Label className="text-base font-medium">Order Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified when new orders arrive</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex-1">
                  <Label className="text-base font-medium">Staff Updates</Label>
                  <p className="text-sm text-muted-foreground">Notifications about staff activities</p>
                </div>
                <Switch checked={true} onCheckedChange={() => {}} />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex-1">
                  <Label className="text-base font-medium">System Alerts</Label>
                  <p className="text-sm text-muted-foreground">Important system and security notifications</p>
                </div>
                <Switch checked={true} onCheckedChange={() => {}} />
              </div>

              <Button className="w-full sm:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
