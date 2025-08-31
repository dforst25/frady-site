import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Users, Camera, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Home: React.FC = () => {
  const { t, isRTL } = useLanguage();

  const heroImages = [
    'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1743971/pexels-photo-1743971.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ];

  const stats = [
    { icon: Camera, value: '500+', label: 'Happy Families' },
    { icon: Heart, value: '10+', label: 'Years Experience' },
    { icon: Star, value: '5.0', label: 'Average Rating' },
    { icon: Users, value: '1000+', label: 'Photo Sessions' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            key={heroImages[0]}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <img
              src={heroImages[0]}
              alt="Family Photography"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
            {t('home.hero.title')}
          </motion.h1>
          
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-lg md:text-xl mb-8 text-gray-200 max-w-2xl mx-auto"
          >
            {t('home.hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 space-x-2 rtl:space-x-reverse"
            >
              <span>{t('home.hero.cta')}</span>
              <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-rose-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Photographer"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {t('home.about.title')}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('home.about.text')}
              </p>
              <Link
                to="/about"
                className="inline-flex items-center text-rose-500 hover:text-rose-600 font-semibold space-x-2 rtl:space-x-reverse"
              >
                <span>Learn More</span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('gallery.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              גלו את הרגעים המיוחדים שאני מתמחה לתעד - מצילומי חלאקה ועד לפורטרטים משפחתיים חמים
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { image: 'https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg?auto=compress&cs=tinysrgb&w=600', title: t('gallery.chalaka') },
              { image: 'https://images.pexels.com/photos/1743971/pexels-photo-1743971.jpeg?auto=compress&cs=tinysrgb&w=600', title: t('gallery.family') },
              { image: 'https://images.pexels.com/photos/1720186/pexels-photo-1720186.jpeg?auto=compress&cs=tinysrgb&w=600', title: t('gallery.newborn') },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-white text-xl font-semibold">{item.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/gallery"
              className="inline-flex items-center px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 space-x-2 rtl:space-x-reverse"
            >
              <span>View Full Gallery</span>
              <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;