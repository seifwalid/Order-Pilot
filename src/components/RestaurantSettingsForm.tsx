'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'

interface RestaurantSettingsFormProps {
  restaurant: any
}

export default function RestaurantSettingsForm({ restaurant }: RestaurantSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({
    name: restaurant.name || '',
    email: restaurant.email || '',
    phone: restaurant.phone || '',
    address: restaurant.address || '',
    description: restaurant.description || '',
  })

  // Initialize committed fields for existing data
  const [committedFields, setCommittedFields] = useState<Set<string>>(() => {
    const initial = new Set<string>()
    if (restaurant.name) initial.add('name')
    if (restaurant.email) initial.add('email')
    if (restaurant.phone) initial.add('phone')
    if (restaurant.address) initial.add('address')
    if (restaurant.description) initial.add('description')
    return initial
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/restaurant/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update restaurant settings')
      }

      alert('Restaurant settings updated successfully!')
      window.location.reload()
    } catch (error) {
      console.error('Error updating restaurant:', error)
      alert(error instanceof Error ? error.message : 'Failed to update restaurant settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const startEditing = (field: string) => {
    setEditingField(field)
  }

  const cancelEditing = () => {
    setEditingField(null)
  }

  const saveField = (field: string) => {
    setEditingField(null)
    setCommittedFields(prev => new Set([...prev, field]))
  }

  const handleBlur = (field: string) => {
    if (formData[field] && formData[field].trim() !== '') {
      setCommittedFields(prev => new Set([...prev, field]))
    }
    setEditingField(null)
  }

  const handleKeyDown = (field: string, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (formData[field] && formData[field].trim() !== '') {
        setCommittedFields(prev => new Set([...prev, field]))
      }
      setEditingField(null)
    }
  }

  const renderField = (field: string, label: string, type: string = 'text', required: boolean = false) => {
    const value = formData[field]
    const isEditing = editingField === field
    const hasValue = value && value.trim() !== ''
    const isCommitted = committedFields.has(field)

    if (hasValue && isCommitted && !isEditing) {
      return (
        <div className="space-y-2">
          <Label className="text-white font-medium">{label}</Label>
                     <div className="relative bg-slate-800/80 border-2 border-slate-600/50 rounded-lg p-4 shadow-lg">
             <div className="text-white font-medium text-lg">{value}</div>
                         <button
               type="button"
               onClick={() => startEditing(field)}
               className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white transition-colors"
               aria-label={`Edit ${label}`}
             >
               <X className="w-4 h-4" />
             </button>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        <Label htmlFor={field} className="text-white font-medium">{label}</Label>
        <div className="relative">
                     <Input
             id={field}
             name={field}
             type={type}
             value={value}
             onChange={handleChange}
             onBlur={() => handleBlur(field)}
             onKeyDown={(e) => handleKeyDown(field, e)}
             required={required}
             className="bg-slate-700/50 border-slate-600 text-white !text-white placeholder:text-slate-400 focus:border-slate-500 focus:ring-slate-500"
           />
          {isEditing && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
              <button
                type="button"
                onClick={() => saveField(field)}
                className="px-2 py-1 text-xs bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderField('name', 'Restaurant Name', 'text', true)}
          {renderField('email', 'Email', 'email', true)}
          {renderField('phone', 'Phone')}
          {renderField('address', 'Address')}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description" className="text-white font-medium">Description</Label>
                     {formData.description && formData.description.trim() !== '' && committedFields.has('description') && editingField !== 'description' ? (
                         <div className="relative bg-slate-800/80 border-2 border-slate-600/50 rounded-lg p-4 shadow-lg">
               <div className="text-white font-medium text-lg whitespace-pre-wrap">{formData.description}</div>
                             <button
                 type="button"
                 onClick={() => startEditing('description')}
                 className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white transition-colors"
                 aria-label="Edit Description"
               >
                 <X className="w-4 h-4" />
               </button>
            </div>
          ) : (
            <div className="relative">
                             <textarea
                 id="description"
                 name="description"
                 value={formData.description}
                 onChange={handleChange}
                 onBlur={() => handleBlur('description')}
                 onKeyDown={(e) => handleKeyDown('description', e)}
                 className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white !text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                 rows={3}
                 placeholder="Describe your restaurant..."
               />
              {editingField === 'description' && (
                <div className="absolute right-2 top-2 flex space-x-1">
                  <button
                    type="button"
                    onClick={() => saveField('description')}
                    className="px-2 py-1 text-xs bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </form>

             <div className="flex justify-end">
         <Button 
           type="button" 
           disabled={isLoading} 
           onClick={handleSubmit}
           className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
         >
           {isLoading ? 'Updating...' : 'Update Restaurant Information'}
         </Button>
       </div>
    </div>
  )
}
