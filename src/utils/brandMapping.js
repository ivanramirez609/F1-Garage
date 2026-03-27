export const getBrandAssets = (companyName) => {
  const normalized = companyName ? companyName.toLowerCase().trim() : '';
  
  // Default values
  let color = '#ff8000'; // Default Papaya
  let logoUrl = null;

  if (normalized.includes('google')) {
    color = '#4285F4'; // Google Blue
    logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1024px-Google_2015_logo.svg.png'; // Must use an image texture URL that is reachable and supports CORS
  } else if (normalized.includes('microsoft')) {
    color = '#00a4ef'; // Microsoft Blue
    logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1024px-Microsoft_logo.svg.png';
  } else if (normalized.includes('apple')) {
    color = '#A2AAAD'; // Apple Silver
    logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1024px-Apple_logo_black.svg.png';
  } else if (normalized.includes('red bull') || normalized.includes('redbull')) {
    color = '#001a30'; // Red Bull Racing Blue
    logoUrl = 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fe/Red_Bull_Racing_logo.svg/1024px-Red_Bull_Racing_logo.svg.png';
  } else if (normalized.includes('ferrari')) {
    color = '#ff2800'; // Rosso Corsa
    logoUrl = 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c0/Scuderia_Ferrari_Logo.svg/1024px-Scuderia_Ferrari_Logo.svg.png';
  } else if (normalized.includes('mclaren')) {
    color = '#ff8000'; // Papaya
  } else if (normalized) {
    // Generate an arbitrary recognizable hex color from the input string
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    color = '#' + ('00000'.substring(0, 6 - c.length) + c);
    
    // As a fallback for unknown companies, use the ui-avatars API to generate a temporary text-based logo
    // Using high resolution so it looks decent as a texture decal
    logoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&size=512&background=${color.substring(1)}&color=fff&bold=true`;
  }

  // Fallback to Wikipedia logo or ui-avatar image
  // Note: For CORS constraints in WebGL, these specific wikimedia thumbs usually work.
  // ui-avatars also provides proper CORS headers.
  return { color, logoUrl };
};
