// Nav.jsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/excel.png";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

// Use motion.create when available; fallback to motion(Link) for older versions
const MotionLink =
  typeof motion.create === "function" ? motion.create(Link) : motion(Link);

function Nav() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="w-full py-2 text-white">
      <nav className="flex items-center px-[700px] md:px-[568px] justify-evenly sm:justify-between gap-[0px] md:gap-[180px]">
        <img className="h-[40px] w-auto" src={logo} alt="logo img" />

        <ul className="hidden md:flex cursor-pointer font-Poppins items-center gap-7 bg-gradient-to-r from-[#0b541e] via-[#499c0a] to-[#0dff00] p-4 rounded-xl text-white">
          <motion.li whileHover={{ scale: 1.2 }} transition={{ duration: 0.2 }}>
            <Link to="/">Home</Link>
          </motion.li>
          <motion.li whileHover={{ scale: 1.2 }} transition={{ duration: 0.2 }}>
            <Link to="/services" >Visualize Data</Link>
          </motion.li>
          <motion.li whileHover={{ scale: 1.2 }} transition={{ duration: 0.2 }}>
            <Link to="/about">Contact</Link>
          </motion.li>
        </ul>

        {!user ? (
          <MotionLink
            to="/signup"
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl px-2 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:shadow-blue-500/50 hover:scale-105 transition duration-300 cursor-pointer"
          >
            Sign Up
          </MotionLink>
        ) : (
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.15 }}
            className="bg-red-600 font-medium shadow-4xl px-6 py-2 transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer rounded-2xl"
          >
            Log Out
          </motion.button>
        )}
      </nav>
    </div>
  );
}

export default Nav;
