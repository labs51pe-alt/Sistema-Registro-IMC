import React from 'react';

const HerbalifeLogo: React.FC<{ className?: string }> = ({ className = "h-10 w-auto" }) => {
    return (
        <svg viewBox="0 0 340 92" className={className} xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(5, 5)">
                {/* Right Glass (Teal) */}
                <g transform="rotate(-8 60 44)">
                    <path d="M40 0 H80 L72 80 H32 Z" fill="#009384" />
                    <rect x="40" y="8" width="40" height="12" fill="white" />
                    <rect x="75" y="-5" width="8" height="10" fill="#009384" />
                </g>
                
                {/* Left Glass (Dark Green) */}
                <g transform="rotate(8 45 44)">
                    <path d="M20 0 H60 L52 80 H12 Z" fill="#006838" />
                    <rect x="20" y="8" width="40" height="12" fill="white" />
                    <rect x="55" y="-5" width="8" height="10" fill="#006838" />
                </g>

                {/* Smile */}
                <path d="M35 58 Q55 75, 75 58 C 65 65, 45 65, 35 58" fill="white" />

                {/* Text */}
                <text fill="#006838" fontFamily="Arial, Helvetica, sans-serif" fontSize="32" fontWeight="bold" letterSpacing="0.64">
                    <tspan x="120" y="48">Club de </tspan>
                    <tspan x="229" y="48" fill="#009384">Nutrición</tspan>
                </text>
                <text fill="#006838" fontFamily="Arial, Helvetica, sans-serif" fontSize="21" letterSpacing="0.42">
                    <tspan x="120" y="76">Herbalife</tspan>
                </text>

                {/* Leaf Icon */}
                <path fill="#8CC63F" d="m223.64 78.58c.96 0 1.8.312 2.52.936.72.624 1.08 1.416 1.08 2.376v.096c0 1.008-.384 1.848-1.152 2.52-.768.672-1.68.992-2.736.992-1.584 0-2.832-.88-3.744-2.64l.912-1.392c.576 1.056 1.224 1.584 1.944 1.584.624 0 1.128-.24 1.512-.72.384-.48.576-1.08.576-1.8v-.288c-.528.384-1.08.576-1.656.576-1.296 0-2.256-.736-2.88-2.208-.432-1.008-.648-2.136-.648-3.384v-.096c0-1.2.256-2.28.768-3.24.512-.96 1.264-1.44 2.256-1.44.672 0 1.248.192 1.728.576v-.48h1.488v5.136h-1.584v-.48c-.432.384-.912.576-1.44.576-.72 0-1.284-.336-1.692-1.008-.408-.672-.612-1.536-.612-2.6v-.096c0-.96.18-1.776.54-2.448.36-.672.864-1.008 1.512-1.008.912 0 1.584.56 2.016 1.68V78.58z"/>
            </g>
        </svg>
    );
};

export default HerbalifeLogo;