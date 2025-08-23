'use client'

import { motion } from 'framer-motion'
import { ChefHat, Palette, Coffee, Pizza, Utensils } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSpringConfig, springConfigs } from '@/lib/a11y/reducedMotion'
import { restaurantThemes } from '@/lib/theme/accent'
import PreviewCard from './PreviewCard'
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
  const selectedTemplate = state.menu.template
  const selectedTemplateData = menuTemplates.find(t => t.id === selectedTemplate)

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={getSpringConfig(springConfigs.gentle)}
        className="text-center space-y-2"
      >
        <div className="w-12 h-12 accent-bg rounded-xl flex items-center justify-center mx-auto mb-4">
          <ChefHat className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Choose your menu style
        </h2>
        <p className="text-gray-600">
          We'll create a starter menu based on your restaurant type
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Template Selection */}
        <div className="space-y-6">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <Palette className="w-4 h-4 mr-2" />
            Choose a Template
          </h3>

          <div className="space-y-4">
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
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-blue-300 bg-blue-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: template.theme.primary + '20' }}
                    >
                      <Icon 
                        className="w-6 h-6" 
                        style={{ color: template.theme.primary }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {template.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {template.description}
                      </p>
                      
                      {/* Mini preview */}
                      <div className="space-y-1">
                        {template.preview.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="text-gray-700">{item.name}</span>
                            <span className="font-medium" style={{ color: template.theme.primary }}>
                              {item.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={getSpringConfig(springConfigs.bouncy)}
                        className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center"
                      >
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </motion.div>
                    )}
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
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                state.menu.mode === 'scratch'
                  ? 'border-purple-300 bg-purple-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
              onClick={handleScratchSelect}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <ChefHat className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Start from Scratch</h4>
                  <p className="text-sm text-gray-600">
                    Build your menu completely custom
                  </p>
                </div>
                
                {state.menu.mode === 'scratch' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={getSpringConfig(springConfigs.bouncy)}
                    className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center ml-auto"
                  >
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Preview */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={getSpringConfig({ ...springConfigs.gentle, stiffness: 240 })}
          className="lg:sticky lg:top-8"
        >
          <PreviewCard
            title="Menu Preview"
            description="See how your menu will look"
          >
            {selectedTemplateData ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: selectedTemplateData.theme.primary + '20' }}
                  >
                    <selectedTemplateData.icon 
                      className="w-4 h-4" 
                      style={{ color: selectedTemplateData.theme.primary }}
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedTemplateData.name} Menu
                  </h3>
                </div>

                <div className="space-y-3">
                  {selectedTemplateData.preview.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.category}</p>
                      </div>
                      <span 
                        className="font-semibold"
                        style={{ color: selectedTemplateData.theme.primary }}
                      >
                        {item.price}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="text-xs text-gray-500 text-center pt-2 border-t">
                  + More items will be added based on your template
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Custom Menu</p>
                <p className="text-sm text-gray-500">
                  You'll build your menu from scratch in the dashboard
                </p>
              </div>
            )}
          </PreviewCard>
        </motion.div>
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
          className="text-gray-600 hover:text-gray-800"
        >
          Back
        </Button>

        <Button
          onClick={onNext}
          disabled={isLoading}
          className="px-8 py-3 font-semibold rounded-xl accent-bg accent-hover text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
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
    </div>
  )
}
