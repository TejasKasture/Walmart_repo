const mongoose = require('mongoose');
const { TRAFFIC_INTENSITY } = require('../config/constants');

const trafficSchema = new mongoose.Schema({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true,
        index: true
    },
    zoneId: {
        type: String,
        required: true,
        index: true
    },
    timestamp: {
        type: Date,
        required: true,
        index: true
    },
    visitorCount: {
        type: Number,
        required: true,
        min: 0
    },
    uniqueVisitors: {
        type: Number,
        required: true,
        min: 0
    },
    avgDwellTime: {
        type: Number,
        required: true,
        min: 0
    },
    peakDensity: {
        type: Number,
        required: true,
        min: 0
    },
    intensity: {
        type: String,
        enum: Object.values(TRAFFIC_INTENSITY),
        required: true
    },
    entrances: {
        type: Number,
        default: 0
    },
    exits: {
        type: Number,
        default: 0
    },
    movementPatterns: [{
        fromZone: String,
        toZone: String,
        count: Number,
        avgTransitionTime: Number
    }],
    demographics: {
        ageGroups: {
            child: { type: Number, default: 0 },
            teen: { type: Number, default: 0 },
            adult: { type: Number, default: 0 },
            senior: { type: Number, default: 0 }
        },
        gender: {
            male: { type: Number, default: 0 },
            female: { type: Number, default: 0 },
            other: { type: Number, default: 0 }
        }
    },
    weatherConditions: {
        temperature: Number,
        humidity: Number,
        condition: String // sunny, rainy, cloudy, etc.
    },
    events: [{
        type: String, // promotion, sale, holiday, etc.
        name: String,
        impact: Number // multiplier effect on traffic
    }],
    hourlySummary: {
        hour: {
            type: Number,
            min: 0,
            max: 23
        },
        totalVisitors: Number,
        avgDwellTime: Number,
        peakDensity: Number
    },
    conversionMetrics: {
        totalInteractions: {
            type: Number,
            default: 0
        },
        productPickups: {
            type: Number,
            default: 0
        },
        conversions: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Compound indexes for performance
trafficSchema.index({ storeId: 1, zoneId: 1, timestamp: -1 });
trafficSchema.index({ timestamp: 1, intensity: 1 });
trafficSchema.index({ 'hourlySummary.hour': 1, visitorCount: -1 });

// Virtual for conversion rate
trafficSchema.virtual('conversionRate').get(function() {
    if (this.conversionMetrics.totalInteractions === 0) return 0;
    return (this.conversionMetrics.conversions / this.conversionMetrics.totalInteractions) * 100;
});

// Virtual for traffic efficiency
trafficSchema.virtual('trafficEfficiency').get(function() {
    if (this.visitorCount === 0) return 0;
    return (this.conversionMetrics.conversions / this.visitorCount) * 100;
});

// Methods
trafficSchema.methods.calculateIntensity = function() {
    const visitors = this.visitorCount;
    const dwellTime = this.avgDwellTime;
    
    // Calculate intensity based on visitors and dwell time
    let intensity = 'low';
    if (visitors > 50 && dwellTime > 60) intensity = 'medium';
    if (visitors > 100 && dwellTime > 120) intensity = 'high';
    if (visitors > 200 && dwellTime > 180) intensity = 'very_high';
    
    this.intensity = intensity;
    return intensity;
};

trafficSchema.methods.addMovementPattern = function(fromZone, toZone, transitionTime) {
    const existingPattern = this.movementPatterns.find(p => 
        p.fromZone === fromZone && p.toZone === toZone
    );
    
    if (existingPattern) {
        existingPattern.count += 1;
        existingPattern.avgTransitionTime = 
            (existingPattern.avgTransitionTime + transitionTime) / 2;
    } else {
        this.movementPatterns.push({
            fromZone,
            toZone,
            count: 1,
            avgTransitionTime: transitionTime
        });
    }
    
    return this.save();
};

// Static methods
trafficSchema.statics.findByZoneAndDateRange = function(storeId, zoneId, startDate, endDate) {
    return this.find({
        storeId,
        zoneId,
        timestamp: {
            $gte: startDate,
            $lte: endDate
        }
    }).sort({ timestamp: -1 });
};

trafficSchema.statics.getHourlyTraffic = function(storeId, zoneId, date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    return this.aggregate([
        {
            $match: {
                storeId: new mongoose.Types.ObjectId(storeId),
                zoneId: zoneId,
                timestamp: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: { $hour: '$timestamp' },
                totalVisitors: { $sum: '$visitorCount' },
                avgDwellTime: { $avg: '$avgDwellTime' },
                peakDensity: { $max: '$peakDensity' }
            }
        },
        {
            $sort: { '_id': 1 }
        }
    ]);
};

trafficSchema.statics.getTopZonesByTraffic = function(storeId, limit = 10) {
    return this.aggregate([
        {
            $match: {
                storeId: new mongoose.Types.ObjectId(storeId),
                timestamp: {
                    $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
                }
            }
        },
        {
            $group: {
                _id: '$zoneId',
                totalVisitors: { $sum: '$visitorCount' },
                avgDwellTime: { $avg: '$avgDwellTime' },
                totalConversions: { $sum: '$conversionMetrics.conversions' }
            }
        },
        {
            $sort: { totalVisitors: -1 }
        },
        {
            $limit: limit
        }
    ]);
};

trafficSchema.statics.getTrafficTrends = function(storeId, days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return this.aggregate([
        {
            $match: {
                storeId: new mongoose.Types.ObjectId(storeId),
                timestamp: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: {
                    date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                    zoneId: '$zoneId'
                },
                totalVisitors: { $sum: '$visitorCount' },
                avgDwellTime: { $avg: '$avgDwellTime' },
                conversions: { $sum: '$conversionMetrics.conversions' }
            }
        },
        {
            $sort: { '_id.date': 1 }
        }
    ]);
};

// Pre-save middleware
trafficSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('visitorCount') || this.isModified('avgDwellTime')) {
        this.calculateIntensity();
    }
    
    // Set hourly summary
    const hour = this.timestamp.getHours();
    this.hourlySummary = {
        hour: hour,
        totalVisitors: this.visitorCount,
        avgDwellTime: this.avgDwellTime,
        peakDensity: this.peakDensity
    };
    
    next();
});

module.exports = mongoose.model('Traffic', trafficSchema); 