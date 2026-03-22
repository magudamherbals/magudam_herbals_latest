import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Leaf, Heart, Shield, Sparkles, BadgeCheck, ReceiptIndianRupee } from 'lucide-react';

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
      description: 'Time-tested Herbal recipes',
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
              Our formulations are passed down through generations, combining traditional herbal wisdom with modern quality standards. Every product is crafted with love and care to bring you the best of nature.
            </p>
            <div className="card-herbal mt-8 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-primary/15 via-primary/10 to-transparent border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/15 flex items-center justify-center">
                    <BadgeCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground leading-tight">
                      Business Details
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Verified registration information
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 grid sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border/60 bg-background/50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <ReceiptIndianRupee className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">GSTIN</p>
                      <p className="font-semibold text-foreground tracking-wide break-all">33BIYPR0246N1ZK</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-background/50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <BadgeCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">MSME / Udyam Reg. No</p>
                      <p className="font-semibold text-foreground break-all">UDYAM-TN-07-0081736</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
