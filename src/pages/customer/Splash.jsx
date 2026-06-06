import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCoffee } from 'react-icons/fi';

export default function Splash() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const table = searchParams.get('table');

  useEffect(() => {
    if (table) {
      sessionStorage.setItem('tableNumber', table);
    }
    
    const timer = setTimeout(() => {
      navigate('/menu');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate, table]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-primary text-highlight relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute inset-0 cafe-pattern pointer-events-none"></div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center z-10"
      >
        <div className="w-24 h-24 bg-accent/20 backdrop-blur-md rounded-full flex items-center justify-center text-accent mb-6 shadow-2xl border border-accent/30">
          <FiCoffee className="w-12 h-12" />
        </div>
        
        <h1 className="text-5xl font-serif font-bold mb-2 tracking-tight text-white">Brew Haven</h1>
        <p className="font-sans text-accent uppercase tracking-[0.2em] text-sm mb-12">Artisanal Experiences</p>
        
        <div className="flex space-x-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3] 
              }}
              transition={{ 
                duration: 1, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
              className="w-2 h-2 bg-accent rounded-full"
            />
          ))}
        </div>
      </motion.div>
      
      <div className="absolute bottom-10 text-white/40 text-xs tracking-widest uppercase font-medium">
        Since 2026
      </div>
    </div>
  );
}
