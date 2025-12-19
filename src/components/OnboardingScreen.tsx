import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, MapPin, Sparkles, Heart, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const slides = [
  {
    id: 1,
    icon: Plane,
    title: 'Welcome to Gala AI',
    subtitle: 'Your Philippine Adventure Awaits',
    description: 'Discover the beauty of 7,641 islands with AI-powered travel planning tailored just for you.',
    gradient: 'from-primary via-purple-500 to-pink-500',
    emoji: '🌴',
  },
  {
    id: 2,
    icon: Sparkles,
    title: 'AI-Powered Itineraries',
    subtitle: 'Smart Planning Made Easy',
    description: 'Tell us where you want to go, and our AI creates personalized day-by-day itineraries in seconds.',
    gradient: 'from-teal-400 via-cyan-500 to-blue-500',
    emoji: '✨',
  },
  {
    id: 3,
    icon: MapPin,
    title: 'Explore Hidden Gems',
    subtitle: 'Beyond the Tourist Spots',
    description: 'From secret beaches to local food spots, discover authentic Philippine experiences.',
    gradient: 'from-orange-400 via-red-500 to-pink-500',
    emoji: '🏝️',
  },
  {
    id: 4,
    icon: Heart,
    title: 'Save Your Favorites',
    subtitle: 'Plan Now, Travel Later',
    description: 'Save destinations and itineraries to your profile. Your dream trips are always within reach.',
    gradient: 'from-pink-400 via-rose-500 to-red-500',
    emoji: '❤️',
  },
];

const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const skipOnboarding = () => {
    onComplete();
  };

  const slide = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className={cn("absolute inset-0 opacity-10 bg-gradient-to-br", slide.gradient)}
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <div className="absolute inset-0 flex flex-wrap justify-center items-center gap-12 opacity-5">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.span 
              key={i} 
              className="text-6xl select-none"
              animate={{ 
                y: [0, -20, 0],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 3 + (i % 3), 
                repeat: Infinity,
                delay: i * 0.1
              }}
            >
              {slide.emoji}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Skip Button */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-4 right-4 z-10"
      >
        <Button
          variant="ghost"
          onClick={skipOnboarding}
          className="text-muted-foreground hover:text-foreground rounded-full"
        >
          Skip
        </Button>
      </motion.div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex flex-col items-center text-center max-w-sm"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className={cn(
                'w-32 h-32 rounded-3xl flex items-center justify-center mb-8 shadow-2xl bg-gradient-to-br',
                slide.gradient
              )}
            >
              <motion.div
                animate={{ 
                  y: [0, -5, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <slide.icon className="w-16 h-16 text-white" strokeWidth={1.5} />
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-oswald font-semibold mb-2"
            >
              {slide.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-primary font-medium mb-4"
            >
              {slide.subtitle}
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-muted-foreground leading-relaxed"
            >
              {slide.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="px-6 pb-12 space-y-6">
        {/* Progress Dots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setDirection(index > currentSlide ? 1 : -1);
                setCurrentSlide(index);
              }}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                index === currentSlide
                  ? 'w-10 bg-gradient-to-r from-primary to-purple-600'
                  : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              )}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {currentSlide > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevSlide}
                  className="rounded-full w-14 h-14 border-2"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            className="flex-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={nextSlide}
              className={cn(
                'w-full h-14 rounded-2xl text-lg font-semibold transition-all duration-300',
                'bg-gradient-to-r shadow-lg',
                slide.gradient
              )}
            >
              {isLastSlide ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get Started
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
