
import { Button } from '@/components/ui/button';

export const SkipLink = () => {
  const skipToMain = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
    }
  };

  return (
    <Button
      onClick={skipToMain}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-blue-600 text-white px-4 py-2 rounded"
      onFocus={(e) => e.target.classList.remove('sr-only')}
      onBlur={(e) => e.target.classList.add('sr-only')}
    >
      Skip to main content
    </Button>
  );
};
