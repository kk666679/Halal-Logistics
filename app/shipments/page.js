'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Shipments() {
  const [shipments, setShipments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [trackingId, setTrackingId] = useState('')
  const [formData, setFormData] = useState({
    product: '',
    origin: '',
    destination: '',
    trackingId: ''
  })

  useEffect(() => {
    fetchShipments()
  }, [])

  const fetchShipments = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/shipments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setShipments(data.shipments)
      }
    } catch (error) {
      console.error('Error fetching shipments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setFormData({ product: '', origin: '', destination: '', trackingId: '' })
        setShowForm(false)
        fetchShipments()
      } else {
        alert('Failed to create shipment')
      }
    } catch (error) {
      alert('Failed to create shipment')
    }
  }

  const handleTrackShipment = async () => {
    if (!trackingId) return

    try {
      const response = await fetch(`/api/shipments/track/${trackingId}`)
      const data = await response.json()

      if (response.ok) {
        alert(`Shipment Status: ${data.shipment.status}`)
      } else {
        alert('Shipment not found')
      }
    } catch (error) {
      alert('Error tracking shipment')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'text-green-600'
      case 'IN_TRANSIT': return 'text-blue-600'
      case 'CREATED': return 'text-yellow-600'
      case 'FAILED': return 'text-red-600'
      default: return 'text-gray-600'
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
        <h1 className="text-3xl font-bold">Shipments</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'New Shipment'}
        </Button>
      </div>

      {/* Track Shipment */}
      <Card>
        <CardHeader>
          <CardTitle>Track Shipment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter tracking ID"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
            />
            <Button onClick={handleTrackShipment}>Track</Button>
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Create New Shipment</CardTitle>
              <CardDescription>
                Create a new shipment for tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product">Product</Label>
                    <Input
                      id="product"
                      value={formData.product}
                      onChange={(e) => setFormData({...formData, product: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trackingId">Tracking ID</Label>
                    <Input
                      id="trackingId"
                      value={formData.trackingId}
                      onChange={(e) => setFormData({...formData, trackingId: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin">Origin</Label>
                    <Input
                      id="origin"
                      value={formData.origin}
                      onChange={(e) => setFormData({...formData, origin: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination</Label>
                    <Input
                      id="destination"
                      value={formData.destination}
                      onChange={(e) => setFormData({...formData, destination: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <Button type="submit">Create Shipment</Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid gap-4">
        {shipments.map((shipment) => (
          <motion.div
            key={shipment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{shipment.product}</CardTitle>
                    <CardDescription>
                      {shipment.origin} → {shipment.destination}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <span className={`font-semibold ${getStatusColor(shipment.status)}`}>
                      {shipment.status}
                    </span>
                    {shipment.certified && (
                      <div className="text-green-600 text-sm">✓ Halal Certified</div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tracking ID: {shipment.trackingId}</span>
                  <span>Created: {new Date(shipment.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
