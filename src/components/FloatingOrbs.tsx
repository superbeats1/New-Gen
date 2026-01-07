import React from 'react';

const FloatingOrbs: React.FC = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full animate-orb-float"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-indigo-600/20 blur-[120px] rounded-full animate-orb-float-delayed"></div>
            <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-cyan-500/10 blur-[100px] rounded-full animate-orb-float-reverse"></div>

            <style>{`
        @keyframes orb-float {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          33% { transform: translate(50px, 100px) scale(1.1); opacity: 0.5; }
          66% { transform: translate(-30px, 50px) scale(0.9); opacity: 0.4; }
        }
        @keyframes orb-float-reverse {
          0%, 100% { transform: translate(0, 0) scale(1.1); opacity: 0.2; }
          40% { transform: translate(-80px, -40px) scale(0.9); opacity: 0.4; }
          75% { transform: translate(40px, 60px) scale(1); opacity: 0.3; }
        }
        .animate-orb-float {
          animation: orb-float 25s ease-in-out infinite;
        }
        .animate-orb-float-delayed {
          animation: orb-float 30s ease-in-out infinite reverse;
          animation-delay: -5s;
        }
        .animate-orb-float-reverse {
          animation: orb-float-reverse 20s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

export default FloatingOrbs;
