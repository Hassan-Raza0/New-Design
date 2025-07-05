import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Smartphone, Clock, Star, CheckCircle, ArrowRight, Play, Award, Users, DollarSign, Zap, Camera, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { planTypes } from '../utils/phoneDetection';

const HomePage: React.FC = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Choose Your Device', description: 'Select your phone model and plan', icon: Smartphone },
    { title: 'Get Instant Quote', description: 'See pricing instantly', icon: Zap },
    { title: 'Activate Protection', description: 'Coverage starts immediately', icon: Shield }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const plans = [
    {
      name: 'Basic Plan',
      price: '$5 - $12',
      originalPrice: '$8 - $18',
      features: ['Screen repair coverage', 'Basic device protection', '24/7 support', '2 claims per year'],
      popular: false,
      savings: 'Device-based pricing',
      description: 'Essential protection based on your device model'
    },
    {
      name: 'Premium Plan',
      price: '$19.99',
      originalPrice: '$29.99',
      features: ['Everything in Basic', 'Theft coverage', 'Water damage protection', 'Unlimited claims', 'Express replacement'],
      popular: true,
      savings: 'Save $10/month',
      description: 'Complete protection with premium features'
    },
    {
      name: 'Family Plan',
      price: '$34.99',
      originalPrice: '$49.99',
      features: ['Up to 5 devices', 'All Premium features', 'Family dashboard', 'Device tracking', 'Group discounts'],
      popular: false,
      savings: 'Save $15/month',
      description: 'Protect your entire family\'s devices'
    }
  ];

  // Optional Add-ons
  const addOns = [
    {
      name: 'Accessories Coverage',
      price: '$1.99',
      description: 'Covers chargers, cases, screen protectors, and other accessories',
      icon: Shield,
      popular: true
    },
    {
      name: 'Extended Warranty',
      price: '$2.99',
      description: 'Additional 12 months warranty coverage beyond manufacturer',
      icon: Clock,
      popular: false
    },
    {
      name: 'Data Recovery',
      price: '$3.99',
      description: 'Professional data recovery service for damaged devices',
      icon: Smartphone,
      popular: false
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      text: 'Filed a claim at 2 PM, had my phone fixed by 6 PM the same day. Incredible service!',
      location: 'New York, NY',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      name: 'Mike Chen',
      rating: 5,
      text: 'My phone was stolen on vacation. CoverCell sent a replacement overnight. Lifesaver!',
      location: 'Los Angeles, CA',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      name: 'Emily Davis',
      rating: 5,
      text: 'The instant quote system was amazing. Got my price in seconds, not days.',
      location: 'Chicago, IL',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  ];

  const stats = [
    { icon: Users, value: '500K+', label: 'Protected Customers' },
    { icon: Clock, value: '< 4hrs', label: 'Average Claim Time' },
    { icon: Award, value: '4.9/5', label: 'Customer Rating' },
    { icon: MapPin, value: '2,500+', label: 'Repair Centers' }
  ];

  // Define Icon component based on current step
  const Icon = steps[currentStep].icon;

  return (
    <Layout>
      {/* Hero Section - Akko Style */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white overflow-hidden min-h-screen flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              {/* Trust Badge */}
              <div className="inline-flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Star className="h-4 w-4 text-yellow-400 mr-2" />
                <span className="text-sm font-medium">Trusted by 500K+ customers</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                Phone Protection
                <span className="block text-yellow-400">Made Simple</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed mb-8 max-w-2xl">
                Get instant coverage with model-based pricing. 
                <span className="font-semibold text-white"> No photos needed for quotes.</span>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
                <Link
                  to="/quote"
                  className="group bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-xl text-lg font-bold transition-all transform hover:scale-105 inline-flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  <Smartphone className="mr-3 h-6 w-6" />
                  Get Instant Quote
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="group border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold transition-all inline-flex items-center justify-center">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    className="text-center"
                  >
                    <stat.icon className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-blue-200 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Interactive Demo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20 shadow-2xl">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4">How It Works</h3>
                  <div className="flex justify-center space-x-2 mb-6">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentStep ? 'bg-yellow-400' : 'bg-white bg-opacity-30'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="bg-yellow-400 text-gray-900 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-10 w-10" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">{steps[currentStep].title}</h4>
                  <p className="text-blue-100">{steps[currentStep].description}</p>
                </motion.div>

                <div className="mt-8 text-center">
                  <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold inline-block">
                    ✓ Coverage starts instantly
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Updated with new plans */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4"
            >
              🎉 Limited Time: Up to 60% Off First Year
            </motion.div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Protection
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transparent pricing with no hidden fees. Cancel anytime.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
                  plan.popular 
                    ? 'ring-4 ring-blue-500 ring-opacity-50 scale-105 z-10' 
                    : 'hover:scale-105'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-gray-400 line-through text-lg">{plan.originalPrice}</span>
                      <div className="text-4xl font-bold text-gray-900">{plan.price}</div>
                      <div className="text-gray-600">per month</div>
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {plan.savings}
                    </div>
                    <p className="text-gray-600 mt-3">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    to="/register"
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 inline-block text-center ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    Get Protected Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Optional Add-ons Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-16"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Optional Add-ons</h3>
              <p className="text-xl text-gray-600">Enhance your protection with these additional services</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {addOns.map((addon, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all hover:shadow-lg ${
                    addon.popular ? 'border-purple-200 bg-purple-50' : 'border-gray-200'
                  }`}
                >
                  {addon.popular && (
                    <div className="text-center mb-3">
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Popular Add-on
                      </span>
                    </div>
                  )}
                  <div className="text-center">
                    <div className={`p-3 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-4 ${
                      addon.popular ? 'bg-purple-100' : 'bg-gray-100'
                    }`}>
                      <addon.icon className={`h-6 w-6 ${addon.popular ? 'text-purple-600' : 'text-gray-600'}`} />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{addon.name}</h4>
                    <div className={`text-2xl font-bold mb-3 ${addon.popular ? 'text-purple-600' : 'text-gray-900'}`}>
                      +{addon.price}
                      <span className="text-sm text-gray-600">/month</span>
                    </div>
                    <p className="text-gray-600 text-sm">{addon.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Money Back Guarantee */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mt-12"
          >
            <div className="inline-flex items-center bg-blue-50 text-blue-800 px-6 py-3 rounded-full">
              <Shield className="h-5 w-5 mr-2" />
              <span className="font-semibold">30-day money-back guarantee</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof - Enhanced */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Loved by Customers</h2>
            <div className="flex justify-center items-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
              <span className="text-xl font-semibold text-gray-900 ml-2">4.9/5</span>
              <span className="text-gray-600">from 12,000+ reviews</span>
            </div>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 lg:p-12">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <img
                    src={testimonials[activeTestimonial].avatar}
                    alt={testimonials[activeTestimonial].name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
                
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-xl lg:text-2xl text-gray-900 font-medium mb-6">
                  "{testimonials[activeTestimonial].text}"
                </blockquote>
                
                <div className="text-lg font-semibold text-gray-900">
                  {testimonials[activeTestimonial].name}
                </div>
                <div className="text-gray-600">
                  {testimonials[activeTestimonial].location}
                </div>
              </div>
              
              <div className="flex justify-center space-x-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === activeTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Akko Style */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose CoverCell?</h2>
            <p className="text-xl text-gray-600">Advanced protection with instant quotes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Smartphone,
                title: 'Model-Based Pricing',
                description: 'Fair pricing based on your exact device model, not one-size-fits-all',
                color: 'bg-yellow-100 text-yellow-600'
              },
              {
                icon: Clock,
                title: 'Same-Day Repairs',
                description: 'Most repairs completed within 4 hours at our certified partner locations',
                color: 'bg-blue-100 text-blue-600'
              },
              {
                icon: Shield,
                title: 'Comprehensive Coverage',
                description: 'Protection against drops, spills, theft, and mechanical failures',
                color: 'bg-green-100 text-green-600'
              },
              {
                icon: MapPin,
                title: '2,500+ Repair Centers',
                description: 'Nationwide network of certified repair shops and mobile technicians',
                color: 'bg-purple-100 text-purple-600'
              },
              {
                icon: Phone,
                title: '24/7 Support',
                description: 'Round-the-clock customer service and emergency claim assistance',
                color: 'bg-red-100 text-red-600'
              },
              {
                icon: DollarSign,
                title: 'No Hidden Fees',
                description: 'Transparent pricing with clear deductibles based on device condition',
                color: 'bg-indigo-100 text-indigo-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`${feature.color} p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-6`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Akko Style */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h2 className="text-4xl lg:text-5xl font-bold">
              Ready to Protect Your Phone?
            </h2>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto">
              Join 500,000+ customers who trust CoverCell for their mobile protection. 
              Get started in under 60 seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to="/quote"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-10 py-5 rounded-xl text-xl font-bold transition-all transform hover:scale-105 inline-flex items-center justify-center shadow-2xl"
              >
                <Smartphone className="mr-3 h-6 w-6" />
                Get Instant Quote
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white hover:bg-white hover:text-blue-600 px-10 py-5 rounded-xl text-xl font-bold transition-all inline-flex items-center justify-center"
              >
                <Phone className="mr-3 h-6 w-6" />
                Talk to Expert
              </Link>
            </div>

            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <span>No commitment</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <span>30-day guarantee</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;