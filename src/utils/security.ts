
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .trim();
};

export const validateEventId = (id: string): boolean => {
  return /^[a-zA-Z0-9-_]+$/.test(id) && id.length > 0 && id.length < 50;
};

export const sanitizeImageUrl = (url: string): string => {
  if (!url) return '/placeholder.svg';
  
  // Only allow specific domains or relative URLs
  const allowedDomains = ['placeholder.svg', 'images.unsplash.com', 'picsum.photos'];
  
  try {
    if (url.startsWith('/')) return url; // Relative URLs are OK
    
    const urlObj = new URL(url);
    const isAllowed = allowedDomains.some(domain => 
      urlObj.hostname.includes(domain) || urlObj.hostname === domain
    );
    
    return isAllowed ? url : '/placeholder.svg';
  } catch {
    return '/placeholder.svg';
  }
};
