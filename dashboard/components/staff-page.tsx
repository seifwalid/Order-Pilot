"use client"

import { useState } from "react"
import {
  Plus,
  Mail,
  UserCheck,
  UserX,
  Clock,
  Trash2,
  Edit,
  ToggleLeft,
  ToggleRight,
  MoreVertical,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

// Mock data for staff and invitations
const initialStaff = [
  {
    id: "1",
    name: "John Smith",
    email: "john@bellavista.com",
    role: "manager" as const,
    joinedDate: "2024-01-15",
    status: "active" as const,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@bellavista.com",
    role: "staff" as const,
    joinedDate: "2024-02-20",
    status: "active" as const,
  },
  {
    id: "3",
    name: "Mike Davis",
    email: "mike@bellavista.com",
    role: "staff" as const,
    joinedDate: "2024-03-10",
    status: "inactive" as const,
  },
]

const initialInvitations = [
  {
    id: "1",
    email: "emma@example.com",
    role: "staff" as const,
    sentDate: "2024-12-08",
    status: "pending" as const,
  },
  {
    id: "2",
    email: "david@example.com",
    role: "manager" as const,
    sentDate: "2024-12-07",
    status: "pending" as const,
  },
]

export function StaffPage() {
  const [staff, setStaff] = useState(initialStaff)
  const [invitations, setInvitations] = useState(initialInvitations)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null)
  const [newRole, setNewRole] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newInvite, setNewInvite] = useState({
    email: "",
    role: "",
  })
  const [emailError, setEmailError] = useState("")
  const [inviteEmailError, setInviteEmailError] = useState("")

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const sendInvitation = () => {
    setInviteEmailError("")

    if (!newInvite.email.trim()) {
      setInviteEmailError("Email address is required")
      return
    }

    if (!validateEmail(newInvite.email)) {
      setInviteEmailError("Please enter a valid email address")
      return
    }

    if (!newInvite.role) {
      return
    }

    const invitation = {
      id: Date.now().toString(),
      email: newInvite.email,
      role: newInvite.role as "manager" | "staff",
      sentDate: new Date().toISOString().split("T")[0],
      status: "pending" as const,
    }
    setInvitations([...invitations, invitation])
    setNewInvite({ email: "", role: "" })
    setInviteEmailError("")
    setShowInviteDialog(false)
  }

  const cancelInvitation = (invitationId: string) => {
    setInvitations(invitations.filter((inv) => inv.id !== invitationId))
  }

  const removeStaff = (staffId: string) => {
    setStaff(staff.filter((member) => member.id !== staffId))
  }

  const changeStaffRole = () => {
    if (selectedStaff && newRole) {
      setStaff(
        staff.map((member) =>
          member.id === selectedStaff ? { ...member, role: newRole as "manager" | "staff" } : member,
        ),
      )
      setShowRoleDialog(false)
      setSelectedStaff(null)
      setNewRole("")
    }
  }

  const openRoleDialog = (staffId: string, currentRole: string) => {
    setSelectedStaff(staffId)
    setNewRole(currentRole)
    setShowRoleDialog(true)
  }

  const toggleStaffStatus = (staffId: string) => {
    setStaff(
      staff.map((member) =>
        member.id === staffId ? { ...member, status: member.status === "active" ? "inactive" : "active" } : member,
      ),
    )
  }

  const changeStaffEmail = () => {
    setEmailError("")

    if (!newEmail.trim()) {
      setEmailError("Email address is required")
      return
    }

    if (!validateEmail(newEmail)) {
      setEmailError("Please enter a valid email address")
      return
    }

    if (selectedStaff) {
      setStaff(staff.map((member) => (member.id === selectedStaff ? { ...member, email: newEmail } : member)))
      setShowEmailDialog(false)
      setSelectedStaff(null)
      setNewEmail("")
      setEmailError("")
    }
  }

  const openEmailDialog = (staffId: string, currentEmail: string) => {
    setSelectedStaff(staffId)
    setNewEmail(currentEmail)
    setEmailError("")
    setShowEmailDialog(true)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-700"
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-700"
      case "staff":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-700"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-700"
      case "inactive":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-700"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <CardTitle className="text-lg sm:text-xl">Staff Management</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your restaurant team by inviting new staff members and managing existing team roles.
              </p>
            </div>
            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Invite Staff
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-lg">Invite New Staff Member</DialogTitle>
                  <DialogDescription className="text-sm">
                    Send an email invitation to add a new team member to your restaurant.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="invite-email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="invite-email"
                      type="email"
                      value={newInvite.email}
                      onChange={(e) => {
                        setNewInvite({ ...newInvite, email: e.target.value })
                        setInviteEmailError("")
                      }}
                      placeholder="staff@example.com"
                      className={`mt-1 ${inviteEmailError ? "border-red-500" : ""}`}
                    />
                    {inviteEmailError && (
                      <Alert className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm text-red-600">{inviteEmailError}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="invite-role" className="text-sm font-medium">
                      Role
                    </Label>
                    <Select
                      value={newInvite.role}
                      onValueChange={(value) => setNewInvite({ ...newInvite, role: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowInviteDialog(false)
                      setInviteEmailError("")
                    }}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                  <Button onClick={sendInvitation} className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Invitation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Role Change Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Change Staff Role</DialogTitle>
            <DialogDescription className="text-sm">
              Update the role for this staff member. This will change their access permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-role" className="text-sm font-medium">
                New Role
              </Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowRoleDialog(false)} className="w-full">
              Cancel
            </Button>
            <Button onClick={changeStaffRole} className="w-full">
              <Edit className="w-4 h-4 mr-2" />
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Change Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Change Email Address</DialogTitle>
            <DialogDescription className="text-sm">
              Update the email address for this staff member. They will receive a notification about this change.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-email" className="text-sm font-medium">
                New Email Address
              </Label>
              <Input
                id="new-email"
                type="email"
                value={newEmail}
                onChange={(e) => {
                  setNewEmail(e.target.value)
                  setEmailError("")
                }}
                placeholder="new-email@example.com"
                className={`mt-1 ${emailError ? "border-red-500" : ""}`}
              />
              {emailError && (
                <Alert className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm text-red-600">{emailError}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowEmailDialog(false)
                setEmailError("")
              }}
              className="w-full"
            >
              Cancel
            </Button>
            <Button onClick={changeStaffEmail} className="w-full">
              <Mail className="w-4 h-4 mr-2" />
              Update Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base sm:text-lg">Current Staff ({staff.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {staff.map((member) => (
              <div
                key={member.id}
                className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg space-y-3 sm:space-y-0"
              >
                {member.role !== "owner" && (
                  <div className="absolute top-2 right-2 sm:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="bg-transparent h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toggleStaffStatus(member.id)}>
                          {member.status === "active" ? (
                            <ToggleLeft className="mr-2 h-4 w-4" />
                          ) : (
                            <ToggleRight className="mr-2 h-4 w-4" />
                          )}
                          {member.status === "active" ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEmailDialog(member.id, member.email)}>
                          <Mail className="mr-2 h-4 w-4" />
                          Change Email
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openRoleDialog(member.id, member.role)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => removeStaff(member.id)} className="text-red-600">
                          <UserX className="mr-2 h-4 w-4" />
                          Remove Staff
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}

                <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 pr-10 sm:pr-0">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-950/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm sm:text-base truncate">{member.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined: {new Date(member.joinedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={`${getRoleColor(member.role)} text-xs`}>
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </Badge>
                    <Badge variant="outline" className={`${getStatusColor(member.status)} text-xs`}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </Badge>
                  </div>
                  {member.role !== "owner" && (
                    <div className="flex items-center space-x-2">
                      <div className="hidden sm:flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStaffStatus(member.id)}
                          className={
                            member.status === "active"
                              ? "text-red-600 hover:text-red-700"
                              : "text-green-600 hover:text-green-700"
                          }
                        >
                          {member.status === "active" ? (
                            <ToggleRight className="w-4 h-4" />
                          ) : (
                            <ToggleLeft className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEmailDialog(member.id, member.email)}
                          className="text-purple-600 hover:text-purple-700"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRoleDialog(member.id, member.role)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeStaff(member.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <UserX className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {invitations.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base sm:text-lg">Pending Invitations ({invitations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800 space-y-3 sm:space-y-0"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-950/50 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-sm sm:text-base truncate">{invitation.email}</h3>
                      <p className="text-sm text-muted-foreground">
                        Invited as {invitation.role} on {new Date(invitation.sentDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className={`${getRoleColor(invitation.role)} text-xs`}>
                        {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-700 text-xs"
                      >
                        Pending
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cancelInvitation(invitation.id)}
                      className="text-red-600 hover:text-red-700 w-full sm:w-auto"
                    >
                      <Trash2 className="w-4 h-4 mr-2 sm:mr-0" />
                      <span className="sm:hidden">Cancel Invitation</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base lg:text-lg">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">{staff.length}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">Total team members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base lg:text-lg">Active Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-green-600">
              {staff.filter((s) => s.status === "active").length}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">Currently working</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base lg:text-lg">Managers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-purple-600">
              {staff.filter((s) => s.role === "manager").length}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">Management level staff</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base lg:text-lg">Pending Invites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-orange-600">{invitations.length}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">Awaiting acceptance</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
