// Company logo utility - uses Clearbit API with fallbacks
export const getCompanyLogoUrl = (companyName: string): string => {
  if (!companyName) return "";

  // Special cases: Use optimized logo URLs for companies that need better display
  // Using Clearbit with size parameter and ensuring these are handled specially in CSS
  const specialIconUrls: { [key: string]: string } = {
    "Sea Money": "https://logo.clearbit.com/seamoney.com",
    "SeaMoney": "https://logo.clearbit.com/seamoney.com",
    "ST Engineering": "https://logo.clearbit.com/stengg.com",
    "ST Engineering Ltd": "https://logo.clearbit.com/stengg.com",
    "Singapore Technologies Engineering": "https://logo.clearbit.com/stengg.com",
  };

  // Check for special icon URLs first
  const specialUrl = specialIconUrls[companyName];
  if (specialUrl) {
    return specialUrl;
  }

  // Normalize company name for matching
  const normalizedName = companyName.toLowerCase().trim();

  // Check variations for special icons
  for (const [key, value] of Object.entries(specialIconUrls)) {
    if (key.toLowerCase().includes(normalizedName) || normalizedName.includes(key.toLowerCase())) {
      return value;
    }
  }

  // Map of company names to their domains for Clearbit API
  const companyDomainMap: { [key: string]: string } = {
    "Grab": "grab.com",
    "Shopee": "shopee.com",
    "DBS Bank": "dbs.com",
    "Lazada": "lazada.sg",
    "Sea Group": "sea.com",
    "AWS Singapore": "amazon.com",
    "Google Singapore": "google.com",
    "Binance": "binance.com",
    "GovTech Singapore": "tech.gov.sg",
    "Singtel": "singtel.com",
    "OCBC Bank": "ocbc.com",
    "OCBC": "ocbc.com",
    "Carousell": "carousell.com",
    "Foodpanda": "foodpanda.sg",
    "PropertyGuru": "propertyguru.com.sg",
    "GIC": "gic.com.sg",
    "UOB": "uob.com.sg",
    "Meta Singapore": "meta.com",
    "Microsoft Singapore": "microsoft.com",
    "Apple": "apple.com",
    "Amazon": "amazon.com",
    "Facebook": "facebook.com",
    "Netflix": "netflix.com",
    "PayPal": "paypal.com",
    "Salesforce": "salesforce.com",
    "Oracle": "oracle.com",
    "IBM": "ibm.com",
    "Accenture": "accenture.com",
    "Deloitte": "deloitte.com",
    "PwC": "pwc.com",
    "KPMG": "kpmg.com",
    "EY": "ey.com",
    "JPMorgan": "jpmorgan.com",
    "Goldman Sachs": "goldmansachs.com",
    "Morgan Stanley": "morganstanley.com",
    "Citi": "citi.com",
    "HSBC": "hsbc.com",
    "Standard Chartered": "sc.com",
    "Barclays": "barclays.com",
  };

  // Try to find exact match first
  const domain = companyDomainMap[companyName];
  if (domain) {
    return `https://logo.clearbit.com/${domain}`;
  }

  // Try common variations
  for (const [key, value] of Object.entries(companyDomainMap)) {
    if (key.toLowerCase().includes(normalizedName) || normalizedName.includes(key.toLowerCase())) {
      return `https://logo.clearbit.com/${value}`;
    }
  }

  // Fallback: try to construct domain from company name
  const cleanName = companyName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "")
    .replace(/singapore|sg|pte|ltd|inc|corp|corporation/gi, "");
  
  // Try common domain patterns
  const possibleDomains = [
    `${cleanName}.com`,
    `${cleanName}.sg`,
    `${cleanName}.com.sg`,
  ];

  // Return the first one - Clearbit will return 404 if not found, and we can handle that with fallback
  return `https://logo.clearbit.com/${possibleDomains[0]}`;
};

