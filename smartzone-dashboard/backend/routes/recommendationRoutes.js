const express = require('express');
const router = express.Router();

// Mock data for recommendations
const mockRecommendations = [
    {
        id: 1,
        type: 'zone_optimization',
        title: 'Air Conditioners & Coolers',
        description: 'Summer peak traffic in B2, move daily visitors',
        impact: '₹2,45,000',
        projectedAnnual: '₹2,45,000',
        confidence: 87,
        effort: 'Medium',
        risk: 'Low',
        zone: 'B2',
        aiScore: 94,
        category: 'Electronics',
        timeline: '2-3 days'
    },
    {
        id: 2,
        type: 'product_placement',
        title: 'Health Supplements',
        description: 'High-margin product, adjacent zone optimization',
        impact: '₹1,85,000',
        projectedAnnual: '₹1,85,000',
        confidence: 82,
        effort: 'Low',
        risk: 'Very Low',
        zone: 'A2',
        aiScore: 89,
        category: 'Health',
        timeline: '1 day'
    },
    {
        id: 3,
        type: 'premium_positioning',
        title: 'Premium Smartphones',
        description: 'Electronics zone synergy, festive season approach',
        impact: '₹3,20,000',
        projectedAnnual: '₹3,20,000',
        confidence: 78,
        effort: 'High',
        risk: 'Medium',
        zone: 'A1',
        aiScore: 85,
        category: 'Electronics',
        timeline: '5-7 days'
    }
];

// GET /api/recommendations - Get all recommendations
router.get('/', async (req, res) => {
    try {
        const { zone, category, minConfidence, sortBy } = req.query;
        
        let recommendations = [...mockRecommendations];
        
        // Filter by zone
        if (zone) {
            recommendations = recommendations.filter(r => r.zone === zone);
        }
        
        // Filter by category
        if (category) {
            recommendations = recommendations.filter(r => r.category === category);
        }
        
        // Filter by minimum confidence
        if (minConfidence) {
            recommendations = recommendations.filter(r => r.confidence >= parseInt(minConfidence));
        }
        
        // Sort recommendations
        if (sortBy === 'confidence') {
            recommendations.sort((a, b) => b.confidence - a.confidence);
        } else if (sortBy === 'impact') {
            recommendations.sort((a, b) => {
                const aImpact = parseInt(a.impact.replace(/[₹,]/g, ''));
                const bImpact = parseInt(b.impact.replace(/[₹,]/g, ''));
                return bImpact - aImpact;
            });
        } else if (sortBy === 'aiScore') {
            recommendations.sort((a, b) => b.aiScore - a.aiScore);
        }
        
        res.json({
            success: true,
            data: recommendations,
            total: recommendations.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch recommendations',
            message: error.message
        });
    }
});

// GET /api/recommendations/:id - Get specific recommendation
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const recommendation = mockRecommendations.find(r => r.id === parseInt(id));
        
        if (!recommendation) {
            return res.status(404).json({
                success: false,
                error: 'Recommendation not found'
            });
        }
        
        res.json({
            success: true,
            data: recommendation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch recommendation',
            message: error.message
        });
    }
});

// POST /api/recommendations/implement - Implement a recommendation
router.post('/implement', async (req, res) => {
    try {
        const { recommendationId, implementationNotes } = req.body;
        
        const recommendation = mockRecommendations.find(r => r.id === parseInt(recommendationId));
        
        if (!recommendation) {
            return res.status(404).json({
                success: false,
                error: 'Recommendation not found'
            });
        }
        
        // Simulate implementation
        const implementation = {
            id: Date.now(),
            recommendationId: parseInt(recommendationId),
            status: 'implemented',
            implementedAt: new Date().toISOString(),
            notes: implementationNotes || '',
            expectedResults: {
                revenueIncrease: recommendation.impact,
                timeframe: recommendation.timeline,
                confidence: recommendation.confidence
            }
        };
        
        res.json({
            success: true,
            data: implementation,
            message: 'Recommendation implemented successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to implement recommendation',
            message: error.message
        });
    }
});

// GET /api/recommendations/analytics/summary - Get recommendation analytics
router.get('/analytics/summary', async (req, res) => {
    try {
        const totalRecommendations = mockRecommendations.length;
        const totalImpact = mockRecommendations.reduce((sum, r) => {
            return sum + parseInt(r.impact.replace(/[₹,]/g, ''));
        }, 0);
        
        const avgConfidence = mockRecommendations.reduce((sum, r) => sum + r.confidence, 0) / totalRecommendations;
        
        const categoryBreakdown = mockRecommendations.reduce((acc, r) => {
            acc[r.category] = (acc[r.category] || 0) + 1;
            return acc;
        }, {});
        
        const zoneBreakdown = mockRecommendations.reduce((acc, r) => {
            acc[r.zone] = (acc[r.zone] || 0) + 1;
            return acc;
        }, {});
        
        res.json({
            success: true,
            data: {
                totalRecommendations,
                totalImpact: `₹${totalImpact.toLocaleString()}`,
                avgConfidence: Math.round(avgConfidence * 10) / 10,
                paybackPeriod: '6 months',
                roiIncrease: '15.2%',
                categoryBreakdown,
                zoneBreakdown,
                processingTime: '15.2s',
                modelConfidence: '98.7%'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch recommendation analytics',
            message: error.message
        });
    }
});

// POST /api/recommendations/generate - Generate new recommendations
router.post('/generate', async (req, res) => {
    try {
        const { zones, timeframe, categories } = req.body;
        
        // Simulate AI processing
        setTimeout(() => {
            const newRecommendations = mockRecommendations.map(r => ({
                ...r,
                id: r.id + 1000,
                generatedAt: new Date().toISOString()
            }));
            
            res.json({
                success: true,
                data: newRecommendations,
                message: 'New recommendations generated successfully',
                processingTime: '12.4s'
            });
        }, 2000);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to generate recommendations',
            message: error.message
        });
    }
});

module.exports = router; 