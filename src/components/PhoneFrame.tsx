import { useState, useRef, useEffect } from 'react';

export const PhoneFrame = ({ children }: { children: React.ReactNode }) => {
  const [scrollbarHeight, setScrollbarHeight] = useState(0);
  const [scrollbarTop, setScrollbarTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = () => {
    const element = contentRef.current;
    if (element) {
      const totalHeight = element.scrollHeight;
      const visibleHeight = element.clientHeight;
      const scrollTop = element.scrollTop;

      const scrollbarHeightRatio = visibleHeight / totalHeight;
      const scrollbarHeight = visibleHeight * scrollbarHeightRatio;
      const scrollbarTop = (scrollTop / totalHeight) * visibleHeight;

      setScrollbarHeight(scrollbarHeight);
      setScrollbarTop(scrollbarTop);

      setIsScrolling(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    }
  };

  useEffect(() => {
    const element = contentRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative mx-auto h-[583px] w-[317px] overflow-hidden rounded-[2rem] border-8 border-foreground">
      <div
        className="absolute right-1 top-0 z-10 w-1 rounded-full bg-muted transition-opacity duration-300"
        style={{
          height: `${scrollbarHeight}px`,
          transform: `translateY(${scrollbarTop}px)`,
          opacity: isScrolling ? 1 : 0,
        }}
      ></div>
      {/* Use absolute positioning for the notch */}
      <div className="absolute left-1/2 top-0 z-20 h-3 w-32 -translate-x-1/2 transform rounded-b-full bg-foreground"></div>
      <div
        ref={contentRef}
        className="relative z-0 h-full overflow-y-scroll p-6 scrollbar-hide"
      >
        {children}
      </div>
    </div>
  );
};
