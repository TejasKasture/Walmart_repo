module.exports = {
    // Zone configurations
    ZONE_TYPES: {
        ENTRANCE: 'entrance',
        ELECTRONICS: 'electronics',
        CLOTHING: 'clothing',
        GROCERIES: 'groceries',
        HEALTH_BEAUTY: 'health_beauty',
        HOME_GARDEN: 'home_garden',
        CHECKOUT: 'checkout',
        SEASONAL: 'seasonal'
    },

    ZONE_SIZES: {
        SMALL: 'small',
        MEDIUM: 'medium',
        LARGE: 'large',
        EXTRA_LARGE: 'extra_large'
    },

    // Seasons
    SEASONS: {
        SPRING: 'spring',
        SUMMER: 'summer',
        FALL: 'fall',
        WINTER: 'winter'
    },

    // Traffic intensity levels
    TRAFFIC_INTENSITY: {
        LOW: 'low',
        MEDIUM: 'medium',
        HIGH: 'high',
        VERY_HIGH: 'very_high'
    },

    // Product categories
    PRODUCT_CATEGORIES: {
        ELECTRONICS: 'electronics',
        CLOTHING: 'clothing',
        GROCERIES: 'groceries',
        HEALTH_BEAUTY: 'health_beauty',
        HOME_GARDEN: 'home_garden',
        SEASONAL: 'seasonal',
        TOYS: 'toys',
        AUTOMOTIVE: 'automotive'
    },

    // Recommendation types
    RECOMMENDATION_TYPES: {
        MOVE_PRODUCT: 'move_product',
        INCREASE_STOCK: 'increase_stock',
        DECREASE_STOCK: 'decrease_stock',
        SEASONAL_PLACEMENT: 'seasonal_placement',
        PROMOTIONAL_PLACEMENT: 'promotional_placement'
    },

    // Status types
    STATUS: {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        PENDING: 'pending',
        IMPLEMENTED: 'implemented',
        REJECTED: 'rejected'
    },

    // Store types
    STORE_TYPES: {
        SUPERCENTER: 'supercenter',
        NEIGHBORHOOD_MARKET: 'neighborhood_market',
        DISCOUNT_STORE: 'discount_store',
        SAMS_CLUB: 'sams_club'
    },

    // Time constants
    TIME_RANGES: {
        MORNING: { start: 6, end: 12 },
        AFTERNOON: { start: 12, end: 18 },
        EVENING: { start: 18, end: 22 },
        NIGHT: { start: 22, end: 6 }
    },

    // Analytics periods
    ANALYTICS_PERIODS: {
        HOUR: 'hour',
        DAY: 'day',
        WEEK: 'week',
        MONTH: 'month',
        QUARTER: 'quarter',
        YEAR: 'year'
    },

    // Default values
    DEFAULTS: {
        ZONE_CAPACITY: 50,
        DWELL_TIME_THRESHOLD: 30, // seconds
        TRAFFIC_THRESHOLD: 100, // people per hour
        CONVERSION_RATE: 0.15, // 15%
        RECOMMENDATION_CONFIDENCE_THRESHOLD: 0.8
    },

    // Error codes
    ERROR_CODES: {
        VALIDATION_ERROR: 'VALIDATION_ERROR',
        NOT_FOUND: 'NOT_FOUND',
        UNAUTHORIZED: 'UNAUTHORIZED',
        FORBIDDEN: 'FORBIDDEN',
        INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
        DATABASE_ERROR: 'DATABASE_ERROR',
        EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR'
    }
}; 