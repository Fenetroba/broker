import {
  Contact,
  Facebook,
  FileQuestion,
  Instagram,
  Mail,
  MapPinned,
  PanelTopInactive,
  Paperclip,
  Send,
  TicketIcon,
  TouchpadOff,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import PriverPolicy from "./FooterComponents/PriverPolicy";
import RefundPolicy from "./FooterComponents/RefundPolicy";
import TermsOfUse from "./FooterComponents/TermsOfUse";
import Location from "./FooterComponents/Location";
import Supporter from "./FooterComponents/Supporter";

const Footer = () => {
  return (
    <footer className="footer-container w-full py-10 bg-[var(--two2m)] text-white flex flex-col items-center gap-6 mt-12 border-t border-[var(--parent1)]/20">
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start gap-8 px-4 md:px-0">
        {/* Need Help */}
        <nav className="flex-1 min-w-[180px] mb-6 md:mb-0">
          <h2 className="text-lg font-bold mb-3">Need Help?</h2>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="flex items-center gap-2 hover:text-[#62c022] transition-colors">
                <Mail className="w-5 h-5" />
                <span>info@fationLink.com</span>
              </Link>
            </li>
            <li className="flex">
            
                <MapPinned className="" />
                <span className=" -ml-2"><Location/></span>
       
            </li>
          </ul>
        </nav>
        {/* Public Relations */}
        <nav className="flex-1 min-w-[180px] mb-6 md:mb-0">
          <h2 className="text-lg font-bold mb-3">Public Relations</h2>
          <ul className="space-y-0">
            <li className="flex items-center">
              
                <FileQuestion className=" -mr-8"/><span><Supporter/></span>
           
            </li>
            
          </ul>
        </nav>
        {/* Company */}
        <nav className="flex-1 min-w-[180px] mb-6 md:mb-0">
          <h2 className="text-lg font-bold mb-3">Company</h2>
          <ul className="space-y-2">
            <li>
              <Link to="/privacy" className="flex items-center gap-2 hover:text-[#62c022] transition-colors">
                <PanelTopInactive className="w-5 h-5" />
                <span><PriverPolicy/></span>
              </Link>
            </li>
            <li>
              <Link to="/refund" className="flex items-center gap-2 hover:text-[#62c022] transition-colors">
                <MapPinned className="w-5 h-5" />
                <span> <RefundPolicy/></span>
              </Link>
            </li>
            <li>
              <Link to="/terms" className="flex items-center gap-2 hover:text-[#62c022] transition-colors">
                <TouchpadOff className="w-5 h-5" />
                <span><TermsOfUse/></span>
              </Link>
            </li>
          </ul>
        </nav>
        {/* Stay Connected */}
        <nav className="flex-1 min-w-[180px]">
          <h2 className="text-lg font-bold mb-3">Stay Connected</h2>
          <div className="flex gap-4 mt-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-[#62c022] transition-colors">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[#62c022] transition-colors">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="#" aria-label="Attachment" className="hover:text-[#62c022] transition-colors">
              <Send className="w-6 h-6" />
            </a>
            <a href="#" aria-label="Tickets" className="hover:text-[#62c022] transition-colors">
              <TicketIcon className="w-6 h-6" />
            </a>
          </div>
        </nav>
      </div>
      <div className="footer-copy text-sm text-[var(--parent4)] pt-6 text-center w-full border-t border-[var(--parent1)]/10 mt-8">
        &copy; {new Date().getFullYear()}  Fasion Link | All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
