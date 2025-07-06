const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// @desc    Get live traffic data
// @route   GET /api/traffic/live
// @access  Public
router.get('/live', async (req, res) => {
  try {
    const liveTrafficData = {
      totalVisitors: 1225,
      currentOccupancy: 87,
      maxCapacity: 1500,
      avgProcessingTime: 38.1,
      dataProcessed: 5.723,
      networkLatency: 14,
      peakZone: 'Zone B2',
      peakZoneIntensity: 87,
      movementFlow: 2.3,
      avgDwellTime: 4.2,
      entrances: [
        { id: 'main', name: 'Main Entrance', count: 245, status: 'active' },
        { id: 'side', name: 'Side Entrance', count: 89, status: 'active' },
        { id: 'back', name: 'Back Entrance', count: 34, status: 'active' }
      ],
      exits: [
        { id: 'main', name: 'Main Exit', count: 198, status: 'active' },
        { id: 'side', name: 'Side Exit', count: 76, status: 'active' },
        { id: 'emergency', name: 'Emergency Exit', count: 2, status: 'active' }
      ],
      hourlyPattern: Array.from({ length: 24 }, (_, hour) => ({
        hour: `${hour.toString().padStart(2, '0')}:00`,
        visitors: Math.round(Math.random() * 200 + 50),
        revenue: Math.round(Math.random() * 5000 + 1000)
      })),
      realTimeMovement: Array.from({ length: 20 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 30000).toISOString(),
        zone: ['A1', 'B2', 'C1', 'D2', 'E1'][Math.floor(Math.random() * 5)],
        direction: ['north', 'south', 'east', 'west'][Math.floor(Math.random() * 4)],
        count: Math.round(Math.random() * 10 + 1)
      }))
    };

    res.status(200).json({
      success: true,
      data: liveTrafficData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get historical traffic data
// @route   GET /api/traffic/historical
// @access  Public
router.get('/historical', async (req, res) => {
  try {
    const { startDate, endDate, granularity = 'day' } = req.query;
    
    const historicalData = {
      period: {
        start: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: endDate || new Date().toISOString(),
        granularity
      },
      summary: {
        totalVisitors: 45673,
        avgDailyVisitors: 1522,
        peakDay: '2024-01-15',
        peakDayVisitors: 2134,
        avgDwellTime: 4.7,
        conversionRate: 23.4
      },
      dailyTraffic: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        visitors: Math.round(Math.random() * 500 + 1000),
        revenue: Math.round(Math.random() * 20000 + 5000),
        avgDwellTime: Math.round((Math.random() * 2 + 3) * 10) / 10
      })).reverse(),
      weeklyPattern: [
        { day: 'Monday', avgVisitors: 1234, avgRevenue: 12450 },
        { day: 'Tuesday', avgVisitors: 1156, avgRevenue: 11780 },
        { day: 'Wednesday', avgVisitors: 1345, avgRevenue: 13890 },
        { day: 'Thursday', avgVisitors: 1567, avgRevenue: 15234 },
        { day: 'Friday', avgVisitors: 1789, avgRevenue: 18945 },
        { day: 'Saturday', avgVisitors: 2145, avgRevenue: 23456 },
        { day: 'Sunday', avgVisitors: 1890, avgRevenue: 19876 }
      ],
      seasonalTrends: [
        { month: 'Jan', visitors: 42000, revenue: 450000 },
        { month: 'Feb', visitors: 38000, revenue: 420000 },
        { month: 'Mar', visitors: 45000, revenue: 480000 },
        { month: 'Apr', visitors: 47000, revenue: 510000 },
        { month: 'May', visitors: 52000, revenue: 580000 },
        { month: 'Jun', visitors: 55000, revenue: 620000 }
      ]
    };

    res.status(200).json({
      success: true,
      data: historicalData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get traffic predictions
// @route   GET /api/traffic/predictions
// @access  Public
router.get('/predictions', async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    
    const predictions = {
      modelAccuracy: 94.2,
      confidence: 85.7,
      lastUpdated: new Date().toISOString(),
      predictions: Array.from({ length: parseInt(hours) }, (_, i) => ({
        timestamp: new Date(Date.now() + i * 60 * 60 * 1000).toISOString(),
        expectedVisitors: Math.round(Math.random() * 200 + 100),
        confidence: Math.round(Math.random() * 20 + 80),
        factors: [
          { name: 'Weather', impact: Math.round(Math.random() * 20 + 80) },
          { name: 'Day of Week', impact: Math.round(Math.random() * 20 + 80) },
          { name: 'Seasonality', impact: Math.round(Math.random() * 20 + 80) },
          { name: 'Promotions', impact: Math.round(Math.random() * 20 + 80) }
        ]
      })),
      recommendations: [
        'Increase staff in Electronics zone during 2-4 PM',
        'Schedule promotion in Clothing zone during low-traffic hours',
        'Optimize checkout lanes during peak hours',
        'Consider mobile checkout for high-traffic zones'
      ]
    };

    res.status(200).json({
      success: true,
      data: predictions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get zone-specific traffic
// @route   GET /api/traffic/zones/:zoneId
// @access  Public
router.get('/zones/:zoneId', async (req, res) => {
  try {
    const { zoneId } = req.params;
    
    const zoneTraffic = {
      zoneId,
      currentVisitors: Math.round(Math.random() * 100 + 50),
      capacity: 200,
      utilizationRate: Math.round(Math.random() * 40 + 60),
      avgDwellTime: Math.round((Math.random() * 3 + 2) * 10) / 10,
      entryRate: Math.round(Math.random() * 20 + 10),
      exitRate: Math.round(Math.random() * 20 + 10),
      hourlyTraffic: Array.from({ length: 24 }, (_, hour) => ({
        hour: `${hour.toString().padStart(2, '0')}:00`,
        visitors: Math.round(Math.random() * 50 + 10),
        dwellTime: Math.round((Math.random() * 3 + 2) * 10) / 10
      })),
      heatmapData: generateZoneHeatmap(zoneId),
      movementPatterns: [
        { from: 'entrance', to: 'center', frequency: 45 },
        { from: 'center', to: 'checkout', frequency: 38 },
        { from: 'entrance', to: 'exit', frequency: 12 },
        { from: 'center', to: 'exit', frequency: 5 }
      ]
    };

    res.status(200).json({
      success: true,
      data: zoneTraffic
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Export traffic data
// @route   GET /api/traffic/export
// @access  Protected
router.get('/export', protect, async (req, res) => {
  try {
    const { format = 'json', startDate, endDate } = req.query;
    
    // Mock export data
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        period: { start: startDate, end: endDate },
        format,
        recordCount: 10000
      },
      data: Array.from({ length: 100 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 60000).toISOString(),
        zoneId: ['A1', 'B2', 'C1', 'D2', 'E1'][Math.floor(Math.random() * 5)],
        visitors: Math.round(Math.random() * 20 + 5),
        dwellTime: Math.round((Math.random() * 3 + 2) * 10) / 10,
        revenue: Math.round(Math.random() * 1000 + 100)
      }))
    };

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=traffic_data.csv');
      
      const csvHeader = 'timestamp,zoneId,visitors,dwellTime,revenue\n';
      const csvData = exportData.data.map(row => 
        `${row.timestamp},${row.zoneId},${row.visitors},${row.dwellTime},${row.revenue}`
      ).join('\n');
      
      res.send(csvHeader + csvData);
    } else {
      res.status(200).json({
        success: true,
        data: exportData
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Helper function
function generateZoneHeatmap(zoneId) {
  return Array.from({ length: 20 }, (_, i) => ({
    x: i % 5,
    y: Math.floor(i / 5),
    intensity: Math.round(Math.random() * 100),
    visitors: Math.round(Math.random() * 20 + 1)
  }));
}

module.exports = router; 