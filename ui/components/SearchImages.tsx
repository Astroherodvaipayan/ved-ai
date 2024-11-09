import { useState, useEffect } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Message } from './ChatWindow';

type Image = {
  url: string;
  img_src: string;
  title: string;
};

const SearchImages = ({
  query,
  chatHistory,
}: {
  query: string;
  chatHistory: Message[];
}) => {
  const [images, setImages] = useState<Image[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [slides, setSlides] = useState<any[]>([]);

  const LoadingSkeleton = () => (
    <div className="space-y-2 max-w-2xl mx-auto">
      {/* Large main image skeleton */}
      <div className="aspect-[16/10] w-full rounded-lg bg-gradient-to-r from-light-100 to-light-200 dark:from-dark-100 dark:to-dark-200 animate-pulse" />
      
      {/* 2x2 grid of smaller image skeletons */}
      <div className="grid grid-cols-2 gap-2">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className="aspect-[4/3] w-full rounded-lg bg-gradient-to-r from-light-100 to-light-200 dark:from-dark-100 dark:to-dark-200 animate-pulse" 
          />
        ))}
      </div>
    </div>
  );

  const fetchImages = async () => {
    try {
      const chatModelProvider = localStorage.getItem('chatModelProvider');
      const chatModel = localStorage.getItem('chatModel');
      const customOpenAIBaseURL = localStorage.getItem('openAIBaseURL');
      const customOpenAIKey = localStorage.getItem('openAIApiKey');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/images`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: query,
            chatHistory: chatHistory,
            chatModel: {
              provider: chatModelProvider,
              model: chatModel,
              ...(chatModelProvider === 'custom_openai' && {
                customOpenAIBaseURL: customOpenAIBaseURL,
                customOpenAIKey: customOpenAIKey,
              }),
            },
          }),
        },
      );

      const data = await res.json();
      const fetchedImages = data.images ?? [];
      setImages(fetchedImages);
      setSlides(
        fetchedImages.map((image: Image) => ({
          src: image.img_src,
        })),
      );
    } catch (error) {
      console.error('Error fetching images:', error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      fetchImages();
    }
  }, [query]);

  if (!query) return null;

  return (
    <>
      {loading ? (
        <LoadingSkeleton />
      ) : (
        images !== null && images.length > 0 && (
          <>
            <div className="space-y-2 max-w-2xl mx-auto">
              {/* Main featured image */}
              <div className="w-full">
                <img
                  onClick={() => {
                    setOpen(true);
                    setSlides([slides[0], ...slides.slice(1)]);
                  }}
                  src={images[0].img_src}
                  alt={images[0].title}
                  className="aspect-[16/10] w-full object-cover rounded-lg transition duration-200 active:scale-[0.98] hover:scale-[1.01] cursor-zoom-in"
                />
              </div>
              
              {/* 2x2 grid of smaller images */}
              <div className="grid grid-cols-2 gap-2">
                {images.slice(1, 5).map((image, i) => (
                  <div key={i} className="relative">
                    <img
                      onClick={() => {
                        setOpen(true);
                        setSlides([
                          slides[i + 1],
                          ...slides.slice(0, i + 1),
                          ...slides.slice(i + 2),
                        ]);
                      }}
                      src={image.img_src}
                      alt={image.title}
                      className="aspect-[4/3] w-full object-cover rounded-lg transition duration-200 active:scale-[0.98] hover:scale-[1.01] cursor-zoom-in"
                    />
                    {/* View More overlay for the last image if there are more images */}
                    {i === 3 && images.length > 5 && (
                      <div
                        onClick={() => setOpen(true)}
                        className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center cursor-pointer transition duration-200 hover:bg-black/60"
                      >
                        <div className="flex items-center space-x-1 text-white">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 6h16M4 12h16m-7 6h7"
                            />
                          </svg>
                          <span className="text-sm font-medium">View More</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <Lightbox open={open} close={() => setOpen(false)} slides={slides} />
          </>
        )
      )}
    </>
  );
};

export default SearchImages;