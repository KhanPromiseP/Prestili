'use client';

import { useEditorStore } from '@/stores/editor';
import { generateId } from '@prestili/shared';

export function SlidesPanel() {
  const { history, currentSlideId, setCurrentSlide, addSlide, deleteSlide } = useEditorStore();
  const slides = history.present?.slides || {};

  const slideIds = Object.keys(slides);

  const handleAddSlide = () => {
    addSlide();
  };

  const handleDeleteSlide = (slideId: string) => {
    deleteSlide(slideId);
  };

  const getSlidePreview = (slideId: string) => {
    const slide = slides[slideId];
    if (!slide || !slide.elements || slide.elements.length === 0) {
      return null;
    }
    
    // Get the first text element as title
    const titleElement = slide.elements.find((el: any) => el && el.type === 'text');
    return titleElement ? titleElement.content : null;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-border">
        <h3 className="font-semibold text-xs">Slides</h3>
      </div>

      <div className="flex-1 overflow-auto p-2 space-y-2">
        {slideIds.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-muted-foreground mb-4">No slides yet</p>
            <button
              onClick={handleAddSlide}
              className="text-xs text-primary hover:underline"
            >
              Create your first slide
            </button>
          </div>
        ) : (
          slideIds.map((slideId, index) => {
            const preview = getSlidePreview(slideId);
            return (
              <div
                key={slideId}
                onClick={() => setCurrentSlide(slideId)}
                className={`
                  relative cursor-pointer rounded-md overflow-hidden border-2 transition-all group
                  ${currentSlideId === slideId
                    ? 'border-primary shadow-sm'
                    : 'border-border hover:border-border/80'
                  }
                `}
              >
                <div className="aspect-video bg-white p-1.5">
                  <div className="w-full h-full bg-muted/20 rounded flex items-center justify-center p-2">
                    {preview ? (
                      <div className="text-center">
                        <p className="text-[8px] text-muted-foreground font-medium line-clamp-3 leading-tight">
                          {preview}
                        </p>
                      </div>
                    ) : (
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {index + 1}
                      </span>
                    )}
                  </div>
                </div>
                <div className="bg-background/95 px-2 py-1 text-[10px] text-muted-foreground flex items-center justify-between">
                  <span>Slide {index + 1}</span>
                  {slideIds.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSlide(slideId);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                      title="Delete slide"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-2 border-t border-border">
        <button
          onClick={handleAddSlide}
          className="w-full px-2 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:opacity-90 transition flex items-center justify-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Slide
        </button>
      </div>
    </div>
  );
}
