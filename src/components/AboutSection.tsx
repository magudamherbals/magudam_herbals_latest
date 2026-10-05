import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Leaf, Heart, Shield, Sparkles, BadgeCheck, ReceiptIndianRupee } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  const features = [
    { icon: Leaf,     titleKey: 'about.feat1.title', descKey: 'about.feat1.desc' },
    { icon: Heart,    titleKey: 'about.feat2.title', descKey: 'about.feat2.desc' },
    { icon: Shield,   titleKey: 'about.feat3.title', descKey: 'about.feat3.desc' },
    { icon: Sparkles, titleKey: 'about.feat4.title', descKey: 'about.feat4.desc' },
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
              {t('about.badge')}
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {t('about.heading1')}
              <span className="text-primary"> {t('about.heading2')}</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              <strong className="text-foreground">Magudam Herbals</strong>{' '}
              {t('about.para1').replace('Magudam Herbals', '').trimStart().replace(/^is a/, 'is a')}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('about.para2')}
            </p>
            <div className="card-herbal mt-8 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-primary/15 via-primary/10 to-transparent border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/15 flex items-center justify-center">
                    <BadgeCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground leading-tight">
                      {t('about.bizDetails')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('about.bizVerified')}
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
                key={feature.titleKey}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="card-herbal p-6 text-center group"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(feature.descKey)}
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
