const mongoose = require('mongoose');
const { ZONE_TYPES, ZONE_SIZES, STATUS } = require('../config/constants');

const zoneSchema = new mongoose.Schema({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true,
        index: true
    },
    zoneId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: Object.values(ZONE_TYPES),
        required: true
    },
    size: {
        type: String,
        enum: Object.values(ZONE_SIZES),
        required: true
    },
    coordinates: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true }
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    currentProducts: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            default: 0
        },
        placement: {
            priority: {
                type: Number,
                min: 1,
                max: 10
            },
            position: {
                shelf: Number,
                row: Number,
                column: Number
            }
        }
    }],
    trafficMetrics: {
        avgDailyVisitors: {
            type: Number,
            default: 0
        },
        avgDwellTime: {
            type: Number,
            default: 0
        },
        peakHours: [{
            hour: Number,
            intensity: Number
        }],
        conversionRate: {
            type: Number,
            default: 0.15
        }
    },
    seasonalAffinity: {
        spring: { type: Number, default: 1.0 },
        summer: { type: Number, default: 1.0 },
        fall: { type: Number, default: 1.0 },
        winter: { type: Number, default: 1.0 }
    },
    adjacentZones: [{
        type: String,
        ref: 'Zone'
    }],
    accessibility: {
        wheelchairAccessible: {
            type: Boolean,
            default: true
        },
        emergencyExit: {
            type: Boolean,
            default: false
        },
        mainPathway: {
            type: Boolean,
            default: false
        }
    },
    status: {
        type: String,
        enum: Object.values(STATUS),
        default: STATUS.ACTIVE
    },
    lastOptimized: {
        type: Date,
        default: Date.now
    },
    metadata: {
        temperature: Number,
        lighting: String,
        noiseLevel: String,
        footTraffic: String
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
zoneSchema.index({ storeId: 1, zoneId: 1 });
zoneSchema.index({ type: 1, status: 1 });
zoneSchema.index({ 'trafficMetrics.avgDailyVisitors': -1 });

// Virtual for current utilization
zoneSchema.virtual('currentUtilization').get(function() {
    const totalProducts = this.currentProducts.reduce((sum, p) => sum + p.quantity, 0);
    return Math.min((totalProducts / this.capacity) * 100, 100);
});

// Virtual for traffic intensity
zoneSchema.virtual('trafficIntensity').get(function() {
    const visitors = this.trafficMetrics.avgDailyVisitors;
    if (visitors < 50) return 'low';
    if (visitors < 150) return 'medium';
    if (visitors < 300) return 'high';
    return 'very_high';
});

// Methods
zoneSchema.methods.updateTrafficMetrics = function(visitors, dwellTime) {
    this.trafficMetrics.avgDailyVisitors = visitors;
    this.trafficMetrics.avgDwellTime = dwellTime;
    return this.save();
};

zoneSchema.methods.addProduct = function(productId, quantity, placement) {
    const existingProduct = this.currentProducts.find(p => 
        p.productId.toString() === productId.toString()
    );
    
    if (existingProduct) {
        existingProduct.quantity += quantity;
        if (placement) existingProduct.placement = placement;
    } else {
        this.currentProducts.push({
            productId,
            quantity,
            placement
        });
    }
    
    return this.save();
};

zoneSchema.methods.removeProduct = function(productId) {
    this.currentProducts = this.currentProducts.filter(p => 
        p.productId.toString() !== productId.toString()
    );
    return this.save();
};

// Static methods
zoneSchema.statics.findByStore = function(storeId) {
    return this.find({ storeId, status: STATUS.ACTIVE });
};

zoneSchema.statics.findHighTrafficZones = function(storeId, threshold = 200) {
    return this.find({
        storeId,
        'trafficMetrics.avgDailyVisitors': { $gte: threshold },
        status: STATUS.ACTIVE
    });
};

zoneSchema.statics.findByType = function(storeId, type) {
    return this.find({ storeId, type, status: STATUS.ACTIVE });
};

// Pre-save middleware
zoneSchema.pre('save', function(next) {
    if (this.isNew) {
        this.lastOptimized = new Date();
    }
    next();
});

module.exports = mongoose.model('Zone', zoneSchema); 