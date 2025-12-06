import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="text-2xl font-bold tracking-tighter text-white mb-4">
              BikeRate<span className="text-emerald-400">.lk</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Sri Lanka's #1 Motorbike Leasing Comparison Platform. We help you
              find the best rates from top banks instantly.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-slate-400 hover:text-emerald-400 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-emerald-400 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-emerald-400 transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#inventory"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Browse Bikes
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Leasing Calculator
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="text-emerald-400 shrink-0 mt-0.5"
                />
                <span>
                  123 Union Place,
                  <br />
                  Colombo 02, Sri Lanka
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-emerald-400 shrink-0" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-emerald-400 shrink-0" />
                <span>hello@bikerate.lk</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} BikeRate.lk. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">
            Designed for Web App Development Assignment
          </p>
        </div>
      </div>
    </footer>
  );
}
