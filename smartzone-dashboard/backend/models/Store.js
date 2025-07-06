const mongoose = require('mongoose');
const { STORE_TYPES, STATUS } = require('../config/constants');

const storeSchema = new mongoose.Schema({
    storeId: {
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
        enum: Object.values(STORE_TYPES),
        required: true
    },
    location: {
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        },
        coordinates: {
            latitude: {
                type: Number,
                required: true
            },
            longitude: {
                type: Number,
                required: true
            }
        },
        timezone: {
            type: String,
            required: true
        }
    },
    layout: {
        totalArea: {
            type: Number,
            required: true
        },
        salesFloorArea: {
            type: Number,
            required: true
        },
        dimensions: {
            length: Number,
            width: Number,
            height: Number
        },
        floorPlan: {
            type: String, // URL to floor plan image
            default: null
        }
    },
    operatingHours: {
        monday: { open: String, close: String },
        tuesday: { open: String, close: String },
        wednesday: { open: String, close: String },
        thursday: { open: String, close: String },
        friday: { open: String, close: String },
        saturday: { open: String, close: String },
        sunday: { open: String, close: String }
    },
    management: {
        storeManager: {
            name: String,
            email: String,
            phone: String
        },
        assistantManagers: [{
            name: String,
            email: String,
            phone: String,
            department: String
        }]
    },
    demographics: {
        primaryCustomerAge: {
            type: String,
            enum: ['18-25', '26-35', '36-45', '46-55', '56-65', '65+']
        },
        avgHouseholdIncome: Number,
        populationDensity: String,
        competitionLevel: {
            type: String,
            enum: ['low', 'medium', 'high']
        }
    },
    performance: {
        dailyFootTraffic: {
            type: Number,
            default: 0
        },
        avgTransactionValue: {
            type: Number,
            default: 0
        },
        conversionRate: {
            type: Number,
            default: 0.15
        },
        revenuePerSqFt: {
            type: Number,
            default: 0
        },
        customerSatisfaction: {
            type: Number,
            min: 1,
            max: 5,
            default: 3
        }
    },
    analytics: {
        totalZones: {
            type: Number,
            default: 0
        },
        activeZones: {
            type: Number,
            default: 0
        },
        totalProducts: {
            type: Number,
            default: 0
        },
        optimizationScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 50
        },
        lastOptimized: Date,
        aiRecommendations: {
            implemented: {
                type: Number,
                default: 0
            },
            pending: {
                type: Number,
                default: 0
            },
            rejected: {
                type: Number,
                default: 0
            }
        }
    },
    technology: {
        cameras: [{
            cameraId: String,
            location: {
                x: Number,
                y: Number,
                z: Number
            },
            coverageZones: [String],
            status: {
                type: String,
                enum: ['active', 'inactive', 'maintenance'],
                default: 'active'
            }
        }],
        sensors: [{
            sensorId: String,
            type: String, // temperature, humidity, motion, etc.
            location: {
                x: Number,
                y: Number,
                z: Number
            },
            status: {
                type: String,
                enum: ['active', 'inactive', 'maintenance'],
                default: 'active'
            }
        }],
        networkStatus: {
            type: String,
            enum: ['excellent', 'good', 'fair', 'poor'],
            default: 'good'
        }
    },
    compliance: {
        lastInspection: Date,
        inspectionScore: Number,
        certifications: [{
            type: String,
            issueDate: Date,
            expiryDate: Date
        }],
        accessibilityCompliant: {
            type: Boolean,
            default: true
        }
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
storeSchema.index({ location: '2dsphere' });
storeSchema.index({ type: 1, status: 1 });
storeSchema.index({ 'performance.dailyFootTraffic': -1 });

// Virtual for store efficiency
storeSchema.virtual('efficiency').get(function() {
    if (this.layout.salesFloorArea === 0) return 0;
    return this.performance.revenuePerSqFt;
});

// Virtual for technology health
storeSchema.virtual('technologyHealth').get(function() {
    const totalDevices = this.technology.cameras.length + this.technology.sensors.length;
    if (totalDevices === 0) return 100;
    
    const activeDevices = this.technology.cameras.filter(c => c.status === 'active').length +
                         this.technology.sensors.filter(s => s.status === 'active').length;
    
    return (activeDevices / totalDevices) * 100;
});

// Virtual for current status
storeSchema.virtual('isOpen').get(function() {
    const now = new Date();
    const currentDay = now.toLocaleLowerCase().slice(0, 3) + 'nesday'; // e.g., 'monday'
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    
    const todayHours = this.operatingHours[currentDay];
    if (!todayHours) return false;
    
    return currentTime >= todayHours.open && currentTime <= todayHours.close;
});

// Methods
storeSchema.methods.updatePerformance = function(footTraffic, transactionValue, conversionRate) {
    this.performance.dailyFootTraffic = footTraffic;
    this.performance.avgTransactionValue = transactionValue;
    this.performance.conversionRate = conversionRate;
    
    // Calculate revenue per sq ft
    const dailyRevenue = footTraffic * transactionValue * conversionRate;
    this.performance.revenuePerSqFt = dailyRevenue / this.layout.salesFloorArea;
    
    return this.save();
};

storeSchema.methods.addCamera = function(cameraId, location, coverageZones) {
    this.technology.cameras.push({
        cameraId,
        location,
        coverageZones,
        status: 'active'
    });
    return this.save();
};

storeSchema.methods.updateOptimizationScore = function(score) {
    this.analytics.optimizationScore = Math.max(0, Math.min(100, score));
    this.analytics.lastOptimized = new Date();
    return this.save();
};

storeSchema.methods.addRecommendation = function(status = 'pending') {
    this.analytics.aiRecommendations[status] += 1;
    return this.save();
};

storeSchema.methods.updateRecommendationStatus = function(fromStatus, toStatus) {
    if (this.analytics.aiRecommendations[fromStatus] > 0) {
        this.analytics.aiRecommendations[fromStatus] -= 1;
        this.analytics.aiRecommendations[toStatus] += 1;
    }
    return this.save();
};

// Static methods
storeSchema.statics.findByType = function(type) {
    return this.find({ type, status: STATUS.ACTIVE });
};

storeSchema.statics.findNearby = function(latitude, longitude, maxDistance = 50) {
    return this.find({
        'location.coordinates': {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                $maxDistance: maxDistance * 1000 // Convert km to meters
            }
        },
        status: STATUS.ACTIVE
    });
};

storeSchema.statics.getTopPerformers = function(limit = 10) {
    return this.find({ status: STATUS.ACTIVE })
        .sort({ 'performance.revenuePerSqFt': -1 })
        .limit(limit);
};

storeSchema.statics.getStoreAnalytics = function(storeId) {
    return this.aggregate([
        { $match: { storeId: storeId } },
        {
            $lookup: {
                from: 'zones',
                localField: '_id',
                foreignField: 'storeId',
                as: 'zones'
            }
        },
        {
            $lookup: {
                from: 'traffic',
                localField: '_id',
                foreignField: 'storeId',
                as: 'trafficData'
            }
        },
        {
            $project: {
                name: 1,
                type: 1,
                performance: 1,
                analytics: 1,
                totalZones: { $size: '$zones' },
                activeZones: {
                    $size: {
                        $filter: {
                            input: '$zones',
                            cond: { $eq: ['$$this.status', 'active'] }
                        }
                    }
                },
                todayTraffic: {
                    $size: {
                        $filter: {
                            input: '$trafficData',
                            cond: {
                                $gte: ['$$this.timestamp', new Date(new Date().setHours(0, 0, 0, 0))]
                            }
                        }
                    }
                },
                technologyHealth: {
                    $cond: {
                        if: { $eq: [{ $add: [{ $size: '$technology.cameras' }, { $size: '$technology.sensors' }] }, 0] },
                        then: 100,
                        else: {
                            $multiply: [
                                {
                                    $divide: [
                                        {
                                            $add: [
                                                { $size: { $filter: { input: '$technology.cameras', cond: { $eq: ['$$this.status', 'active'] } } } },
                                                { $size: { $filter: { input: '$technology.sensors', cond: { $eq: ['$$this.status', 'active'] } } } }
                                            ]
                                        },
                                        { $add: [{ $size: '$technology.cameras' }, { $size: '$technology.sensors' }] }
                                    ]
                                },
                                100
                            ]
                        }
                    }
                }
            }
        }
    ]);
};

// Pre-save middleware
storeSchema.pre('save', function(next) {
    // Update zone counts
    if (this.isModified('analytics.totalZones') || this.isModified('analytics.activeZones')) {
        // These will be updated by zone operations
    }
    
    next();
});

module.exports = mongoose.model('Store', storeSchema); 