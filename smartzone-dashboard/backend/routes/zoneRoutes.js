const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

// Mock data for zones
const zones = [
  { id: 'A1', name: 'Electronics', type: 'Electronics', intensity: 87, visitors: 245, avgDwellTime: 4.2 },
  { id: 'B2', name: 'Clothing', type: 'Clothing', intensity: 92, visitors: 312, avgDwellTime: 6.5 },
  { id: 'C1', name: 'Groceries', type: 'Groceries', intensity: 78, visitors: 486, avgDwellTime: 3.8 },
  { id: 'D2', name: 'Home & Garden', type: 'Home & Garden', intensity: 65, visitors: 156, avgDwellTime: 5.2 },
  { id: 'E1', name: 'Health & Beauty', type: 'Health & Beauty', intensity: 71, visitors: 189, avgDwellTime: 4.7 }
];

// @desc    Get all zones
// @route   GET /api/zones
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type, minIntensity, maxIntensity } = req.query;
    
    let filteredZones = zones;
    
    if (type) {
      filteredZones = filteredZones.filter(zone => zone.type.toLowerCase() === type.toLowerCase());
    }
    
    if (minIntensity) {
      filteredZones = filteredZones.filter(zone => zone.intensity >= parseInt(minIntensity));
    }
    
    if (maxIntensity) {
      filteredZones = filteredZones.filter(zone => zone.intensity <= parseInt(maxIntensity));
    }

    res.status(200).json({
      success: true,
      count: filteredZones.length,
      data: filteredZones
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get single zone
// @route   GET /api/zones/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const zone = zones.find(z => z.id === req.params.id);
    
    if (!zone) {
      return res.status(404).json({
        success: false,
        message: 'Zone not found'
      });
    }

    // Add additional details for single zone
    const zoneDetails = {
      ...zone,
      heatmapData: generateHeatmapData(zone.id),
      trafficPattern: generateTrafficPattern(zone.id),
      recentActivity: generateRecentActivity(zone.id)
    };

    res.status(200).json({
      success: true,
      data: zoneDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get zone analytics
// @route   GET /api/zones/:id/analytics
// @access  Public
router.get('/:id/analytics', async (req, res) => {
  try {
    const zone = zones.find(z => z.id === req.params.id);
    
    if (!zone) {
      return res.status(404).json({
        success: false,
        message: 'Zone not found'
      });
    }

    const analytics = {
      zoneId: zone.id,
      zoneName: zone.name,
      totalVisitors: zone.visitors,
      avgDwellTime: zone.avgDwellTime,
      peakHours: ['2:00 PM', '3:00 PM', '7:00 PM'],
      conversionRate: Math.round(Math.random() * 30 + 20), // 20-50%
      revenue: Math.round(Math.random() * 50000 + 10000), // $10k-60k
      topProducts: [
        { name: 'Product A', sales: Math.round(Math.random() * 100 + 50) },
        { name: 'Product B', sales: Math.round(Math.random() * 100 + 50) },
        { name: 'Product C', sales: Math.round(Math.random() * 100 + 50) }
      ],
      weeklyTrend: Array.from({ length: 7 }, () => Math.round(Math.random() * 200 + 100))
    };

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Update zone configuration
// @route   PUT /api/zones/:id
// @access  Protected
router.put('/:id', protect, async (req, res) => {
  try {
    const zoneIndex = zones.findIndex(z => z.id === req.params.id);
    
    if (zoneIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Zone not found'
      });
    }

    const updatedZone = { ...zones[zoneIndex], ...req.body };
    zones[zoneIndex] = updatedZone;

    res.status(200).json({
      success: true,
      data: updatedZone
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Helper functions
function generateHeatmapData(zoneId) {
  return Array.from({ length: 10 }, (_, i) => ({
    x: i % 5,
    y: Math.floor(i / 5),
    intensity: Math.round(Math.random() * 100)
  }));
}

function generateTrafficPattern(zoneId) {
  return Array.from({ length: 24 }, (_, hour) => ({
    hour: `${hour}:00`,
    visitors: Math.round(Math.random() * 50 + 10)
  }));
}

function generateRecentActivity(zoneId) {
  return Array.from({ length: 10 }, (_, i) => ({
    timestamp: new Date(Date.now() - i * 60000).toISOString(),
    action: ['entry', 'exit', 'purchase', 'browse'][Math.floor(Math.random() * 4)],
    customerId: `customer_${Math.floor(Math.random() * 1000)}`
  }));
}

module.exports = router; 