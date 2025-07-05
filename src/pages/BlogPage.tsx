import React, { useState } from 'react';
import { Search, Calendar, User, ArrowRight, Tag, Clock, TrendingUp, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

const BlogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Posts', count: 24 },
    { id: 'tips', name: 'Tips & Tricks', count: 8 },
    { id: 'news', name: 'Industry News', count: 6 },
    { id: 'guides', name: 'How-to Guides', count: 5 },
    { id: 'reviews', name: 'Device Reviews', count: 5 }
  ];

  // Optional Add-ons for blog content
  const addOns = [
    {
      name: 'Accessories Coverage',
      price: '$1.99',
      description: 'Covers chargers, cases, screen protectors, and other accessories',
      popular: true
    },
    {
      name: 'Extended Warranty',
      price: '$2.99',
      description: 'Additional 12 months warranty coverage beyond manufacturer',
      popular: false
    },
    {
      name: 'Data Recovery',
      price: '$3.99',
      description: 'Professional data recovery service for damaged devices',
      popular: false
    }
  ];

  const blogPosts = [
    {
      id: 1,
      title: '10 Essential Tips to Protect Your Phone from Damage',
      excerpt: 'Learn the best practices to keep your mobile device safe from common accidents and extend its lifespan with these proven protection strategies.',
      author: 'Sarah Johnson',
      date: '2024-01-20',
      category: 'tips',
      image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800',
      readTime: '5 min read',
      views: '2.1k',
      featured: true,
      tags: ['Protection', 'Tips', 'Mobile Safety']
    },
    {
      id: 2,
      title: 'Understanding Your Phone Insurance Coverage in 2024',
      excerpt: 'A comprehensive guide to what your phone insurance covers and how to make the most of your policy in the current market.',
      author: 'Mike Chen',
      date: '2024-01-18',
      category: 'guides',
      image: 'https://images.pexels.com/photos/1482476/pexels-photo-1482476.jpeg?auto=compress&cs=tinysrgb&w=800',
      readTime: '8 min read',
      views: '1.8k',
      featured: false,
      tags: ['Insurance', 'Coverage', 'Guide']
    },
    {
      id: 3,
      title: 'iPhone 15 vs Samsung Galaxy S24: Which Needs More Protection?',
      excerpt: 'Comparing the durability and common issues of the latest flagship phones to help you choose the right coverage level.',
      author: 'Emily Davis',
      date: '2024-01-15',
      category: 'reviews',
      image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800',
      readTime: '6 min read',
      views: '3.2k',
      featured: false,
      tags: ['iPhone', 'Samsung', 'Comparison']
    },
    {
      id: 4,
      title: 'The Rise of Foldable Phones: New Challenges for Insurance',
      excerpt: 'Exploring how foldable devices are changing the mobile insurance landscape and what it means for consumers.',
      author: 'David Wilson',
      date: '2024-01-12',
      category: 'news',
      image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800',
      readTime: '7 min read',
      views: '1.5k',
      featured: false,
      tags: ['Foldable', 'Technology', 'Innovation']
    },
    {
      id: 5,
      title: 'How to File a Phone Insurance Claim: Step-by-Step Guide',
      excerpt: 'Everything you need to know about filing a claim, from documentation to getting your device repaired or replaced.',
      author: 'Lisa Anderson',
      date: '2024-01-10',
      category: 'guides',
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
      readTime: '10 min read',
      views: '2.7k',
      featured: false,
      tags: ['Claims', 'Process', 'Help']
    },
    {
      id: 6,
      title: 'Water Damage Prevention: Myths vs Reality',
      excerpt: 'Debunking common myths about water damage and sharing proven methods to protect your device from moisture.',
      author: 'Tom Rodriguez',
      date: '2024-01-08',
      category: 'tips',
      image: 'https://images.pexels.com/photos/1482476/pexels-photo-1482476.jpeg?auto=compress&cs=tinysrgb&w=800',
      readTime: '4 min read',
      views: '1.9k',
      featured: false,
      tags: ['Water Damage', 'Prevention', 'Myths']
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = filteredPosts.find(post => post.featured) || filteredPosts[0];
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const trendingTopics = [
    { name: 'Phone Protection', count: 15 },
    { name: 'Insurance Claims', count: 12 },
    { name: 'Device Reviews', count: 8 },
    { name: 'Water Damage', count: 6 },
    { name: 'Screen Repair', count: 5 }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="inline-flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <TrendingUp className="h-4 w-4 text-yellow-400 mr-2" />
                <span className="text-sm font-medium">Latest insights & tips</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                CoverCell <span className="text-yellow-400">Blog</span>
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Stay informed with the latest tips, guides, and industry insights 
                to protect your mobile devices and make the most of your coverage.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Search and Filter */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Featured Post */}
              {featuredPost && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12"
                >
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
                    <div className="md:flex">
                      <div className="md:w-1/2">
                        <img
                          src={featuredPost.image}
                          alt={featuredPost.title}
                          className="w-full h-64 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-1/2 p-8">
                        <div className="flex items-center mb-4">
                          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Featured
                          </span>
                          <span className="ml-3 text-gray-500 text-sm capitalize">
                            {categories.find(c => c.id === featuredPost.category)?.name}
                          </span>
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                          {featuredPost.title}
                        </h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          {featuredPost.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center text-gray-500 text-sm">
                              <User className="h-4 w-4 mr-1" />
                              {featuredPost.author}
                            </div>
                            <div className="flex items-center text-gray-500 text-sm">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(featuredPost.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-gray-500 text-sm">
                              <Eye className="h-4 w-4 mr-1" />
                              {featuredPost.views} views
                            </div>
                          </div>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center">
                            Read More
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Blog Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {regularPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white bg-opacity-90 text-gray-700 px-2 py-1 rounded text-xs font-medium capitalize">
                          <Tag className="inline h-3 w-3 mr-1" />
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 2).map((tag, tagIndex) => (
                          <span key={tagIndex} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center text-gray-500 text-sm">
                            <User className="h-4 w-4 mr-1" />
                            {post.author}
                          </div>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            {post.readTime}
                          </div>
                        </div>
                        
                        <button className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center">
                          Read
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* No Results */}
              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search terms or browse different categories.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Trending Topics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Trending Topics
                </h3>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                      <span className="text-gray-700">{topic.name}</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                        {topic.count}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Optional Add-ons Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Optional Add-ons</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Enhance your protection with these additional services
                </p>
                <div className="space-y-3">
                  {addOns.map((addon, index) => (
                    <div key={index} className={`p-3 rounded-lg border transition-all ${
                      addon.popular 
                        ? 'border-purple-300 bg-purple-50' 
                        : 'border-gray-200 bg-white'
                    }`}>
                      {addon.popular && (
                        <span className="inline-block bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold mb-2">
                          Popular
                        </span>
                      )}
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm">{addon.name}</h4>
                        <span className="text-purple-600 font-bold text-sm">{addon.price}/mo</span>
                      </div>
                      <p className="text-gray-600 text-xs">{addon.description}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors">
                  Learn More
                </button>
              </motion.div>

              {/* Newsletter Signup */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white"
              >
                <h3 className="text-lg font-bold mb-3">Stay Updated</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Get the latest tips and insights delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-2 px-4 rounded-lg font-semibold transition-colors">
                    Subscribe
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPage;