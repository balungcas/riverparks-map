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
    color: 'from-primary to-purple-600',
    bgPattern: '🌴',
  },
  {
    id: 2,
    icon: Sparkles,
    title: 'AI-Powered Itineraries',
    subtitle: 'Smart Planning Made Easy',
    description: 'Tell us where you want to go, and our AI creates personalized day-by-day itineraries in seconds.',
    color: 'from-accent to-teal-600',
    bgPattern: '✨',
  },
  {
    id: 3,
    icon: MapPin,
    title: 'Explore Hidden Gems',
    subtitle: 'Beyond the Tourist Spots',
    description: 'From secret beaches to local food spots, discover authentic Philippine experiences.',
    color: 'from-explore to-orange-600',
    bgPattern: '🏝️',
  },
  {
    id: 4,
    icon: Heart,
    title: 'Save Your Favorites',
    subtitle: 'Plan Now, Travel Later',
    description: 'Save destinations and itineraries to your profile. Your dream trips are always within reach.',
    color: 'from-shop to-pink-600',
    bgPattern: '❤️',
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
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col overflow-hidden">
      {/* Skip Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="ghost"
          onClick={skipOnboarding}
          className="text-muted-foreground hover:text-foreground"
        >
          Skip
        </Button>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute inset-0 flex flex-wrap justify-center items-center gap-8 text-6xl">
          {Array.from({ length: 50 }).map((_, i) => (
            <span key={i} className="select-none">
              {slide.bgPattern}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex flex-col items-center text-center max-w-md"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className={cn(
                'w-28 h-28 rounded-3xl flex items-center justify-center mb-8 shadow-glow bg-gradient-to-br',
                slide.color
              )}
            >
              <slide.icon className="w-14 h-14 text-white" strokeWidth={1.5} />
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
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentSlide ? 1 : -1);
                setCurrentSlide(index);
              }}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                index === currentSlide
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              )}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-4">
          {currentSlide > 0 && (
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="rounded-full w-12 h-12"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}

          <Button
            onClick={nextSlide}
            className={cn(
              'flex-1 h-14 rounded-xl text-lg font-semibold transition-all duration-300',
              isLastSlide
                ? 'bg-gradient-primary shadow-glow'
                : 'bg-primary hover:bg-primary/90'
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
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
