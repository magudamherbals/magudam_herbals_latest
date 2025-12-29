import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProductsSection from '@/components/ProductsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Helmet>
        <title>Magudam Herbals | Traditional Herbal Products from Tamil Nadu</title>
        <meta 
          name="description" 
          content="Magudam Herbals offers pure, natural herbal products for skin and hair care. Handcrafted in Kodumudi, Tamil Nadu using traditional Ayurvedic knowledge. Shop soaps & hair oils." 
        />
        <meta name="keywords" content="herbal products, natural soap, hair oil, ayurvedic, Tamil Nadu, Kodumudi, Magudam Herbals, organic skincare" />
        <link rel="canonical" href="https://magudamherbals.com" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Magudam Herbals | Pure Herbal Care from Nature" />
        <meta property="og:description" content="Traditional herbal products for skin and hair care, handcrafted in Tamil Nadu." />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_IN" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Magudam Herbals",
            "description": "Herbal products manufacturer based in Kodumudi, Tamil Nadu",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Kodumudi",
              "addressRegion": "Tamil Nadu",
              "addressCountry": "IN"
            },
            "telephone": "+91-97517-01257",
            "priceRange": "₹₹"
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection 
            onShopClick={() => scrollToSection('products')} 
            onContactClick={() => scrollToSection('contact')} 
          />
          <AboutSection />
          <ProductsSection />
          <ContactSection />
        </main>
        <Footer />
        <CartSidebar />
      </div>
    </>
  );
};

export default Index;
