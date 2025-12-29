import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Leaf, Heart, Shield, Sparkles } from 'lucide-react';

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Leaf,
      title: 'Natural Ingredients',
      description: 'Pure herbs sourced from nature',
    },
    {
      icon: Heart,
      title: 'Traditional Methods',
      description: 'Time-tested Ayurvedic recipes',
    },
    {
      icon: Shield,
      title: 'Safe & Hygienic',
      description: 'Clean production process',
    },
    {
      icon: Sparkles,
      title: 'Effective Results',
      description: 'Visible improvement guaranteed',
    },
  ];

  return (
    <section id="about" className="section-padding leaf-pattern" ref={ref}>
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              About Us
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Traditional Herbal Care for
              <span className="text-primary"> Modern Living</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              <strong className="text-foreground">Magudam Herbals</strong> is a traditional herbal products brand based in Kodumudi, Tamil Nadu. We prepare our products using natural ingredients, traditional knowledge, and hygienic methods to provide safe and effective herbal care for skin and hair.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our formulations are passed down through generations, combining the wisdom of Ayurveda with modern quality standards. Every product is crafted with love and care to bring you the best of nature.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="card-herbal p-6 text-center group"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
