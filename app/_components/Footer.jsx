import React from "react";
import { Facebook, Instagram, Twitter, Github, Dribbble } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-[#0F172A] to-[#173345e0] py-16 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-start md:justify-between gap-10">
        {/* Left side - About / slogan */}
        <div className="md:w-1/3 text-gray-400">
          <img src="/logo2.svg" alt="Nipun AI Logo" className="h-12 mb-6" />
          <p>
            Nipun AI is your personal AI interview coach. Simulate realistic mock interviews
            with camera and mic, receive intelligent feedback, and track your progress — all in one platform.
          </p>
        </div>

        {/* Center - Navigation + Social */}
        <div className="md:w-1/3 flex flex-col items-center">
          {/* Navigation Links */}
          <ul className="flex flex-wrap justify-center gap-6 text-sm text-gray-300 font-medium mb-8">
            <li><a href="#" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline">Features</a></li>
            <li><a href="#" className="hover:underline">Pricing</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>

          {/* Social Media Icons */}
          <ul className="flex justify-center gap-6 md:gap-8 text-white">
            {[
              {
                href: "https://facebook.com",
                label: "Facebook",
                icon: <Facebook size={24} />,
                hoverClass: "hover:text-blue-500",
              },
              {
                href: "https://instagram.com",
                label: "Instagram",
                icon: <Instagram size={24} />,
                hoverClass: "hover:text-pink-500",
              },
              {
                href: "https://twitter.com",
                label: "Twitter",
                icon: <Twitter size={24} />,
                hoverClass: "hover:text-blue-400",
              },
              {
                href: "https://github.com",
                label: "GitHub",
                icon: <Github size={24} />,
                hoverClass: "hover:text-gray-400",
              },
              {
                href: "https://dribbble.com",
                label: "Dribbble",
                icon: <Dribbble size={24} />,
                hoverClass: "hover:text-pink-600",
              },
            ].map(({ href, label, icon, hoverClass }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className={`transition-colors duration-300 ${hoverClass}`}
                >
                  <span className="sr-only">{label}</span>
                  {icon}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right side - Newsletter Signup */}
        <div className="md:w-1/3 text-gray-400">
          <h3 className="text-lg font-semibold mb-4">Subscribe to our Newsletter</h3>
          <p className="mb-4">
            Get the latest updates and interview tips delivered straight to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email"
              className="rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
            <button
              type="submit"
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-md px-6 py-2 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Nipun AI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
