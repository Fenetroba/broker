import React, { useState } from "react";
import Logo from "../../assets/Logo.png";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Menu, User, X } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ParentPage = [
  {
    pageName: "Home",
    Url: "/",
    id: 1,
  },
  {
    pageName: "About",
    Url: "/about",
    id: 2,
  },
  {
    pageName: "Contact Us",
    Url: "/contactus",
    id: 3,
  },
  {
    pageName: "How To Work",
    Url: "/how-to-work",
    id: 4,
  },
];

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("darkP");
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="sticky top-0 w-full z-40 bg-[var(--two3m)] shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center ">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Logo" className="w-48 h-14 object-contain" />
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 text-[16px] items-center font-bold">
          {ParentPage.map((Page) => (
            <Link
              key={Page.id}
              to={Page.Url}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <span>{Page.pageName}</span>
            </Link>
          ))}
        </nav>
        {/* Desktop Login Button */}
        <div className="hidden md:flex items-center space-x-2">
          <Button className="bg-[var(--parent1)] shadow-lg text-[var(--parent4)]  text-[16px] hover:bg-[var(--parent2)] px-6 py-2">
            <Link to="/auth/login">Login</Link>
          </Button>
          <Button className="text-white cursor-pointer shadow-lg w-20">
            <Tooltip>
              <TooltipTrigger>
                <User fontSize={32} />
              </TooltipTrigger>
              <TooltipContent className='bg-[var(--two2m)] rounded-2xl text-white'>
                Users
              </TooltipContent>
            </Tooltip>
          </Button>
        </div>
        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center p-2 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>
      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-full  bg-[var(--two5m)] shadow-2xl z-50 flex flex-col px-6 py-8 md:hidden"
          >
            <button
              className="self-end mb-8 p-2 rounded-full hover:bg-[var(--parent1)]/10"
              onClick={toggleMenu}
              aria-label="Close menu"
            >
              <X className="w-7 h-7" />
            </button>
            <div className="flex flex-col gap-4 mt-2">
              {ParentPage.map((Page) => (
                <Link
                  key={Page.id}
                  to={Page.Url}
                  className="py-3 px-2 rounded-lg font-bold text-[16px] hover:text-[#62c022] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {Page.pageName}
                </Link>
              ))}
              <Button className="bg-[var(--two2m)] text-white rounded-2xl text-[16px] hover:bg-[#4ea017] px-6 py-2 mt-2 w-full">
                <Link to="/auth/login" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
      {/* Overlay for mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={toggleMenu}
        />
      )}
    </header>
  );
};

export default Header;
