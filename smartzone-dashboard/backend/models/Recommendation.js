const mongoose = require('mongoose');
const { RECOMMENDATION_TYPES, STATUS } = require('../config/constants');

const recommendationSchema = new mongoose.Schema({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true,
        index: true
    },
    recommendationId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    type: {
        type: String,
        enum: Object.values(RECOMMENDATION_TYPES),
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true,
        index: true
    },
    currentPlacement: {
        zoneId: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        performance: {
            views: Number,
            interactions: Number,
            sales: Number,
            revenue: Number
        }
    },
    recommendedPlacement: {
        zoneId: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        expectedImpact: {
            projectedViews: Number,
            projectedInteractions: Number,
            projectedSales: Number,
            projectedRevenue: Number
        }
    },
    reasoning: {
        primaryFactors: [{
            factor: String,
            weight: Number,
            description: String
        }],
        aiConfidence: {
            type: Number,
            min: 0,
            max: 1,
            required: true
        },
        modelVersion: {
            type: String,
            required: true
        },
        dataPoints: [{
            source: String,
            value: Number,
            timestamp: Date
        }]
    },
    impact: {
        revenueIncrease: {
            type: Number,
            required: true
        },
        revenueIncreasePercent: {
            type: Number,
            required: true
        },
        trafficIncrease: {
            type: Number,
            required: true
        },
        conversionImpact: {
            type: Number,
            required: true
        },
        customerExperienceScore: {
            type: Number,
            min: 0,
            max: 100,
            required: true
        }
    },
    implementation: {
        effort: {
            type: String,
            enum: ['low', 'medium', 'high'],
            required: true
        },
        estimatedTime: {
            type: Number, // in minutes
            required: true
        },
        resources: [{
            type: String,
            quantity: Number,
            description: String
        }],
        cost: {
            type: Number,
            default: 0
        },
        instructions: [{
            step: Number,
            description: String,
            estimatedTime: Number
        }]
    },
    timeline: {
        expectedResults: {
            immediate: String, // 0-24 hours
            shortTerm: String, // 1-7 days
            longTerm: String // 1-4 weeks
        },
        reviewDate: {
            type: Date,
            required: true
        }
    },
    status: {
        type: String,
        enum: Object.values(STATUS),
        default: STATUS.PENDING
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        required: true
    },
    approvals: [{
        userId: String,
        userName: String,
        role: String,
        action: {
            type: String,
            enum: ['approved', 'rejected', 'needs_revision']
        },
        comments: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    implementation_log: [{
        action: String,
        userId: String,
        userName: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        details: String,
        beforeState: mongoose.Schema.Types.Mixed,
        afterState: mongoose.Schema.Types.Mixed
    }],
    results: {
        actualImplementationTime: Number,
        actualCost: Number,
        actualRevenueIncrease: Number,
        actualTrafficIncrease: Number,
        actualConversionImpact: Number,
        customerFeedback: [{
            rating: Number,
            comment: String,
            timestamp: Date
        }],
        performanceMetrics: [{
            metric: String,
            before: Number,
            after: Number,
            improvement: Number,
            measurementDate: Date
        }]
    },
    seasonality: {
        season: String,
        eventDriven: Boolean,
        urgency: String,
        expiryDate: Date
    },
    tags: [String],
    metadata: {
        createdBy: String,
        reviewedBy: String,
        implementedBy: String,
        experimentId: String,
        abTestGroup: String
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
recommendationSchema.index({ storeId: 1, status: 1 });
recommendationSchema.index({ priority: 1, createdAt: -1 });
recommendationSchema.index({ 'impact.revenueIncrease': -1 });
recommendationSchema.index({ 'reasoning.aiConfidence': -1 });
recommendationSchema.index({ type: 1, priority: 1 });

// Virtual for ROI
recommendationSchema.virtual('roi').get(function() {
    if (this.implementation.cost === 0) return Infinity;
    return (this.impact.revenueIncrease / this.implementation.cost) * 100;
});

// Virtual for urgency score
recommendationSchema.virtual('urgencyScore').get(function() {
    let score = 0;
    
    // Priority weight
    const priorityWeights = { low: 1, medium: 2, high: 3, urgent: 4 };
    score += priorityWeights[this.priority] * 25;
    
    // Revenue impact weight
    score += Math.min(this.impact.revenueIncreasePercent, 50);
    
    // AI confidence weight
    score += this.reasoning.aiConfidence * 25;
    
    // Time sensitivity (if seasonal or event-driven)
    if (this.seasonality.eventDriven) score += 10;
    if (this.seasonality.urgency === 'high') score += 15;
    
    return Math.min(score, 100);
});

// Virtual for implementation difficulty
recommendationSchema.virtual('implementationDifficulty').get(function() {
    let difficulty = 0;
    
    // Base effort
    const effortWeights = { low: 1, medium: 2, high: 3 };
    difficulty += effortWeights[this.implementation.effort] * 30;
    
    // Time factor
    difficulty += Math.min(this.implementation.estimatedTime / 60, 5) * 10; // hours to score
    
    // Resource complexity
    difficulty += this.implementation.resources.length * 5;
    
    // Cost factor
    difficulty += Math.min(this.implementation.cost / 1000, 10) * 5;
    
    return Math.min(difficulty, 100);
});

// Methods
recommendationSchema.methods.approve = function(userId, userName, role, comments) {
    this.approvals.push({
        userId,
        userName,
        role,
        action: 'approved',
        comments,
        timestamp: new Date()
    });
    
    this.status = STATUS.APPROVED;
    return this.save();
};

recommendationSchema.methods.reject = function(userId, userName, role, comments) {
    this.approvals.push({
        userId,
        userName,
        role,
        action: 'rejected',
        comments,
        timestamp: new Date()
    });
    
    this.status = STATUS.REJECTED;
    return this.save();
};

recommendationSchema.methods.implement = function(userId, userName, implementationDetails) {
    this.implementation_log.push({
        action: 'implemented',
        userId,
        userName,
        details: implementationDetails,
        timestamp: new Date()
    });
    
    this.status = STATUS.IMPLEMENTED;
    return this.save();
};

recommendationSchema.methods.recordResults = function(results) {
    Object.assign(this.results, results);
    
    // Calculate success metrics
    const revenueAccuracy = this.results.actualRevenueIncrease / this.impact.revenueIncrease;
    const trafficAccuracy = this.results.actualTrafficIncrease / this.impact.trafficIncrease;
    
    this.results.performanceMetrics.push({
        metric: 'revenue_accuracy',
        before: this.impact.revenueIncrease,
        after: this.results.actualRevenueIncrease,
        improvement: revenueAccuracy,
        measurementDate: new Date()
    });
    
    this.results.performanceMetrics.push({
        metric: 'traffic_accuracy',
        before: this.impact.trafficIncrease,
        after: this.results.actualTrafficIncrease,
        improvement: trafficAccuracy,
        measurementDate: new Date()
    });
    
    return this.save();
};

recommendationSchema.methods.updateProgress = function(userId, userName, action, details) {
    this.implementation_log.push({
        action,
        userId,
        userName,
        details,
        timestamp: new Date()
    });
    
    return this.save();
};

// Static methods
recommendationSchema.statics.findByStore = function(storeId) {
    return this.find({ storeId }).sort({ 'urgencyScore': -1, createdAt: -1 });
};

recommendationSchema.statics.findPending = function(storeId) {
    return this.find({ 
        storeId, 
        status: STATUS.PENDING 
    }).sort({ priority: -1, 'impact.revenueIncrease': -1 });
};

recommendationSchema.statics.findByPriority = function(storeId, priority) {
    return this.find({ storeId, priority }).sort({ createdAt: -1 });
};

recommendationSchema.statics.findHighImpact = function(storeId, minRevenue = 1000) {
    return this.find({
        storeId,
        'impact.revenueIncrease': { $gte: minRevenue },
        status: { $in: [STATUS.PENDING, STATUS.APPROVED] }
    }).sort({ 'impact.revenueIncrease': -1 });
};

recommendationSchema.statics.getRecommendationStats = function(storeId) {
    return this.aggregate([
        { $match: { storeId: new mongoose.Types.ObjectId(storeId) } },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalRevenue: { $sum: '$impact.revenueIncrease' },
                avgConfidence: { $avg: '$reasoning.aiConfidence' },
                avgImplementationTime: { $avg: '$implementation.estimatedTime' }
            }
        },
        {
            $group: {
                _id: null,
                stats: {
                    $push: {
                        status: '$_id',
                        count: '$count',
                         totalRevenue: '$totalRevenue',
                        avgConfidence: '$avgConfidence',
                        avgImplementationTime: '$avgImplementationTime'
                    }
                }
            }
        }
    ]);
};

module.exports = mongoose.model('Recommendation', recommendationSchema); 