const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Mock product data
const products = [
  { id: 1, name: 'Samsung 55" 4K TV', category: 'Electronics', price: 599.99, zone: 'A1', sales: 45, revenue: 26999.55, trend: 'up' },
  { id: 2, name: 'iPhone 15 Pro', category: 'Electronics', price: 999.99, zone: 'A1', sales: 23, revenue: 22999.77, trend: 'up' },
  { id: 3, name: 'Nike Air Max', category: 'Clothing', price: 129.99, zone: 'B2', sales: 67, revenue: 8709.33, trend: 'stable' },
  { id: 4, name: 'Levi\'s Jeans', category: 'Clothing', price: 79.99, zone: 'B2', sales: 89, revenue: 7119.11, trend: 'up' },
  { id: 5, name: 'Organic Bananas', category: 'Groceries', price: 2.99, zone: 'C1', sales: 234, revenue: 699.66, trend: 'stable' },
  { id: 6, name: 'Whole Milk', category: 'Groceries', price: 3.49, zone: 'C1', sales: 156, revenue: 544.44, trend: 'down' },
  { id: 7, name: 'Garden Hose', category: 'Home & Garden', price: 24.99, zone: 'D2', sales: 34, revenue: 849.66, trend: 'stable' },
  { id: 8, name: 'Shampoo', category: 'Health & Beauty', price: 8.99, zone: 'E1', sales: 78, revenue: 701.22, trend: 'up' }
];

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, zone, sortBy = 'sales', order = 'desc', limit = 50 } = req.query;
    
    let filteredProducts = [...products];
    
    // Apply filters
    if (category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (zone) {
      filteredProducts = filteredProducts.filter(product => 
        product.zone.toLowerCase() === zone.toLowerCase()
      );
    }
    
    // Apply sorting
    filteredProducts.sort((a, b) => {
      if (order === 'asc') {
        return a[sortBy] - b[sortBy];
      } else {
        return b[sortBy] - a[sortBy];
      }
    });
    
    // Apply limit
    filteredProducts = filteredProducts.slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      count: filteredProducts.length,
      data: filteredProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Add additional product details
    const productDetails = {
      ...product,
      description: `High-quality ${product.name} available in ${product.zone}`,
      stock: Math.round(Math.random() * 100 + 50),
      lastRestocked: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      salesHistory: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        sales: Math.round(Math.random() * 20 + 5),
        revenue: Math.round((Math.random() * 20 + 5) * product.price * 100) / 100
      })).reverse(),
      relatedProducts: products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3),
      customerReviews: {
        average: Math.round((Math.random() * 2 + 3) * 10) / 10,
        count: Math.round(Math.random() * 100 + 20),
        distribution: {
          5: Math.round(Math.random() * 50 + 30),
          4: Math.round(Math.random() * 30 + 20),
          3: Math.round(Math.random() * 15 + 10),
          2: Math.round(Math.random() * 10 + 5),
          1: Math.round(Math.random() * 5 + 2)
        }
      }
    };

    res.status(200).json({
      success: true,
      data: productDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get product analytics
// @route   GET /api/products/:id/analytics
// @access  Public
router.get('/:id/analytics', async (req, res) => {
  try {
    const product = products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const analytics = {
      productId: product.id,
      productName: product.name,
      totalSales: product.sales,
      totalRevenue: product.revenue,
      avgSalesPerDay: Math.round((product.sales / 30) * 10) / 10,
      conversionRate: Math.round((Math.random() * 15 + 10) * 10) / 10,
      viewToSaleRatio: Math.round((Math.random() * 20 + 5) * 10) / 10,
      profitMargin: Math.round((Math.random() * 30 + 20) * 10) / 10,
      customerSegments: [
        { segment: 'Young Adults', percentage: 35 },
        { segment: 'Families', percentage: 28 },
        { segment: 'Seniors', percentage: 22 },
        { segment: 'Professionals', percentage: 15 }
      ],
      seasonalTrends: [
        { month: 'Jan', sales: Math.round(Math.random() * 50 + 20) },
        { month: 'Feb', sales: Math.round(Math.random() * 50 + 20) },
        { month: 'Mar', sales: Math.round(Math.random() * 50 + 20) },
        { month: 'Apr', sales: Math.round(Math.random() * 50 + 20) },
        { month: 'May', sales: Math.round(Math.random() * 50 + 20) },
        { month: 'Jun', sales: Math.round(Math.random() * 50 + 20) }
      ],
      priceOptimization: {
        currentPrice: product.price,
        recommendedPrice: Math.round((product.price * (1 + (Math.random() * 0.2 - 0.1))) * 100) / 100,
        priceElasticity: Math.round((Math.random() * 2 + 1) * 100) / 100,
        competitorPrices: [
          product.price * 0.95,
          product.price * 1.05,
          product.price * 1.10
        ].map(p => Math.round(p * 100) / 100)
      }
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

// @desc    Get top performing products
// @route   GET /api/products/top
// @access  Public
router.get('/top', async (req, res) => {
  try {
    const { metric = 'sales', limit = 10 } = req.query;
    
    const topProducts = [...products]
      .sort((a, b) => b[metric] - a[metric])
      .slice(0, parseInt(limit))
      .map(product => ({
        ...product,
        rank: products.indexOf(product) + 1,
        percentageOfTotal: Math.round((product[metric] / products.reduce((sum, p) => sum + p[metric], 0)) * 100 * 10) / 10
      }));

    res.status(200).json({
      success: true,
      metric,
      count: topProducts.length,
      data: topProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const categoryProducts = products.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
    
    if (categoryProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No products found in this category'
      });
    }

    const categoryAnalytics = {
      category,
      totalProducts: categoryProducts.length,
      totalSales: categoryProducts.reduce((sum, p) => sum + p.sales, 0),
      totalRevenue: categoryProducts.reduce((sum, p) => sum + p.revenue, 0),
      avgPrice: Math.round((categoryProducts.reduce((sum, p) => sum + p.price, 0) / categoryProducts.length) * 100) / 100,
      topProduct: categoryProducts.reduce((top, p) => p.sales > top.sales ? p : top),
      products: categoryProducts
    };

    res.status(200).json({
      success: true,
      data: categoryAnalytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Create new product
// @route   POST /api/products
// @access  Protected
router.post('/', protect, async (req, res) => {
  try {
    const { name, category, price, zone } = req.body;
    
    if (!name || !category || !price || !zone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const newProduct = {
      id: products.length + 1,
      name,
      category,
      price: parseFloat(price),
      zone,
      sales: 0,
      revenue: 0,
      trend: 'new'
    };

    products.push(newProduct);

    res.status(201).json({
      success: true,
      data: newProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Protected
router.put('/:id', protect, async (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const updatedProduct = { ...products[productIndex], ...req.body };
    products[productIndex] = updatedProduct;

    res.status(200).json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Protected
router.delete('/:id', protect, async (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    products.splice(productIndex, 1);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router; 