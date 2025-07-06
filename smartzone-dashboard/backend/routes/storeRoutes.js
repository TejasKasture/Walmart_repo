const express = require('express');
const router = express.Router();

// Mock store data
const mockStores = [
    {
        id: 1,
        name: 'Walmart Supercenter - Downtown',
        location: {
            address: '123 Main St, Downtown',
            city: 'Mumbai',
            state: 'Maharashtra',
            zipCode: '400001',
            coordinates: { lat: 19.0760, lng: 72.8777 }
        },
        size: 15000, // sq ft
        zones: ['A1', 'A2', 'B1', 'B2', 'C1'],
        status: 'active',
        manager: 'Rajesh Kumar',
        openingHours: {
            monday: '6:00 AM - 11:00 PM',
            tuesday: '6:00 AM - 11:00 PM',
            wednesday: '6:00 AM - 11:00 PM',
            thursday: '6:00 AM - 11:00 PM',
            friday: '6:00 AM - 11:00 PM',
            saturday: '6:00 AM - 11:00 PM',
            sunday: '7:00 AM - 10:00 PM'
        },
        metrics: {
            dailyVisitors: 1225,
            peakZone: 'C1',
            avgDwellTime: 4.2,
            conversionRate: 12.4,
            revenue: 45000,
            aiProcessingSpeed: 34.1
        }
    },
    {
        id: 2,
        name: 'Walmart Neighborhood Market - Suburbs',
        location: {
            address: '456 Oak Ave, Suburbs',
            city: 'Pune',
            state: 'Maharashtra',
            zipCode: '411001',
            coordinates: { lat: 18.5204, lng: 73.8567 }
        },
        size: 8000,
        zones: ['A1', 'B1', 'B2'],
        status: 'active',
        manager: 'Priya Sharma',
        openingHours: {
            monday: '7:00 AM - 10:00 PM',
            tuesday: '7:00 AM - 10:00 PM',
            wednesday: '7:00 AM - 10:00 PM',
            thursday: '7:00 AM - 10:00 PM',
            friday: '7:00 AM - 10:00 PM',
            saturday: '7:00 AM - 10:00 PM',
            sunday: '8:00 AM - 9:00 PM'
        },
        metrics: {
            dailyVisitors: 850,
            peakZone: 'B1',
            avgDwellTime: 3.8,
            conversionRate: 15.2,
            revenue: 32000,
            aiProcessingSpeed: 28.5
        }
    }
];

// GET /api/stores - Get all stores
router.get('/', async (req, res) => {
    try {
        const { city, state, status, sortBy } = req.query;
        
        let stores = [...mockStores];
        
        // Filter by city
        if (city) {
            stores = stores.filter(s => s.location.city.toLowerCase().includes(city.toLowerCase()));
        }
        
        // Filter by state
        if (state) {
            stores = stores.filter(s => s.location.state.toLowerCase().includes(state.toLowerCase()));
        }
        
        // Filter by status
        if (status) {
            stores = stores.filter(s => s.status === status);
        }
        
        // Sort stores
        if (sortBy === 'visitors') {
            stores.sort((a, b) => b.metrics.dailyVisitors - a.metrics.dailyVisitors);
        } else if (sortBy === 'revenue') {
            stores.sort((a, b) => b.metrics.revenue - a.metrics.revenue);
        } else if (sortBy === 'size') {
            stores.sort((a, b) => b.size - a.size);
        }
        
        res.json({
            success: true,
            data: stores,
            total: stores.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch stores',
            message: error.message
        });
    }
});

// GET /api/stores/:id - Get specific store
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const store = mockStores.find(s => s.id === parseInt(id));
        
        if (!store) {
            return res.status(404).json({
                success: false,
                error: 'Store not found'
            });
        }
        
        // Add additional details for single store view
        const storeDetails = {
            ...store,
            recentActivity: [
                {
                    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                    event: 'Peak traffic detected in zone C1',
                    type: 'traffic_alert'
                },
                {
                    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
                    event: 'AI recommendation implemented',
                    type: 'optimization'
                },
                {
                    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
                    event: 'New heatmap data processed',
                    type: 'data_update'
                }
            ],
            systemHealth: {
                aiProcessingStatus: 'active',
                sensorStatus: 'all_operational',
                dataQuality: 98.7,
                lastUpdate: new Date().toISOString()
            }
        };
        
        res.json({
            success: true,
            data: storeDetails
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch store details',
            message: error.message
        });
    }
});

// POST /api/stores - Create new store
router.post('/', async (req, res) => {
    try {
        const { name, location, size, zones, manager, openingHours } = req.body;
        
        // Validate required fields
        if (!name || !location || !size || !zones || !manager) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }
        
        const newStore = {
            id: mockStores.length + 1,
            name,
            location,
            size,
            zones,
            status: 'active',
            manager,
            openingHours: openingHours || {
                monday: '6:00 AM - 11:00 PM',
                tuesday: '6:00 AM - 11:00 PM',
                wednesday: '6:00 AM - 11:00 PM',
                thursday: '6:00 AM - 11:00 PM',
                friday: '6:00 AM - 11:00 PM',
                saturday: '6:00 AM - 11:00 PM',
                sunday: '7:00 AM - 10:00 PM'
            },
            metrics: {
                dailyVisitors: 0,
                peakZone: zones[0],
                avgDwellTime: 0,
                conversionRate: 0,
                revenue: 0,
                aiProcessingSpeed: 0
            },
            createdAt: new Date().toISOString()
        };
        
        mockStores.push(newStore);
        
        res.status(201).json({
            success: true,
            data: newStore,
            message: 'Store created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to create store',
            message: error.message
        });
    }
});

// PUT /api/stores/:id - Update store
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const storeIndex = mockStores.findIndex(s => s.id === parseInt(id));
        
        if (storeIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Store not found'
            });
        }
        
        const updatedStore = {
            ...mockStores[storeIndex],
            ...req.body,
            updatedAt: new Date().toISOString()
        };
        
        mockStores[storeIndex] = updatedStore;
        
        res.json({
            success: true,
            data: updatedStore,
            message: 'Store updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update store',
            message: error.message
        });
    }
});

// GET /api/stores/:id/zones - Get store zones
router.get('/:id/zones', async (req, res) => {
    try {
        const { id } = req.params;
        const store = mockStores.find(s => s.id === parseInt(id));
        
        if (!store) {
            return res.status(404).json({
                success: false,
                error: 'Store not found'
            });
        }
        
        const zoneDetails = store.zones.map(zone => ({
            id: zone,
            name: zone,
            utilization: Math.floor(Math.random() * 40) + 60, // 60-100%
            traffic: Math.floor(Math.random() * 200) + 50,
            revenue: Math.floor(Math.random() * 10000) + 5000,
            status: 'active'
        }));
        
        res.json({
            success: true,
            data: zoneDetails
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch store zones',
            message: error.message
        });
    }
});

// GET /api/stores/analytics/summary - Get stores analytics summary
router.get('/analytics/summary', async (req, res) => {
    try {
        const totalStores = mockStores.length;
        const totalVisitors = mockStores.reduce((sum, s) => sum + s.metrics.dailyVisitors, 0);
        const totalRevenue = mockStores.reduce((sum, s) => sum + s.metrics.revenue, 0);
        const avgConversionRate = mockStores.reduce((sum, s) => sum + s.metrics.conversionRate, 0) / totalStores;
        const avgDwellTime = mockStores.reduce((sum, s) => sum + s.metrics.avgDwellTime, 0) / totalStores;
        
        const cityBreakdown = mockStores.reduce((acc, s) => {
            acc[s.location.city] = (acc[s.location.city] || 0) + 1;
            return acc;
        }, {});
        
        const sizeBreakdown = mockStores.reduce((acc, s) => {
            const category = s.size > 10000 ? 'Large' : s.size > 5000 ? 'Medium' : 'Small';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});
        
        res.json({
            success: true,
            data: {
                totalStores,
                totalVisitors,
                totalRevenue: `₹${totalRevenue.toLocaleString()}`,
                avgConversionRate: Math.round(avgConversionRate * 10) / 10,
                avgDwellTime: Math.round(avgDwellTime * 10) / 10,
                cityBreakdown,
                sizeBreakdown,
                networkStatus: 'All systems operational',
                lastUpdate: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch stores analytics',
            message: error.message
        });
    }
});

module.exports = router; 