'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Inventory() {
  const [inventoryItems, setInventoryItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    location: '',
    halalCertified: false
  })

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/inventory', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setInventoryItems(data.inventoryItems)
      }
    } catch (error) {
      console.error('Error fetching inventory:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setFormData({ productName: '', quantity: '', location: '', halalCertified: false })
        setShowForm(false)
        fetchInventory()
      } else {
        alert('Failed to add inventory item')
      }
    } catch (error) {
      alert('Failed to add inventory item')
    }
  }

  const toggleHalalCertified = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/inventory/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ halalCertified: !currentStatus })
      })

      if (response.ok) {
        fetchInventory()
      } else {
        alert('Failed to update certification status')
      }
    } catch (error) {
      alert('Failed to update certification status')
    }
  }

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Item'}
        </Button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Add Inventory Item</CardTitle>
              <CardDescription>
                Add new items to inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      value={formData.productName}
                      onChange={(e) => setFormData({...formData, productName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Warehouse, Transport, etc."
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="halalCertified"
                    checked={formData.halalCertified}
                    onChange={(e) => setFormData({...formData, halalCertified: e.target.checked})}
                  />
                  <Label htmlFor="halalCertified">Halal Certified</Label>
                </div>
                <Button type="submit">Add Item</Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid gap-4">
        {inventoryItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{item.productName}</CardTitle>
                    <CardDescription>
                      Location: {item.location}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">Qty: {item.quantity}</div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleHalalCertified(item.id, item.halalCertified)}
                      className={item.halalCertified ? 'text-green-600 border-green-600' : ''}
                    >
                      {item.halalCertified ? '✓ Certified' : 'Mark as Certified'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Added by: {item.user.email}</span>
                  <span>Added: {new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
