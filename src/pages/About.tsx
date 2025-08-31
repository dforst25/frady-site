import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Heart, Award, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const About: React.FC = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: Heart,
      title: 'תשוקה לצילום',
      description: 'כל צילום הוא הזדמנות ליצור משהו יפה ומשמעותי'
    },
    {
      icon: Users,
      title: 'קשר אישי',
      description: 'יוצרת אווירה נעימה ובטוחה עבור כל המשפחה'
    },
    {
      icon: Award,
      title: 'איכות מקצועית',
      description: 'ציוד מתקדם וטכניקות עדכניות לתוצאות מושלמות'
    },
    {
      icon: Camera,
      title: 'חדשנות יצירתית',
      description: 'גישה ייחודית לכל צילום המתאימה לאופי המשפחה'
    }
  ];

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('about.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            הכירו את הצלמת שמאחורי העדשה - סיפור של תשוקה, מקצועיות ואהבה לצילום
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src="https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Photographer"
              className="rounded-2xl shadow-2xl w-full"
            />
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-gray-900">
              מי אני ומה מניע אותי
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                שמי [שם הצלמת] ואני צלמת מקצועית עם מעל 10 שנות ניסיון בצילום ילדים ומשפחות. 
                התחלתי את המסע שלי כאמא צעירה שרצתה לתעד את הרגעים המיוחדים של הילדים שלי, 
                ומאז הפכתי לצלמת מבוקשת המתמחה בצילומי חלאקה, פורטרטים משפחתיים וצילומי ילדים.
              </p>
              <p>
                האמונה שלי היא שכל משפחה ייחודית ומגיעה לה תיעוד מותאם אישית. אני מקדישה זמן 
                להכיר כל משפחה, להבין את הצרכים שלה ולייצר אווירה נעימה ובטוחה במהלך הצילום.
              </p>
              <p>
                המטרה שלי היא ליצור לכם זכרונות יפים שתוכלו לשמור ולהעביר לדורות הבאים. 
                כל תמונה שאני מצלמת נעשית באהבה ובתשומת לב לפרטים הקטנים שהופכים כל רגע למיוחד.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Values Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            הערכים שמנחים אותי
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0 w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                    <value.icon className="w-6 h-6 text-rose-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Experience Timeline */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gray-50 rounded-2xl p-8 md:p-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            המסע המקצועי שלי
          </h2>
          <div className="space-y-8">
            {[
              { year: '2014', title: 'התחלת המסע', desc: 'הקמתי את הסטודיו לצילום והתמחיתי בצילומי ילדים' },
              { year: '2017', title: 'התמחות בחלאקות', desc: 'פיתחתי מומחיות ייחודית בצילומי חלאקה ואירועים משפחתיים' },
              { year: '2020', title: 'הרחבת השירותים', desc: 'הוספתי צילומי הריון, ילודים וסמאש קייק' },
              { year: '2024', title: 'היום', desc: 'מעל 500 משפחות מרוצות ומאות זכרונות יפים שנוצרו' }
            ].map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="flex items-center space-x-6 rtl:space-x-reverse"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold">
                  {milestone.year}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-600">
                    {milestone.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;