import { Link } from 'react-router-dom';
import { Leaf, Instagram, Phone, MapPin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-max section-padding">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src='./magudam_logo_1.png' className='h-12 w-12' alt="" />
              <span className="font-display text-2xl font-bold">
                Magudam Herbals
              </span>
            </div>
            <p className="text-primary-foreground/80 mb-6 max-w-sm">
              Traditional herbal products made with natural ingredients. Bringing nature's best to your skin and hair care routine.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/magudam_herbals"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="tel:+919751701257"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <Phone size={20} />
              </a>
              <a
                href="mailto:magudamherbals@gmail.com"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#about" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#products" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="#contact" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Policies</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Refund & Shipping
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © {new Date().getFullYear()} Magudam Herbals – All Rights Reserved
            </p>
            <div className="flex items-center gap-2 text-primary-foreground/60 text-sm">
              <MapPin size={16} />
              <span>Made with ❤️ in India 🇮🇳</span>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-primary/80 py-4">
        <div className="container-max px-4 md:px-8 lg:px-16">
          <p className="text-xs text-primary-foreground/60 text-center">
            <strong>Disclaimer:</strong> Our products are traditional herbal preparations and are not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary. Please consult a healthcare professional before use if you have any specific health concerns.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
