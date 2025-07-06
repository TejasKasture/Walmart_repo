const express = require('express');
const router = express.Router();

// Mock dashboard data based on the UI images
const mockDashboardData = {
    overview: {
        neuralNetworkStatus: 'Active',
        season: 'Summer Season',
        revenueIncrease: '12.4%',
        customerSatisfaction: '+18%',
        detectionAccuracy: '95.0%',
        systemUptime: '99.8%',
        totalVisitors: 1225.1,
        aiProcessingFps: 38.1,
        dataProcessed: '5.723K',
        networkLatency: '14ms'
    },
    heatmap: {
        zones: [
            {
                id: 'A1',
                name: 'Electronics',
                position: { x: 100, y: 100, width: 200, height: 150 },
                intensity: 85,
                visitors: 450,
                revenue: 25000,
                products: ['Smartphones', 'Tablets', 'Accessories']
            },
            {
                id: 'A2',
                name: 'Clothing',
                position: { x: 320, y: 100, width: 200, height: 150 },
                intensity: 72,
                visitors: 380,
                revenue: 18000,
                products: ['Mens Wear', 'Womens Wear', 'Kids Wear']
            },
            {
                id: 'B1',
                name: 'Groceries',
                position: { x: 100, y: 270, width: 200, height: 150 },
                intensity: 95,
                visitors: 650,
                revenue: 32000,
                products: ['Fresh Produce', 'Dairy', 'Packaged Foods']
            },
            {
                id: 'B2',
                name: 'Home & Garden',
                position: { x: 320, y: 270, width: 200, height: 150 },
                intensity: 87,
                visitors: 295,
                revenue: 15000,
                products: ['Furniture', 'Decor', 'Garden Tools']
            },
            {
                id: 'C1',
                name: 'Health & Beauty',
                position: { x: 210, y: 440, width: 200, height: 120 },
                intensity: 78,
                visitors: 325,
                revenue: 22000,
                products: ['Cosmetics', 'Healthcare', 'Personal Care']
            }
        ],
        totalActive: 3272,
        peakZone: 'C1',
        avgIntensity: '58.0%',
        liveTracking: true
    },
    aiOptimization: {
        patternsAnalyzed: 127,
        processingTime: '15.2s',
        modelConfidence: '98.7%',
        recommendations: [
            {
                title: 'Air Conditioners & Coolers',
                impact: '₹2,45,000',
                effort: 'Medium',
                risk: 'Low'
            },
            {
                title: 'Health Supplements',
                impact: '₹1,85,000',
                effort: 'Low',
                risk: 'Very Low'
            },
            {
                title: 'Premium Smartphones',
                impact: '₹3,20,000',
                effort: 'High',
                risk: 'Medium'
            }
        ],
        projectedRevenue: '₹7,50,000',
        avgConfidence: '85.7%',
        paybackPeriod: '6 months',
        roiIncrease: '15.2%'
    },
    predictiveAnalytics: {
        hourlyTraffic: Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            visitors: Math.floor(Math.random() * 150) + 50,
            predicted: Math.floor(Math.random() * 150) + 50
        })),
        seasonalTrends: [
            { month: 'Jan', traffic: 180, revenue: 45000 },
            { month: 'Feb', traffic: 195, revenue: 48000 },
            { month: 'Mar', traffic: 210, revenue: 52000 },
            { month: 'Apr', traffic: 235, revenue: 58000 },
            { month: 'May', traffic: 280, revenue: 70000 },
            { month: 'Jun', traffic: 320, revenue: 80000 }
        ],
        nextPeak: '2:00 PM',
        confidence: '94.2%',
        accuracy: '5%'
    },
    zonePerformance: {
        utilization: [
            { zone: 'Zone A1', rate: 84, color: '#10B981' },
            { zone: 'Zone A2', rate: 78, color: '#10B981' },
            { zone: 'Zone B1', rate: 92, color: '#10B981' },
            { zone: 'Zone B2', rate: 68, color: '#F59E0B' },
            { zone: 'Zone C1', rate: 76, color: '#10B981' }
        ],
        distribution: [
            { name: 'Electronics (A1)', percentage: 25, color: '#3B82F6' },
            { name: 'Clothing (A2)', percentage: 20, color: '#8B5CF6' },
            { name: 'Groceries (B1)', percentage: 30, color: '#10B981' },
            { name: 'Home & Garden (B2)', percentage: 15, color: '#F59E0B' },
            { name: 'Health & Beauty (C1)', percentage: 10, color: '#EF4444' }
        ]
    },
    systemPerformance: {
        aiProcessingSpeed: '34.1 FPS',
        networkStatus: '16ms',
        dataProcessing: '5.0K',
        securityStatus: 'Secure',
        uptime: '99.8%',
        lastUpdate: new Date().toISOString()
    }
};

// GET /api/dashboard/overview - Get dashboard overview
router.get('/overview', async (req, res) => {
    try {
        res.json({
            success: true,
            data: mockDashboardData.overview
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch dashboard overview',
            message: error.message
        });
    }
});

// GET /api/dashboard/heatmap - Get live heatmap data
router.get('/heatmap', async (req, res) => {
    try {
        const { timeRange, dateRange, intensityRange } = req.query;
        
        let heatmapData = { ...mockDashboardData.heatmap };
        
        // Apply filters if provided
        if (intensityRange) {
            const [min, max] = intensityRange.split('-').map(Number);
            heatmapData.zones = heatmapData.zones.filter(zone => 
                zone.intensity >= min && zone.intensity <= max
            );
        }
        
        // Simulate real-time updates
        heatmapData.zones = heatmapData.zones.map(zone => ({
            ...zone,
            intensity: Math.max(10, zone.intensity + (Math.random() - 0.5) * 10),
            visitors: Math.max(0, zone.visitors + Math.floor((Math.random() - 0.5) * 20))
        }));
        
        res.json({
            success: true,
            data: heatmapData,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch heatmap data',
            message: error.message
        });
    }
});

// GET /api/dashboard/ai-optimization - Get AI optimization data
router.get('/ai-optimization', async (req, res) => {
    try {
        res.json({
            success: true,
            data: mockDashboardData.aiOptimization,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch AI optimization data',
            message: error.message
        });
    }
});

// GET /api/dashboard/predictive-analytics - Get predictive analytics
router.get('/predictive-analytics', async (req, res) => {
    try {
        const { timeframe } = req.query;
        
        let analyticsData = { ...mockDashboardData.predictiveAnalytics };
        
        // Adjust data based on timeframe
        if (timeframe === 'week') {
            analyticsData.hourlyTraffic = analyticsData.hourlyTraffic.slice(0, 7);
        } else if (timeframe === 'month') {
            analyticsData.hourlyTraffic = analyticsData.hourlyTraffic.slice(0, 30);
        }
        
        res.json({
            success: true,
            data: analyticsData,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch predictive analytics',
            message: error.message
        });
    }
});

// GET /api/dashboard/zone-performance - Get zone performance data
router.get('/zone-performance', async (req, res) => {
    try {
        res.json({
            success: true,
            data: mockDashboardData.zonePerformance,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch zone performance data',
            message: error.message
        });
    }
});

// GET /api/dashboard/system-performance - Get system performance metrics
router.get('/system-performance', async (req, res) => {
    try {
        // Simulate real-time system metrics
        const systemData = {
            ...mockDashboardData.systemPerformance,
            aiProcessingSpeed: `${(Math.random() * 5 + 32).toFixed(1)} FPS`,
            networkStatus: `${Math.floor(Math.random() * 10 + 10)}ms`,
            dataProcessing: `${(Math.random() * 2 + 4).toFixed(1)}K`,
            cpuUsage: Math.floor(Math.random() * 30 + 40),
            memoryUsage: Math.floor(Math.random() * 25 + 60),
            diskUsage: Math.floor(Math.random() * 20 + 30)
        };
        
        res.json({
            success: true,
            data: systemData,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch system performance data',
            message: error.message
        });
    }
});

// GET /api/dashboard/live-stats - Get live statistics
router.get('/live-stats', async (req, res) => {
    try {
        const liveStats = {
            currentVisitors: Math.floor(Math.random() * 100 + 150),
            peakHourTraffic: Math.floor(Math.random() * 50 + 300),
            avgDwellTime: (Math.random() * 2 + 3).toFixed(1),
            conversionRate: (Math.random() * 5 + 12).toFixed(1),
            revenueToday: Math.floor(Math.random() * 10000 + 45000),
            alertsActive: Math.floor(Math.random() * 3),
            zonesActive: 5,
            aiConfidence: (Math.random() * 5 + 95).toFixed(1),
            lastUpdate: new Date().toISOString()
        };
        
        res.json({
            success: true,
            data: liveStats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch live statistics',
            message: error.message
        });
    }
});

// POST /api/dashboard/export-data - Export dashboard data
router.post('/export-data', async (req, res) => {
    try {
        const { format, dateRange, sections } = req.body;
        
        // Validate format
        if (!['json', 'csv', 'pdf'].includes(format)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid export format. Supported formats: json, csv, pdf'
            });
        }
        
        // Simulate export process
        const exportData = {
            exportId: `export_${Date.now()}`,
            format,
            dateRange,
            sections: sections || ['overview', 'heatmap', 'analytics'],
            status: 'processing',
            createdAt: new Date().toISOString(),
            estimatedCompletion: new Date(Date.now() + 30000).toISOString()
        };
        
        res.json({
            success: true,
            data: exportData,
            message: 'Export initiated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to initiate data export',
            message: error.message
        });
    }
});

// GET /api/dashboard/alerts - Get active alerts
router.get('/alerts', async (req, res) => {
    try {
        const alerts = [
            {
                id: 1,
                type: 'traffic_spike',
                severity: 'medium',
                zone: 'B1',
                message: 'Unusual traffic spike detected in Groceries zone',
                timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
                acknowledged: false
            },
            {
                id: 2,
                type: 'system_optimization',
                severity: 'low',
                zone: 'C1',
                message: 'New optimization opportunity identified',
                timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                acknowledged: false
            }
        ];
        
        res.json({
            success: true,
            data: alerts,
            total: alerts.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch alerts',
            message: error.message
        });
    }
});

// POST /api/dashboard/alerts/:id/acknowledge - Acknowledge an alert
router.post('/alerts/:id/acknowledge', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, notes } = req.body;
        
        const acknowledgment = {
            alertId: parseInt(id),
            acknowledgedBy: userId,
            acknowledgedAt: new Date().toISOString(),
            notes: notes || '',
            status: 'acknowledged'
        };
        
        res.json({
            success: true,
            data: acknowledgment,
            message: 'Alert acknowledged successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to acknowledge alert',
            message: error.message
        });
    }
});

// GET /api/dashboard/summary - Get complete dashboard summary
router.get('/summary', async (req, res) => {
    try {
        const summary = {
            ...mockDashboardData.overview,
            quickStats: {
                totalZones: mockDashboardData.heatmap.zones.length,
                activeRecommendations: mockDashboardData.aiOptimization.recommendations.length,
                peakZone: mockDashboardData.heatmap.peakZone,
                systemHealth: 'Excellent'
            },
            recentActivity: [
                {
                    type: 'optimization',
                    message: 'AI recommendation implemented in Electronics zone',
                    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
                },
                {
                    type: 'traffic',
                    message: 'Peak traffic period started',
                    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString()
                },
                {
                    type: 'system',
                    message: 'Neural network model updated',
                    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
                }
            ],
            timestamp: new Date().toISOString()
        };
        
        res.json({
            success: true,
            data: summary
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch dashboard summary',
            message: error.message
        });
    }
});

module.exports = router; 