import React from 'react';

interface LogoSliderProps {
  title?: string;
  logos?: { src: string; alt: string }[];
}

const defaultLogos = [
  { src: '/Logo cebra.png', alt: 'Logo cebra' },
  { src: '/Logo dance.png', alt: 'Logo dance' },
  { src: '/Logo genosur.png', alt: 'Logo genosur' },
  { src: '/Logo magnetica.png', alt: 'Logo magnetica' },
  { src: '/Logo Mizar.png', alt: 'Logo Mizar' },
  { src: '/Logo nibec.png', alt: 'Logo nibec' },
  { src: '/Logo RAD.png', alt: 'Logo RAD' },
  { src: '/Logo roofing.png', alt: 'Logo roofing' },
  { src: '/Logo siar.png', alt: 'Logo siar' },
  { src: '/Logo STC.png', alt: 'Logo STC' },
  { src: '/Logo stunet.png', alt: 'Logo stunet' },
  { src: '/LOGO-CALAS.png', alt: 'LOGO-CALAS' },
  { src: '/logo-dreams.png', alt: 'logo-dreams' },
  { src: '/logo-evolucione.png', alt: 'logo-evolucione' },
  { src: '/logo-glish.png', alt: 'logo-glish' },
  { src: '/logo-web-anato-1-1.png', alt: 'logo-web-anato' },
  { src: '/images.jpg.jpeg', alt: 'images' },
  { src: '/Llogo Milote.png', alt: 'Llogo Milote' },
  { src: '/Logo bioquimica.png', alt: 'Logo bioquimica' }
];

// We double the logos to create a seamless infinite loop effect
const sliderLogos = [...defaultLogos, ...defaultLogos];

const LogoCarousel: React.FC<LogoSliderProps> = ({ 
  title = "Agencias y marcas que confían en nosotros", 
  logos = sliderLogos 
}) => {
  return (
    <section className="py-14 bg-[#081c36] border-y border-[#1d70a2]/15">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <p className="text-center text-[#e0e0e0]/40 text-xs uppercase tracking-widest font-medium mb-8">
            {title}
          </p>
        )}
        <div className="logo-slider-wrapper py-2">
          <div className="logo-slider-track">
            {logos.map((logo, i) => (
              <div key={i} className="logo-slider-item flex-shrink-0">
                <img src={logo.src} alt={logo.alt} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoCarousel;
