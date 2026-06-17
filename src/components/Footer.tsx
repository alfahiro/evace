import React from 'react';
import { Mail, Phone, Settings, Facebook, Twitter, Linkedin, Play } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-white border border-gray-100 rounded-2xl shadow-xs p-6 flex flex-col md:flex-row items-center justify-between gap-6 select-none mt-8" id="evace-primary-footer">
      {/* Left side: IT & support contacts */}
      <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
        {/* Contacts text */}
        <div className="space-y-0.5 text-slate-500" id="gati-contact-details">
          <p className="text-[11px] font-bold tracking-wider leading-none select-text flex items-center justify-center md:justify-start">
            <Phone className="w-3.5 h-3.5 mr-1 text-[#0a4d2c] shrink-0" />
            <span>(22) 99705-5992</span>
          </p>
          <p className="text-[10px] select-text flex items-center justify-center md:justify-start">
            <Mail className="w-3.5 h-3.5 mr-1 text-[#0a4d2c] shrink-0" />
            <a 
              href="mailto:suporte@evace.com.br" 
              className="hover:text-emerald-700 transition-[#0a4d2c]"
            >
              suporte@evace.com.br
            </a>
          </p>
        </div>
      </div>

      {/* Right side: Digital Social Badges */}
      <div className="flex items-center space-x-2" id="evace-social-buttons">
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); alert("Acessando Facebook da EVACE"); }}
          className="w-8 h-8 rounded bg-emerald-50/50 hover:bg-[#0a4d2c] hover:text-white text-[#0a4d2c] flex items-center justify-center transition-all cursor-pointer border border-emerald-700/10"
          title="Facebook"
        >
          <Facebook className="w-4 h-4" />
        </a>
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); alert("Acessando Twitter / X da EVACE"); }}
          className="w-8 h-8 rounded bg-emerald-50/50 hover:bg-slate-900 hover:text-white text-slate-700 flex items-center justify-center transition-all cursor-pointer border border-emerald-700/10"
          title="Twitter (X)"
        >
          <Twitter className="w-4 h-4" />
        </a>
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); alert("Acessando LinkedIn da EVACE"); }}
          className="w-8 h-8 rounded bg-emerald-50/50 hover:bg-emerald-800 hover:text-white text-emerald-800 flex items-center justify-center transition-all cursor-pointer border border-emerald-700/10"
          title="LinkedIn"
        >
          <Linkedin className="w-4 h-4" />
        </a>
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); alert("Acessando App Oficial EVACE na Play Store"); }}
          className="w-8 h-8 rounded bg-emerald-50/50 hover:bg-emerald-600 hover:text-white text-emerald-600 flex items-center justify-center transition-all cursor-pointer border border-emerald-700/10"
          title="Google Play"
        >
          <Play className="w-4 h-4 rotate-0 fill-current" />
        </a>
      </div>
    </footer>
  );
}
