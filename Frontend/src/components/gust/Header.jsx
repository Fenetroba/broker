import React, { useState } from "react";
import Logo from "../../assets/Logo.png";
import { Menu, User, X } from "lucide-react";
import { Button } from "../ui/button";
import { Link, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { LogOut } from "@/store/AuthSlice";

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

const Header = ({ isAuthenticated, user }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const userProfileImage=user?.profilePic

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("darkP");
  };
  const dispatch = useDispatch();
  const LogoutHandler = () => [dispatch(LogOut())];
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="sticky top-0 w-full z-40 bg-[var(--two3m)] shadow mb-6">
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
          <Button className="bg-[var(--two2m)] shadow-lg text-[var(--two5m)]  text-[16px] hover:bg-green-900 px-6 py-2 rounded-2xl">
            {isAuthenticated ? (
              <p onClick={LogoutHandler}>LogOut</p>
            ) : (
              <Link to="/auth/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            )}
          </Button>
          {/* the use profile */}
          {isAuthenticated ? (
            <Link to="/local_shop/home">
              <Button className="text-black cursor-pointer shadow-lg w-20 bg-[var(--two5m)] rounded-[3px] hover:bg-gray-200">
                <User fontSize={32} />
              </Button>
            </Link>
          ) : (
            <Link to="/auth/login">
              <Button className="text-black cursor-pointer shadow-lg w-20 bg-[var(--two5m)] rounded-[3px] hover:bg-gray-200">
                <User fontSize={32} />
              </Button>
            </Link>
          )}
         {
          isAuthenticated &&  <div>
          <img src=  {userProfileImage} alt="user" className="w-10 h-10 rounded-full" />
          </div>
         }
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
            className="fixed top-0 left-0  h-full w-full  bg-[var(--two5m)] shadow-2xl z-50 flex flex-col px-6 py-8 md:hidden"
          >
            <div className="flex items-center justify-center  gap-52 ">
              <Link to="/" className="flex items-center">
                <img
                  src={Logo}
                  alt="Logo"
                  className="w-48 h-34 object-contain"
                />
              </Link>
              <button
                className="self-endp-2 mb-40 rounded-full hover:bg-[var(--parent1)]/10"
                onClick={toggleMenu}
                aria-label="Close menu"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              {ParentPage.map((Page) => (
                <Link
                  key={Page.id}
                  to={Page.Url}
                  className="py-3 px-2 rounded-lg font-bold  shadow text-[16px] hover:text-[#62c022] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {Page.pageName}
                </Link>
              ))}
              <Button className="bg-[var(--two2m)] text-white rounded-2xl text-[16px] hover:bg-[#4ea017] px-6 py-2 mt-2 w-full">
                {isAuthenticated ? (
                  <p onClick={LogoutHandler}>LogOut</p>
                ) : (
                  <Link to="/auth/login" onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>
                )}
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
