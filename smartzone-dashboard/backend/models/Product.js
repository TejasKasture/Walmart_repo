const mongoose = require('mongoose');
const { PRODUCT_CATEGORIES, SEASONS, STATUS } = require('../config/constants');

const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        index: true
    },
    category: {
        type: String,
        enum: Object.values(PRODUCT_CATEGORIES),
        required: true,
        index: true
    },
    subcategory: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    pricing: {
        cost: {
            type: Number,
            required: true,
            min: 0
        },
        sellingPrice: {
            type: Number,
            required: true,
            min: 0
        },
        marginPercent: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        discount: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    },
    dimensions: {
        length: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        weight: { type: Number, required: true }
    },
    inventory: {
        totalStock: {
            type: Number,
            required: true,
            min: 0
        },
        reorderPoint: {
            type: Number,
            required: true,
            min: 0
        },
        maxStock: {
            type: Number,
            required: true,
            min: 0
        }
    },
    seasonality: {
        peakSeason: {
            type: String,
            enum: Object.values(SEASONS),
            required: true
        },
        seasonalMultiplier: {
            spring: { type: Number, default: 1.0 },
            summer: { type: Number, default: 1.0 },
            fall: { type: Number, default: 1.0 },
            winter: { type: Number, default: 1.0 }
        }
    },
    performance: {
        salesVelocity: {
            type: Number,
            default: 0
        },
        conversionRate: {
            type: Number,
            default: 0.15
        },
        returnRate: {
            type: Number,
            default: 0.05
        },
        customerRating: {
            type: Number,
            min: 1,
            max: 5,
            default: 3
        }
    },
    placement: {
        currentZones: [{
            zoneId: String,
            quantity: Number,
            performance: {
                views: { type: Number, default: 0 },
                interactions: { type: Number, default: 0 },
                sales: { type: Number, default: 0 }
            }
        }],
        optimalZones: [{
            zoneId: String,
            score: Number,
            reason: String
        }],
        restrictions: [{
            type: String, // temperature, humidity, security, etc.
            value: String
        }]
    },
    attributes: {
        perishable: {
            type: Boolean,
            default: false
        },
        fragile: {
            type: Boolean,
            default: false
        },
        highValue: {
            type: Boolean,
            default: false
        },
        bulky: {
            type: Boolean,
            default: false
        },
        seasonal: {
            type: Boolean,
            default: false
        }
    },
    marketing: {
        promotions: [{
            type: String,
            startDate: Date,
            endDate: Date,
            discount: Number,
            zones: [String]
        }],
        crossSell: [{
            productId: String,
            strength: Number // 0-1 correlation strength
        }],
        trending: {
            type: Boolean,
            default: false
        }
    },
    compliance: {
        ageRestricted: {
            type: Boolean,
            default: false
        },
        prescriptionRequired: {
            type: Boolean,
            default: false
        },
        hazardous: {
            type: Boolean,
            default: false
        }
    },
    analytics: {
        totalViews: {
            type: Number,
            default: 0
        },
        totalInteractions: {
            type: Number,
            default: 0
        },
        totalSales: {
            type: Number,
            default: 0
        },
        revenue: {
            type: Number,
            default: 0
        },
        lastSold: Date,
        bestPerformingZone: String
    },
    status: {
        type: String,
        enum: Object.values(STATUS),
        default: STATUS.ACTIVE
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
productSchema.index({ category: 1, status: 1 });
productSchema.index({ 'seasonality.peakSeason': 1 });
productSchema.index({ 'pricing.marginPercent': -1 });
productSchema.index({ 'performance.salesVelocity': -1 });
productSchema.index({ 'analytics.totalSales': -1 });

// Virtual for profit margin
productSchema.virtual('profitMargin').get(function() {
    return this.pricing.sellingPrice - this.pricing.cost;
});

// Virtual for current season multiplier
productSchema.virtual('currentSeasonMultiplier').get(function() {
    const currentMonth = new Date().getMonth();
    let season = 'spring';
    
    if (currentMonth >= 2 && currentMonth <= 4) season = 'spring';
    else if (currentMonth >= 5 && currentMonth <= 7) season = 'summer';
    else if (currentMonth >= 8 && currentMonth <= 10) season = 'fall';
    else season = 'winter';
    
    return this.seasonality.seasonalMultiplier[season];
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
    const stock = this.inventory.totalStock;
    const reorderPoint = this.inventory.reorderPoint;
    
    if (stock === 0) return 'out_of_stock';
    if (stock <= reorderPoint) return 'low_stock';
    if (stock >= this.inventory.maxStock * 0.8) return 'high_stock';
    return 'normal';
});

// Methods
productSchema.methods.updatePerformance = function(views, interactions, sales) {
    this.analytics.totalViews += views;
    this.analytics.totalInteractions += interactions;
    this.analytics.totalSales += sales;
    this.analytics.revenue += sales * this.pricing.sellingPrice;
    
    // Update conversion rate
    if (this.analytics.totalViews > 0) {
        this.performance.conversionRate = this.analytics.totalSales / this.analytics.totalViews;
    }
    
    // Update sales velocity (sales per day)
    const daysSinceCreated = (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24);
    this.performance.salesVelocity = this.analytics.totalSales / Math.max(daysSinceCreated, 1);
    
    if (sales > 0) {
        this.analytics.lastSold = new Date();
    }
    
    return this.save();
};

productSchema.methods.addToZone = function(zoneId, quantity) {
    const existingZone = this.placement.currentZones.find(z => z.zoneId === zoneId);
    
    if (existingZone) {
        existingZone.quantity += quantity;
    } else {
        this.placement.currentZones.push({
            zoneId,
            quantity,
            performance: {
                views: 0,
                interactions: 0,
                sales: 0
            }
        });
    }
    
    return this.save();
};

productSchema.methods.removeFromZone = function(zoneId) {
    this.placement.currentZones = this.placement.currentZones.filter(z => z.zoneId !== zoneId);
    return this.save();
};

productSchema.methods.updateZonePerformance = function(zoneId, views, interactions, sales) {
    const zone = this.placement.currentZones.find(z => z.zoneId === zoneId);
    
    if (zone) {
        zone.performance.views += views;
        zone.performance.interactions += interactions;
        zone.performance.sales += sales;
        
        // Update best performing zone
        const bestZone = this.placement.currentZones.reduce((best, current) => 
            current.performance.sales > best.performance.sales ? current : best
        );
        this.analytics.bestPerformingZone = bestZone.zoneId;
    }
    
    return this.save();
};

// Static methods
productSchema.statics.findByCategory = function(category) {
    return this.find({ category, status: STATUS.ACTIVE });
};

productSchema.statics.findHighMarginProducts = function(minMargin = 30) {
    return this.find({
        'pricing.marginPercent': { $gte: minMargin },
        status: STATUS.ACTIVE
    }).sort({ 'pricing.marginPercent': -1 });
};

productSchema.statics.findSeasonalProducts = function(season) {
    return this.find({
        'seasonality.peakSeason': season,
        status: STATUS.ACTIVE
    });
};

productSchema.statics.findTopPerformers = function(limit = 10) {
    return this.find({ status: STATUS.ACTIVE })
        .sort({ 'performance.salesVelocity': -1 })
        .limit(limit);
};

productSchema.statics.findLowStock = function() {
    return this.find({
        $expr: { $lte: ['$inventory.totalStock', '$inventory.reorderPoint'] },
        status: STATUS.ACTIVE
    });
};

productSchema.statics.getProductAnalytics = function(productId) {
    return this.aggregate([
        { $match: { productId: productId } },
        {
            $project: {
                name: 1,
                category: 1,
                totalRevenue: '$analytics.revenue',
                totalSales: '$analytics.totalSales',
                conversionRate: '$performance.conversionRate',
                salesVelocity: '$performance.salesVelocity',
                profitMargin: { $subtract: ['$pricing.sellingPrice', '$pricing.cost'] },
                stockStatus: {
                    $cond: {
                        if: { $eq: ['$inventory.totalStock', 0] },
                        then: 'out_of_stock',
                        else: {
                            $cond: {
                                if: { $lte: ['$inventory.totalStock', '$inventory.reorderPoint'] },
                                then: 'low_stock',
                                else: 'normal'
                            }
                        }
                    }
                }
            }
        }
    ]);
};

// Pre-save middleware
productSchema.pre('save', function(next) {
    // Calculate margin percentage if not set
    if (!this.pricing.marginPercent && this.pricing.cost && this.pricing.sellingPrice) {
        this.pricing.marginPercent = ((this.pricing.sellingPrice - this.pricing.cost) / this.pricing.sellingPrice) * 100;
    }
    
    // Set seasonal flag based on multipliers
    const multipliers = Object.values(this.seasonality.seasonalMultiplier);
    this.attributes.seasonal = Math.max(...multipliers) > 1.2 || Math.min(...multipliers) < 0.8;
    
    next();
});

module.exports = mongoose.model('Product', productSchema); 