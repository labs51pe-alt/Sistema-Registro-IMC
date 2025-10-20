import React from 'react';

const HerbalifeLogo: React.FC<{ className?: string }> = ({ className = "h-10 w-auto" }) => {
    return (
        <svg viewBox="0 0 327 92" className={className} xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
                {/* Glasses Icon */}
                <g>
                    <path fill="#006838" d="M37.814 11.237L31.39 88.318 73.13 88.318 79.554 11.237z" transform="matrix(-1 0 0 1 110.944 0) rotate(10 55.472 49.778)" />
                    <path fill="#009384" d="M36.195 11.237L29.771 88.318 71.511 88.318 77.935 11.237z" transform="matrix(-1 0 0 1 149.316 0) rotate(-10 53.853 49.778)" />
                    <path fill="#FFF" d="M34.935 60.187C41.38 66.83 50.84 70.93 61.643 71.867 52.189 77.531 41.282 78.48 31.39 74.38 31.91 69.191 32.95 64.262 34.935 60.187z" />
                    <path fill="#006838" d="M73.538 5.619L73.538 12.043 79.962 12.043 79.962 5.619z" transform="matrix(-1 0 0 1 166.343 0) rotate(10 76.75 8.83)" />
                    <path fill="#009384" d="M72.33 5.619L72.33 12.043 78.754 12.043 78.754 5.619z" transform="matrix(-1 0 0 1 147.754 0) rotate(-10 75.542 8.83)" />
                    <path fill="#FFF" d="M77.935 11.237H29.771v13.655h48.164z" transform="matrix(-1 0 0 1 107.706 0)" />
                    <path fill="#FFF" d="M79.554 11.237H31.39v13.655h48.164z" transform="matrix(-1 0 0 1 110.944 0)" />
                </g>
                
                {/* Text */}
                <text fill="#006838" fontFamily="sans-serif" fontSize="32" fontWeight="bold" letterSpacing=".64">
                    <tspan x="120" y="52">Club de </tspan>
                    <tspan x="229.408" y="52" fill="#009384">Nutrición</tspan>
                </text>
                <text fill="#006838" fontFamily="sans-serif" fontSize="21" letterSpacing=".42">
                    <tspan x="120" y="80">Herbalife</tspan>
                </text>

                {/* Leaf Icon */}
                <path fill="#8CC63F" d="M228.608 79.58c.96 0 1.8.312 2.52.936.72.624 1.08 1.416 1.08 2.376v.096c0 1.008-.384 1.848-1.152 2.52-.768.672-1.68.992-2.736.992-1.584 0-2.832-.88-3.744-2.64l.912-1.392c.576 1.056 1.224 1.584 1.944 1.584.624 0 1.128-.24 1.512-.72.384-.48.576-1.08.576-1.8v-.288c-.528.384-1.08.576-1.656.576-1.296 0-2.256-.736-2.88-2.208-.432-1.008-.648-2.136-.648-3.384v-.096c0-1.2.256-2.28.768-3.24.512-.96 1.264-1.44 2.256-1.44.672 0 1.248.192 1.728.576v-.48h1.488v5.136h-1.584v-.48c-.432.384-.912.576-1.44.576-.72 0-1.284-.336-1.692-1.008-.408-.672-.612-1.536-.612-2.6v-.096c0-.96.18-1.776.54-2.448.36-.672.864-1.008 1.512-1.008.912 0 1.584.56 2.016 1.68V79.58z" />
            </g>
        </svg>
    );
};

export default HerbalifeLogo;
