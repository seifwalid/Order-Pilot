'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChefHat, Palette, Coffee, Pizza, Utensils, Eye, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSpringConfig, springConfigs } from '@/lib/a11y/reducedMotion'
import { restaurantThemes } from '@/lib/theme/accent'
import { canCompleteStep } from '../_state/useWizardState'
import type { StepComponentProps } from './Wizard'

const menuTemplates = [
  {
    id: 'fastCasual',
    name: 'Fast Casual',
    description: 'Burgers, sandwiches, and quick bites',
    icon: Utensils,
    theme: restaurantThemes.fastCasual,
    preview: [
      { name: 'Classic Burger', price: '$12.99', category: 'Burgers' },
      { name: 'Chicken Sandwich', price: '$11.49', category: 'Sandwiches' },
      { name: 'Sweet Potato Fries', price: '$4.99', category: 'Sides' },
    ],
  },
  {
    id: 'pizzeria',
    name: 'Pizzeria',
    description: 'Pizza, pasta, and Italian favorites',
    icon: Pizza,
    theme: restaurantThemes.pizzeria,
    preview: [
      { name: 'Margherita Pizza', price: '$16.99', category: 'Pizza' },
      { name: 'Caesar Salad', price: '$9.99', category: 'Salads' },
      { name: 'Garlic Bread', price: '$5.99', category: 'Appetizers' },
    ],
  },
  {
    id: 'cafe',
    name: 'Café',
    description: 'Coffee, pastries, and light meals',
    icon: Coffee,
    theme: restaurantThemes.cafe,
    preview: [
      { name: 'Cappuccino', price: '$4.50', category: 'Coffee' },
      { name: 'Avocado Toast', price: '$8.99', category: 'Breakfast' },
      { name: 'Blueberry Muffin', price: '$3.99', category: 'Pastries' },
    ],
  },
]

export default function StepMenu({ 
  state, 
  actions, 
  isLoading, 
  onNext, 
  onBack 
}: StepComponentProps) {
  const canProceed = canCompleteStep(state, 4)
  const selectedTemplate = state.menu.template
  const selectedTemplateData = menuTemplates.find(t => t.id === selectedTemplate)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<any>(null)

  const handleTemplateSelect = (templateId: string) => {
    const template = menuTemplates.find(t => t.id === templateId)
    if (template) {
      actions.updateMenu({
        mode: 'template',
        template: templateId as any,
      })
      
      // Also update theme to match the template
      actions.updateTheme({
        accent: template.theme.primary,
      })
    }
  }

  const handleScratchSelect = () => {
    actions.updateMenu({
      mode: 'scratch',
      template: undefined,
    })
  }

  const handlePreviewClick = (template: any) => {
    setPreviewTemplate(template)
    setIsPreviewOpen(true)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={getSpringConfig(springConfigs.gentle)}
        className="text-center space-y-4"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-[#ae8d5e] to-[#9a7a4a] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-[#ae8d5e]/30">
          <ChefHat className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">
          Choose Your Menu Style
        </h2>
        <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
          Select a template that matches your restaurant type, or build from scratch
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        {/* Template Selection */}
        <div className="space-y-8">

          <div className="space-y-6">
            {menuTemplates.map((template, index) => {
              const Icon = template.icon
              const isSelected = selectedTemplate === template.id
              
              return (
                <motion.div
                  key={template.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={getSpringConfig({
                    ...springConfigs.gentle,
                    stiffness: 280 - index * 20
                  })}
                  whileHover={{ 
                    scale: 1.02,
                    transition: getSpringConfig({ stiffness: 400, damping: 25 })
                  }}
                  className={`p-8 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-[#ae8d5e]/60 bg-gradient-to-br from-[#ae8d5e]/10 to-[#9a7a4a]/5 backdrop-blur-xl shadow-xl shadow-[#ae8d5e]/20'
                      : 'border-white/20 bg-gradient-to-br from-white/5 to-black/20 backdrop-blur-xl hover:border-[#ae8d5e]/40 hover:bg-gradient-to-br hover:from-[#ae8d5e]/5 hover:to-black/30'
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                        template.id === 'fastCasual' 
                          ? 'bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 border border-emerald-400/30'
                          : template.id === 'pizzeria'
                          ? 'bg-gradient-to-br from-red-500/30 to-red-600/20 border border-red-400/30'
                          : template.id === 'cafe'
                          ? 'bg-gradient-to-br from-amber-500/30 to-amber-600/20 border border-amber-400/30'
                          : 'bg-gradient-to-br from-blue-500/30 to-blue-600/20 border border-blue-400/30'
                      }`}>
                        <Icon className={`w-8 h-8 ${
                          template.id === 'fastCasual' 
                            ? 'text-emerald-300'
                            : template.id === 'pizzeria'
                            ? 'text-red-300'
                            : template.id === 'cafe'
                            ? 'text-amber-300'
                            : 'text-blue-300'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-2">
                          {template.name}
                        </h4>
                        <p className="text-sm text-white/80 leading-relaxed">
                          {template.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePreviewClick(template)
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl hover:bg-white/15 transition-all duration-200 group"
                      >
                        <Eye className="w-4 h-4 text-white group-hover:text-[#ae8d5e] transition-colors" />
                      </motion.button>
                      
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={getSpringConfig(springConfigs.bouncy)}
                          className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
                        >
                          <div className="w-3 h-3 bg-black rounded-full" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {/* Start from scratch option */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={getSpringConfig({ ...springConfigs.gentle, stiffness: 200 })}
              whileHover={{ 
                scale: 1.02,
                transition: getSpringConfig({ stiffness: 400, damping: 25 })
              }}
              className={`p-8 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                state.menu.mode === 'scratch'
                  ? 'border-purple-500/60 bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-xl shadow-xl shadow-purple-500/20'
                  : 'border-white/20 bg-gradient-to-br from-white/5 to-black/20 backdrop-blur-xl hover:border-purple-500/40 hover:bg-gradient-to-br hover:from-purple-500/5 hover:to-black/30'
              }`}
              onClick={handleScratchSelect}
            >
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/30 to-purple-600/20 border border-purple-400/30 rounded-2xl flex items-center justify-center shadow-lg">
                  <ChefHat className="w-8 h-8 text-purple-300" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white mb-2">Start from Scratch</h4>
                  <p className="text-sm text-white/80 leading-relaxed">
                    Build your menu completely custom
                  </p>
                </div>
                
                {state.menu.mode === 'scratch' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={getSpringConfig(springConfigs.bouncy)}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    <div className="w-3 h-3 bg-black rounded-full" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={getSpringConfig({ ...springConfigs.gentle, stiffness: 200 })}
        className="flex items-center justify-between pt-6 border-t"
      >
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-white/70 hover:text-white"
        >
          Back
        </Button>

        <Button
          onClick={onNext}
          disabled={!canProceed || isLoading}
          className={`px-8 py-3 font-medium rounded-xl transition-all duration-200 ${
            canProceed
              ? 'bg-[#ae8d5e] hover:bg-[#9a7a4a] text-white shadow-lg shadow-[#ae8d5e]/30 hover:shadow-[#9a7a4a]/40 transform hover:scale-[1.02]'
              : 'bg-gray-200 text-gray-600 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Setting up Menu...</span>
            </div>
          ) : (
            'Continue'
          )}
        </Button>
      </motion.div>

      {/* Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && previewTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsPreviewOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={getSpringConfig(springConfigs.gentle)}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-[#ae8d5e] to-[#9a7a4a] text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center shadow-lg">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Menu Preview</h3>
                    <p className="text-sm text-white/80">{previewTemplate.name} Template</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  {/* Template Header */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center shadow-lg">
                      <previewTemplate.icon className="w-8 h-8 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {previewTemplate.name} Menu
                      </h3>
                      <p className="text-sm text-gray-500">
                        {previewTemplate.description}
                      </p>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-700">Sample Menu Items</h4>
                    <div className="space-y-3">
                      {previewTemplate.preview.map((item: any, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <div>
                            <p className="font-semibold text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">{item.category}</p>
                          </div>
                          <span className="text-lg font-bold text-emerald-500">
                            {item.price}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-blue-800">
                      💡 <strong>Note:</strong> This is a sample menu. More items will be added based on your template when you complete the setup.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
