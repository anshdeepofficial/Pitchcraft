export type Country = {
  name: string;
  code: string;
  flag: string;
  dial: string;
  currency: string;
  symbol: string;
  timezone: string;
  languages: string[];
  dateFormat: string;
};

export const COUNTRIES: Country[] = [
  { name: "India", code: "IN", flag: "🇮🇳", dial: "+91", currency: "INR", symbol: "₹", timezone: "Asia/Kolkata", languages: ["English", "Hindi", "Tamil", "Telugu", "Marathi", "Bengali"], dateFormat: "DD/MM/YYYY" },
  { name: "United States", code: "US", flag: "🇺🇸", dial: "+1", currency: "USD", symbol: "$", timezone: "America/New_York", languages: ["English", "Spanish"], dateFormat: "MM/DD/YYYY" },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧", dial: "+44", currency: "GBP", symbol: "£", timezone: "Europe/London", languages: ["English", "Welsh"], dateFormat: "DD/MM/YYYY" },
  { name: "United Arab Emirates", code: "AE", flag: "🇦🇪", dial: "+971", currency: "AED", symbol: "AED", timezone: "Asia/Dubai", languages: ["Arabic", "English", "Hindi"], dateFormat: "DD/MM/YYYY" },
  { name: "Canada", code: "CA", flag: "🇨🇦", dial: "+1", currency: "CAD", symbol: "C$", timezone: "America/Toronto", languages: ["English", "French"], dateFormat: "DD/MM/YYYY" },
  { name: "Australia", code: "AU", flag: "🇦🇺", dial: "+61", currency: "AUD", symbol: "A$", timezone: "Australia/Sydney", languages: ["English"], dateFormat: "DD/MM/YYYY" },
  { name: "Germany", code: "DE", flag: "🇩🇪", dial: "+49", currency: "EUR", symbol: "€", timezone: "Europe/Berlin", languages: ["German", "English"], dateFormat: "DD.MM.YYYY" },
  { name: "France", code: "FR", flag: "🇫🇷", dial: "+33", currency: "EUR", symbol: "€", timezone: "Europe/Paris", languages: ["French", "English"], dateFormat: "DD/MM/YYYY" },
  { name: "Spain", code: "ES", flag: "🇪🇸", dial: "+34", currency: "EUR", symbol: "€", timezone: "Europe/Madrid", languages: ["Spanish", "Catalan", "English"], dateFormat: "DD/MM/YYYY" },
  { name: "Italy", code: "IT", flag: "🇮🇹", dial: "+39", currency: "EUR", symbol: "€", timezone: "Europe/Rome", languages: ["Italian", "English"], dateFormat: "DD/MM/YYYY" },
  { name: "Netherlands", code: "NL", flag: "🇳🇱", dial: "+31", currency: "EUR", symbol: "€", timezone: "Europe/Amsterdam", languages: ["Dutch", "English"], dateFormat: "DD-MM-YYYY" },
  { name: "Ireland", code: "IE", flag: "🇮🇪", dial: "+353", currency: "EUR", symbol: "€", timezone: "Europe/Dublin", languages: ["English", "Irish"], dateFormat: "DD/MM/YYYY" },
  { name: "Singapore", code: "SG", flag: "🇸🇬", dial: "+65", currency: "SGD", symbol: "S$", timezone: "Asia/Singapore", languages: ["English", "Mandarin", "Malay", "Tamil"], dateFormat: "DD/MM/YYYY" },
  { name: "Saudi Arabia", code: "SA", flag: "🇸🇦", dial: "+966", currency: "SAR", symbol: "SAR", timezone: "Asia/Riyadh", languages: ["Arabic", "English"], dateFormat: "DD/MM/YYYY" },
  { name: "Qatar", code: "QA", flag: "🇶🇦", dial: "+974", currency: "QAR", symbol: "QAR", timezone: "Asia/Qatar", languages: ["Arabic", "English"], dateFormat: "DD/MM/YYYY" },
  { name: "South Africa", code: "ZA", flag: "🇿🇦", dial: "+27", currency: "ZAR", symbol: "R", timezone: "Africa/Johannesburg", languages: ["English", "Afrikaans", "Zulu"], dateFormat: "YYYY/MM/DD" },
  { name: "Nigeria", code: "NG", flag: "🇳🇬", dial: "+234", currency: "NGN", symbol: "₦", timezone: "Africa/Lagos", languages: ["English"], dateFormat: "DD/MM/YYYY" },
  { name: "Kenya", code: "KE", flag: "🇰🇪", dial: "+254", currency: "KES", symbol: "KSh", timezone: "Africa/Nairobi", languages: ["English", "Swahili"], dateFormat: "DD/MM/YYYY" },
  { name: "Brazil", code: "BR", flag: "🇧🇷", dial: "+55", currency: "BRL", symbol: "R$", timezone: "America/Sao_Paulo", languages: ["Portuguese", "English"], dateFormat: "DD/MM/YYYY" },
  { name: "Mexico", code: "MX", flag: "🇲🇽", dial: "+52", currency: "MXN", symbol: "MX$", timezone: "America/Mexico_City", languages: ["Spanish", "English"], dateFormat: "DD/MM/YYYY" },
  { name: "Japan", code: "JP", flag: "🇯🇵", dial: "+81", currency: "JPY", symbol: "¥", timezone: "Asia/Tokyo", languages: ["Japanese", "English"], dateFormat: "YYYY/MM/DD" },
  { name: "China", code: "CN", flag: "🇨🇳", dial: "+86", currency: "CNY", symbol: "¥", timezone: "Asia/Shanghai", languages: ["Mandarin", "English"], dateFormat: "YYYY-MM-DD" },
  { name: "Indonesia", code: "ID", flag: "🇮🇩", dial: "+62", currency: "IDR", symbol: "Rp", timezone: "Asia/Jakarta", languages: ["Indonesian", "English"], dateFormat: "DD/MM/YYYY" },
  { name: "Malaysia", code: "MY", flag: "🇲🇾", dial: "+60", currency: "MYR", symbol: "RM", timezone: "Asia/Kuala_Lumpur", languages: ["Malay", "English", "Mandarin"], dateFormat: "DD/MM/YYYY" },
  { name: "Philippines", code: "PH", flag: "🇵🇭", dial: "+63", currency: "PHP", symbol: "₱", timezone: "Asia/Manila", languages: ["English", "Filipino"], dateFormat: "MM/DD/YYYY" },
  { name: "Pakistan", code: "PK", flag: "🇵🇰", dial: "+92", currency: "PKR", symbol: "₨", timezone: "Asia/Karachi", languages: ["Urdu", "English"], dateFormat: "DD/MM/YYYY" },
  { name: "Bangladesh", code: "BD", flag: "🇧🇩", dial: "+880", currency: "BDT", symbol: "৳", timezone: "Asia/Dhaka", languages: ["Bengali", "English"], dateFormat: "DD/MM/YYYY" },
  { name: "Sri Lanka", code: "LK", flag: "🇱🇰", dial: "+94", currency: "LKR", symbol: "Rs", timezone: "Asia/Colombo", languages: ["Sinhala", "Tamil", "English"], dateFormat: "DD/MM/YYYY" },
  { name: "New Zealand", code: "NZ", flag: "🇳🇿", dial: "+64", currency: "NZD", symbol: "NZ$", timezone: "Pacific/Auckland", languages: ["English", "Māori"], dateFormat: "DD/MM/YYYY" },
  { name: "Switzerland", code: "CH", flag: "🇨🇭", dial: "+41", currency: "CHF", symbol: "CHF", timezone: "Europe/Zurich", languages: ["German", "French", "Italian", "English"], dateFormat: "DD.MM.YYYY" },
  { name: "Sweden", code: "SE", flag: "🇸🇪", dial: "+46", currency: "SEK", symbol: "kr", timezone: "Europe/Stockholm", languages: ["Swedish", "English"], dateFormat: "YYYY-MM-DD" },
  { name: "Norway", code: "NO", flag: "🇳🇴", dial: "+47", currency: "NOK", symbol: "kr", timezone: "Europe/Oslo", languages: ["Norwegian", "English"], dateFormat: "DD.MM.YYYY" },
  { name: "Denmark", code: "DK", flag: "🇩🇰", dial: "+45", currency: "DKK", symbol: "kr", timezone: "Europe/Copenhagen", languages: ["Danish", "English"], dateFormat: "DD-MM-YYYY" },
  { name: "Poland", code: "PL", flag: "🇵🇱", dial: "+48", currency: "PLN", symbol: "zł", timezone: "Europe/Warsaw", languages: ["Polish", "English"], dateFormat: "DD.MM.YYYY" },
  { name: "Portugal", code: "PT", flag: "🇵🇹", dial: "+351", currency: "EUR", symbol: "€", timezone: "Europe/Lisbon", languages: ["Portuguese", "English"], dateFormat: "DD/MM/YYYY" },
  { name: "Turkey", code: "TR", flag: "🇹🇷", dial: "+90", currency: "TRY", symbol: "₺", timezone: "Europe/Istanbul", languages: ["Turkish", "English"], dateFormat: "DD.MM.YYYY" },
  { name: "Egypt", code: "EG", flag: "🇪🇬", dial: "+20", currency: "EGP", symbol: "E£", timezone: "Africa/Cairo", languages: ["Arabic", "English"], dateFormat: "DD/MM/YYYY" },
  { name: "Argentina", code: "AR", flag: "🇦🇷", dial: "+54", currency: "ARS", symbol: "AR$", timezone: "America/Argentina/Buenos_Aires", languages: ["Spanish", "English"], dateFormat: "DD/MM/YYYY" },
  { name: "South Korea", code: "KR", flag: "🇰🇷", dial: "+82", currency: "KRW", symbol: "₩", timezone: "Asia/Seoul", languages: ["Korean", "English"], dateFormat: "YYYY.MM.DD" },
  { name: "Vietnam", code: "VN", flag: "🇻🇳", dial: "+84", currency: "VND", symbol: "₫", timezone: "Asia/Ho_Chi_Minh", languages: ["Vietnamese", "English"], dateFormat: "DD/MM/YYYY" },
  { name: "Thailand", code: "TH", flag: "🇹🇭", dial: "+66", currency: "THB", symbol: "฿", timezone: "Asia/Bangkok", languages: ["Thai", "English"], dateFormat: "DD/MM/YYYY" },
  { name: "Israel", code: "IL", flag: "🇮🇱", dial: "+972", currency: "ILS", symbol: "₪", timezone: "Asia/Jerusalem", languages: ["Hebrew", "English", "Arabic"], dateFormat: "DD/MM/YYYY" },
];

export const POPULAR_INDUSTRIES = [
  "E-commerce",
  "Restaurant",
  "Real Estate",
  "Healthcare",
  "Software",
  "Education",
  "Beauty Salon",
  "Fitness",
  "Photography",
  "Consulting",
];

export const INDUSTRIES = [
  "Accounting", "Advertising", "Agriculture", "Air Conditioning & HVAC", "Airline", "Amusement Park",
  "Animation Studio", "Antiques", "Apparel", "Architecture", "Art Gallery", "Automobile",
  "Auto Repair", "Bakery", "Banking", "Bar & Pub", "Barbershop", "Beauty Salon", "Biotechnology",
  "Blockchain & Web3", "Boat & Marine", "Bookstore", "Brewery", "Bridal", "Broadcasting",
  "Building Materials", "Business Coaching", "Cafe", "Car Dealership", "Car Rental", "Carpentry",
  "Catering", "Charity & NGO", "Chemicals", "Childcare & Daycare", "Chiropractic", "Cleaning Services",
  "Cloud Services", "Coaching Institute", "Coffee Roastery", "Construction", "Consulting",
  "Content Creation", "Cosmetics", "Courier & Delivery", "Craft & Handmade", "Creative Agency",
  "Cryptocurrency", "Cybersecurity", "Dairy", "Dance Studio", "Data Analytics", "Dental Clinic",
  "Dermatology", "Design Studio", "Digital Marketing", "Distillery", "Driving School", "Drone Services",
  "E-commerce", "Education", "Electrical Services", "Electronics", "Employment Agency", "Energy",
  "Engineering", "Entertainment", "Environmental Services", "Event Management", "Eyewear",
  "Farming", "Fashion", "Film Production", "Finance", "Financial Advisory", "Fintech", "Fitness",
  "Florist", "Food & Beverage", "Food Truck", "Footwear", "Forestry", "Franchise", "Freight & Logistics",
  "Furniture", "Gaming", "Gardening & Landscaping", "Gym", "Graphic Design", "Grocery", "Hair Salon",
  "Hardware Store", "Healthcare", "Hearing Care", "Home Decor", "Home Services", "Hospital",
  "Hospitality", "Hotel", "Human Resources", "Import & Export", "Industrial Equipment", "Influencer",
  "Information Technology", "Insurance", "Interior Design", "Investment", "IT Support", "Jewelry",
  "Journalism", "Language School", "Laundry Services", "Law Firm", "Legal Services", "Library",
  "Life Coaching", "Logistics", "Luxury Goods", "Machinery", "Manufacturing", "Marketing", "Massage Therapy",
  "Media", "Medical Devices", "Mental Health", "Mining", "Mobile App Development", "Moving Services",
  "Museum", "Music", "Music School", "Nail Salon", "Nonprofit", "Nutrition", "Optometry", "Packaging",
  "Painting Services", "Pet Care", "Pet Grooming", "Pharmacy", "Photography", "Physiotherapy",
  "Plumbing", "Podcasting", "Print Shop", "Property Management", "Public Relations", "Publishing",
  "Real Estate", "Recruitment", "Recycling", "Rehabilitation", "Renewable Energy", "Restaurant",
  "Retail", "Roofing", "SaaS", "Security Services", "Shipping", "Skincare", "Social Media Agency",
  "Software", "Solar Energy", "Spa & Wellness", "Sports", "Sports Club", "Staffing", "Startup Studio",
  "Storage", "Supermarket", "Tailoring", "Tattoo Studio", "Taxi & Rideshare", "Telecommunications",
  "Textiles", "Theatre", "Therapy & Counselling", "Ticketing", "Tourism", "Toys", "Training & Development",
  "Translation Services", "Transport", "Travel", "Travel Agency", "Trucking", "Tutoring", "Used Cars",
  "Vending", "Veterinary", "Video Editing", "Video Production", "Virtual Assistant", "Waste Management",
  "Watch & Horology", "Web Design", "Web Development", "Wedding Planning", "Wellness", "Wholesale",
  "Wine & Spirits", "Woodworking", "Yoga Studio", "Youth Programs",
];

type IndustryProfile = {
  services: string[];
  products: string[];
  audience: string[];
  goals: string[];
  pages: string[];
  integrations: string[];
};

const GENERIC: IndustryProfile = {
  services: ["Consultation", "Custom Solutions", "Ongoing Support", "Maintenance", "Training"],
  products: ["Service Packages", "Subscription Plans", "Gift Vouchers"],
  audience: ["Local Customers", "Small Businesses", "Professionals", "Retail Customers"],
  goals: ["Generate Leads", "Brand Awareness", "Increase Calls", "Collect Emails"],
  pages: ["Home", "About", "Services", "Contact"],
  integrations: ["Contact form", "Google Analytics", "WhatsApp chat", "Newsletter signup"],
};

export const INDUSTRY_PROFILES: Record<string, Partial<IndustryProfile>> = {
  "Video Editing": {
    services: ["Wedding Editing", "Music Videos", "Commercial Ads", "YouTube Editing", "Color Grading", "Motion Graphics", "Podcast Editing", "Short-form Reels", "Subtitling"],
    products: ["Editing Packages", "LUT Packs", "Template Bundles", "Retainer Plans"],
    audience: ["Content Creators", "Businesses", "Wedding Couples", "Musicians", "Agencies"],
    goals: ["Showcase Work", "Generate Leads", "Sell Products", "Brand Awareness"],
    pages: ["Home", "Portfolio", "Services", "Pricing", "About", "Contact"],
    integrations: ["Vimeo / YouTube embeds", "Calendly booking", "Stripe payments", "File upload portal"],
  },
  Photography: {
    services: ["Wedding Photography", "Portrait Sessions", "Product Photography", "Event Coverage", "Real Estate Photography", "Photo Retouching"],
    products: ["Photo Albums", "Prints", "Session Packages", "Presets"],
    audience: ["Wedding Couples", "Families", "Businesses", "Luxury Buyers"],
    goals: ["Showcase Work", "Online Booking", "Generate Leads"],
    pages: ["Home", "Galleries", "Services", "Pricing", "About", "Contact"],
    integrations: ["Gallery delivery", "Online booking", "Payments", "Instagram feed"],
  },
  "Graphic Design": {
    services: ["Logo Design", "Brand Identity", "Packaging Design", "Social Media Creatives", "Print Design", "Illustration"],
    products: ["Brand Kits", "Template Packs", "Design Retainers"],
    audience: ["Startups", "Small Businesses", "Agencies", "Content Creators"],
    goals: ["Showcase Work", "Generate Leads", "Sell Products"],
    pages: ["Home", "Work", "Services", "Process", "About", "Contact"],
    integrations: ["Portfolio CMS", "Payments", "Project intake form"],
  },
  Restaurant: {
    services: ["Dine-in", "Takeaway", "Home Delivery", "Catering", "Private Events", "Table Reservations"],
    products: ["Menu Items", "Gift Cards", "Meal Boxes", "Combo Deals"],
    audience: ["Local Customers", "Families", "Professionals", "Tourists"],
    goals: ["Online Booking", "Increase Sales", "Increase Calls", "Brand Awareness"],
    pages: ["Home", "Menu", "Reservations", "Gallery", "About", "Contact"],
    integrations: ["Table reservation system", "Online ordering", "Google Maps", "Payments"],
  },
  Hospital: {
    services: ["Emergency Care", "Outpatient Consultation", "Diagnostics", "Surgery", "Health Checkups", "Telemedicine"],
    products: ["Health Packages", "Insurance Plans", "Wellness Programs"],
    audience: ["Local Customers", "Families", "Senior Citizens", "Doctors", "Corporates"],
    goals: ["Appointment Booking", "Increase Calls", "Brand Awareness", "Customer Support"],
    pages: ["Home", "Departments", "Doctors", "Appointments", "Patient Info", "Contact"],
    integrations: ["Appointment booking", "Doctor directory", "Patient portal", "Google Maps"],
  },
  Healthcare: {
    services: ["Consultations", "Diagnostics", "Preventive Care", "Telehealth", "Follow-up Care"],
    products: ["Care Plans", "Health Packages"],
    audience: ["Local Customers", "Families", "Senior Citizens", "Professionals"],
    goals: ["Appointment Booking", "Increase Calls", "Generate Leads"],
    pages: ["Home", "Services", "Team", "Appointments", "Contact"],
    integrations: ["Appointment booking", "Secure forms", "Payments"],
  },
  School: {
    services: ["Admissions", "Curriculum Programs", "Extracurricular Activities", "Transport", "Counselling"],
    products: ["Courses", "Study Material", "Summer Programs"],
    audience: ["Parents", "Students", "Children", "Local Customers"],
    goals: ["Generate Leads", "Brand Awareness", "Collect Emails", "Increase Calls"],
    pages: ["Home", "About", "Academics", "Admissions", "Faculty", "Gallery", "Contact"],
    integrations: ["Admission enquiry form", "Events calendar", "Parent portal"],
  },
  Education: {
    services: ["Courses", "Tutoring", "Workshops", "Certification Programs", "Career Guidance"],
    products: ["Online Courses", "Ebooks", "Membership Plans"],
    audience: ["Students", "Parents", "Professionals", "Freelancers"],
    goals: ["Generate Leads", "Sell Products", "Collect Emails", "Brand Awareness"],
    pages: ["Home", "Courses", "Instructors", "Pricing", "Blog", "Contact"],
    integrations: ["LMS", "Payments", "Email marketing", "Live class scheduling"],
  },
  Hotel: {
    services: ["Room Booking", "Airport Transfers", "Event Hosting", "Spa & Wellness", "Restaurant"],
    products: ["Room Types", "Packages", "Gift Vouchers"],
    audience: ["Tourists", "Business Travellers", "Luxury Buyers", "International Customers"],
    goals: ["Online Booking", "Increase Sales", "Brand Awareness"],
    pages: ["Home", "Rooms", "Amenities", "Gallery", "Offers", "Booking", "Contact"],
    integrations: ["Booking engine", "Payments", "Google Maps", "Reviews"],
  },
  Automobile: {
    services: ["Vehicle Sales", "Servicing", "Repairs", "Insurance Assistance", "Test Drives", "Financing"],
    products: ["New Vehicles", "Used Vehicles", "Spare Parts", "Accessories"],
    audience: ["Local Customers", "Budget Buyers", "Luxury Buyers", "Businesses"],
    goals: ["Generate Leads", "Increase Calls", "Online Booking", "Showcase Work"],
    pages: ["Home", "Inventory", "Services", "Finance", "Book a Test Drive", "Contact"],
    integrations: ["Inventory listings", "Test-drive booking", "Finance calculator"],
  },
  Fashion: {
    services: ["Styling", "Custom Tailoring", "Alterations", "Lookbook Shoots"],
    products: ["Clothing", "Accessories", "Footwear", "Seasonal Collections"],
    audience: ["Women", "Men", "Luxury Buyers", "Budget Buyers", "International Customers"],
    goals: ["Sell Products", "Increase Sales", "Brand Awareness", "Collect Emails"],
    pages: ["Home", "Shop", "Collections", "Lookbook", "About", "Cart & Checkout", "Contact"],
    integrations: ["Shopping cart", "Payments", "Shipping", "Instagram shopping"],
  },
  "Beauty Salon": {
    services: ["Haircut & Styling", "Coloring", "Facials", "Manicure & Pedicure", "Bridal Makeup", "Spa Treatments"],
    products: ["Hair Care Products", "Skincare Products", "Gift Cards", "Memberships"],
    audience: ["Women", "Men", "Local Customers", "Wedding Couples"],
    goals: ["Appointment Booking", "Increase Calls", "Brand Awareness", "Sell Products"],
    pages: ["Home", "Services", "Pricing", "Gallery", "Book Now", "Contact"],
    integrations: ["Online booking", "Payments", "SMS reminders", "Google Reviews"],
  },
  "Law Firm": {
    services: ["Legal Consultation", "Corporate Law", "Family Law", "Litigation", "Contract Drafting", "Compliance"],
    products: ["Retainer Plans", "Document Templates"],
    audience: ["Businesses", "Professionals", "Large Enterprises", "Local Customers"],
    goals: ["Generate Leads", "Increase Calls", "Brand Awareness"],
    pages: ["Home", "Practice Areas", "Attorneys", "Insights", "Contact"],
    integrations: ["Case enquiry form", "Consultation booking", "Secure document upload"],
  },
  Construction: {
    services: ["Residential Construction", "Commercial Projects", "Renovation", "Project Management", "Interior Fit-out"],
    products: ["Project Packages", "Material Supply"],
    audience: ["Businesses", "Local Customers", "Government", "Large Enterprises"],
    goals: ["Generate Leads", "Showcase Work", "Increase Calls"],
    pages: ["Home", "Projects", "Services", "Process", "About", "Contact"],
    integrations: ["Project gallery", "Quote request form", "Google Maps"],
  },
  Travel: {
    services: ["Tour Packages", "Flight Booking", "Visa Assistance", "Hotel Booking", "Custom Itineraries"],
    products: ["Holiday Packages", "Day Tours", "Travel Insurance"],
    audience: ["Tourists", "Families", "International Customers", "Professionals"],
    goals: ["Online Booking", "Generate Leads", "Increase Sales"],
    pages: ["Home", "Destinations", "Packages", "Offers", "Blog", "Contact"],
    integrations: ["Booking engine", "Payments", "Enquiry form", "Reviews"],
  },
  "Real Estate": {
    services: ["Property Sales", "Rentals", "Property Management", "Valuation", "Investment Advisory"],
    products: ["Residential Listings", "Commercial Listings", "Plots"],
    audience: ["Local Customers", "Luxury Buyers", "Businesses", "International Customers"],
    goals: ["Generate Leads", "Increase Calls", "Showcase Work"],
    pages: ["Home", "Listings", "Property Detail", "Agents", "Contact"],
    integrations: ["Property search & filters", "Map view", "Lead capture", "Virtual tours"],
  },
  Finance: {
    services: ["Financial Planning", "Tax Advisory", "Loans", "Investment Management", "Bookkeeping"],
    products: ["Advisory Plans", "Investment Products"],
    audience: ["Professionals", "Small Businesses", "Large Enterprises", "Senior Citizens"],
    goals: ["Generate Leads", "Collect Emails", "Brand Awareness"],
    pages: ["Home", "Services", "Calculators", "Insights", "About", "Contact"],
    integrations: ["Calculators", "Secure enquiry form", "Appointment booking"],
  },
  Software: {
    services: ["Custom Development", "Product Design", "Integrations", "Support & SLA", "Cloud Migration"],
    products: ["SaaS Plans", "Mobile Apps", "APIs", "Add-ons"],
    audience: ["Businesses", "Startups", "Large Enterprises", "Developers"],
    goals: ["Generate Leads", "Collect Emails", "Sell Products", "Brand Awareness"],
    pages: ["Home", "Product", "Features", "Pricing", "Docs", "Blog", "Contact"],
    integrations: ["Payments", "Auth", "Analytics", "CRM", "Documentation"],
  },
  "E-commerce": {
    services: ["Order Fulfilment", "Returns & Exchange", "Customer Support", "Wholesale Supply"],
    products: ["Product Catalog", "Bundles", "Gift Cards", "Subscriptions"],
    audience: ["Retail Customers", "Budget Buyers", "Luxury Buyers", "International Customers"],
    goals: ["Sell Products", "Increase Sales", "Collect Emails", "Brand Awareness"],
    pages: ["Home", "Shop", "Product Detail", "Cart", "Checkout", "Account", "Contact"],
    integrations: ["Payments", "Shipping", "Inventory", "Reviews", "Abandoned cart emails"],
  },
  NGO: {
    services: ["Community Programs", "Volunteering", "Awareness Campaigns", "Fundraising Events"],
    products: ["Donation Tiers", "Memberships", "Merchandise"],
    audience: ["Government", "Businesses", "Local Customers", "Students"],
    goals: ["Collect Emails", "Brand Awareness", "Generate Leads"],
    pages: ["Home", "Our Work", "Impact", "Donate", "Volunteer", "Contact"],
    integrations: ["Donation payments", "Volunteer signup", "Newsletter"],
  },
  Manufacturing: {
    services: ["Contract Manufacturing", "Custom Fabrication", "Quality Assurance", "Bulk Supply"],
    products: ["Product Lines", "Components", "Spare Parts"],
    audience: ["Businesses", "Large Enterprises", "Government", "International Customers"],
    goals: ["Generate Leads", "Showcase Work", "Increase Calls"],
    pages: ["Home", "Capabilities", "Products", "Certifications", "About", "Contact"],
    integrations: ["RFQ form", "Product catalog", "Downloadable spec sheets"],
  },
  Entertainment: {
    services: ["Event Production", "Artist Management", "Live Shows", "Content Licensing"],
    products: ["Tickets", "Merchandise", "Media Content"],
    audience: ["Local Customers", "Content Creators", "Businesses", "Gamers"],
    goals: ["Sell Products", "Brand Awareness", "Collect Emails"],
    pages: ["Home", "Events", "Artists", "Tickets", "Media", "Contact"],
    integrations: ["Ticketing", "Payments", "Media gallery"],
  },
  Media: {
    services: ["News Coverage", "Sponsored Content", "Advertising", "Video Production"],
    products: ["Ad Placements", "Subscriptions", "Newsletters"],
    audience: ["Businesses", "Professionals", "Local Customers", "International Customers"],
    goals: ["Collect Emails", "Brand Awareness", "Increase Sales"],
    pages: ["Home", "Articles", "Category", "Advertise", "About", "Contact"],
    integrations: ["CMS", "Newsletter", "Ad slots", "Search"],
  },
  Music: {
    services: ["Recording", "Mixing & Mastering", "Live Performance", "Music Lessons"],
    products: ["Albums", "Beat Packs", "Merchandise", "Tickets"],
    audience: ["Content Creators", "Students", "Local Customers", "Businesses"],
    goals: ["Showcase Work", "Sell Products", "Brand Awareness"],
    pages: ["Home", "Music", "Shows", "Store", "About", "Contact"],
    integrations: ["Audio player", "Streaming links", "Store & payments", "Tour dates"],
  },
  Fitness: {
    services: ["Personal Training", "Group Classes", "Nutrition Coaching", "Online Programs"],
    products: ["Memberships", "Class Passes", "Supplements", "Training Plans"],
    audience: ["Professionals", "Students", "Women", "Men", "Local Customers"],
    goals: ["Online Booking", "Generate Leads", "Sell Products", "Increase Calls"],
    pages: ["Home", "Classes", "Trainers", "Pricing", "Schedule", "Contact"],
    integrations: ["Class booking", "Membership payments", "Schedule calendar"],
  },
  Gaming: {
    services: ["Game Development", "Esports Coaching", "Streaming Production", "Community Management"],
    products: ["Games", "In-game Items", "Merchandise", "Memberships"],
    audience: ["Gamers", "Content Creators", "Students", "International Customers"],
    goals: ["Brand Awareness", "Sell Products", "Collect Emails"],
    pages: ["Home", "Games", "Community", "Store", "News", "Contact"],
    integrations: ["Discord", "Twitch/YouTube embeds", "Store & payments", "Leaderboards"],
  },
  Agriculture: {
    services: ["Crop Supply", "Farm Consulting", "Equipment Rental", "Distribution"],
    products: ["Produce", "Seeds", "Fertilizers", "Equipment"],
    audience: ["Businesses", "Government", "Local Customers", "International Customers"],
    goals: ["Generate Leads", "Increase Calls", "Sell Products"],
    pages: ["Home", "Products", "Services", "Certifications", "Contact"],
    integrations: ["Enquiry form", "Product catalog", "WhatsApp"],
  },
  Logistics: {
    services: ["Freight Forwarding", "Warehousing", "Last-mile Delivery", "Customs Clearance", "Tracking"],
    products: ["Shipping Plans", "Storage Packages"],
    audience: ["Businesses", "Large Enterprises", "Retail Customers", "International Customers"],
    goals: ["Generate Leads", "Customer Support", "Increase Calls"],
    pages: ["Home", "Services", "Track Shipment", "Network", "Get a Quote", "Contact"],
    integrations: ["Shipment tracking", "Quote calculator", "CRM"],
  },
  Marketing: {
    services: ["SEO", "Paid Ads", "Social Media Management", "Content Marketing", "Email Marketing", "Analytics"],
    products: ["Retainer Packages", "Audits", "Campaign Bundles"],
    audience: ["Small Businesses", "Large Enterprises", "Startups", "Businesses"],
    goals: ["Generate Leads", "Collect Emails", "Brand Awareness", "Showcase Work"],
    pages: ["Home", "Services", "Case Studies", "Pricing", "Blog", "Contact"],
    integrations: ["CRM", "Booking", "Analytics dashboards", "Newsletter"],
  },
  Consulting: {
    services: ["Strategy Consulting", "Process Audits", "Workshops", "Implementation Support"],
    products: ["Advisory Retainers", "Playbooks", "Assessments"],
    audience: ["Businesses", "Large Enterprises", "Government", "Startups"],
    goals: ["Generate Leads", "Collect Emails", "Brand Awareness"],
    pages: ["Home", "Services", "Case Studies", "Insights", "About", "Contact"],
    integrations: ["Consultation booking", "Lead capture", "Newsletter"],
  },
};

function uniq(list: string[]) {
  return Array.from(new Set(list));
}

export function profileFor(industries: string[]): IndustryProfile {
  const picked = industries.map((i) => INDUSTRY_PROFILES[i]).filter(Boolean) as Partial<IndustryProfile>[];
  if (!picked.length) return GENERIC;
  return {
    services: uniq(picked.flatMap((p) => p.services ?? GENERIC.services)),
    products: uniq(picked.flatMap((p) => p.products ?? GENERIC.products)),
    audience: uniq(picked.flatMap((p) => p.audience ?? GENERIC.audience)),
    goals: uniq(picked.flatMap((p) => p.goals ?? GENERIC.goals)),
    pages: uniq(picked.flatMap((p) => p.pages ?? GENERIC.pages)),
    integrations: uniq(picked.flatMap((p) => p.integrations ?? GENERIC.integrations)),
  };
}

export const AUDIENCES = [
  "Students", "Parents", "Professionals", "Businesses", "Government", "Freelancers", "Doctors",
  "Restaurants", "Retail Customers", "Luxury Buyers", "Budget Buyers", "Gamers", "Content Creators",
  "Small Businesses", "Large Enterprises", "Senior Citizens", "Children", "Women", "Men",
  "Local Customers", "International Customers", "Tourists", "Families", "Startups", "Wedding Couples",
  "Business Travellers", "Developers", "Musicians", "Agencies", "Corporates",
];

export const BUSINESS_GOALS = [
  "Generate Leads", "Increase Sales", "Sell Products", "Online Booking", "Portfolio Website",
  "Brand Awareness", "Customer Support", "Appointment Booking", "Increase Calls", "Showcase Work",
  "Collect Emails", "Recruit Staff", "Educate Customers", "Expand to New Markets",
];

export const SEO_GOALS = [
  "Appear on Google", "Rank Higher", "Get More Visitors", "Local SEO", "National SEO",
  "International SEO", "More Phone Calls", "More Website Traffic", "Beat a Competitor",
  "Show Up on Google Maps",
];

export const MARKETING_GOALS = [
  "Instagram Growth", "Facebook Ads", "Google Ads", "Email Marketing", "Lead Generation",
  "Brand Awareness", "Newsletter", "Retargeting", "YouTube Content", "WhatsApp Marketing",
  "Influencer Collaborations", "Referral Program",
];

export const DEADLINE_PRESETS = ["ASAP", "1 Week", "2 Weeks", "1 Month", "2 Months", "3 Months"];

export const PAGE_COUNTS = ["1", "3", "5", "7", "10", "15", "20+"];

export const DESIGN_STYLES: { name: string; hint: string; className: string }[] = [
  { name: "Minimal", hint: "Lots of white space, quiet type", className: "style-minimal" },
  { name: "Modern", hint: "Clean grid, confident accents", className: "style-modern" },
  { name: "Luxury", hint: "Deep tones, gold detailing", className: "style-luxury" },
  { name: "Corporate", hint: "Trustworthy blues, structured", className: "style-corporate" },
  { name: "Apple Style", hint: "Big product shots, soft grey", className: "style-apple" },
  { name: "Glassmorphism", hint: "Frosted layers, blur depth", className: "style-glass" },
  { name: "Material Design", hint: "Elevation, bold primaries", className: "style-material" },
  { name: "Dark Theme", hint: "Low-light UI, neon accents", className: "style-dark" },
  { name: "Creative", hint: "Playful shapes, motion", className: "style-creative" },
  { name: "Bold", hint: "Huge type, high contrast", className: "style-bold" },
  { name: "Elegant", hint: "Serif headings, muted palette", className: "style-elegant" },
  { name: "Neumorphism", hint: "Soft extruded surfaces", className: "style-neu" },
  { name: "Random (AI Recommended)", hint: "Let the AI choose and justify", className: "style-ai" },
];

export const BRAND_PERSONALITIES = [
  "Professional", "Friendly", "Luxury", "Premium", "Playful", "Bold", "Innovative", "Minimal",
  "Elegant", "Modern", "Classic", "Trustworthy", "Energetic", "Calm", "AI Recommended",
];

export const COLOR_PALETTES: { name: string; colors: string[] }[] = [
  { name: "Ocean Deep", colors: ["#0C2340", "#1A4A6E", "#2D8A9E", "#5CBDB9"] },
  { name: "Noir & Gold", colors: ["#0D0D0D", "#1A1A1A", "#C9A84C", "#F0D78C"] },
  { name: "Warm Sand", colors: ["#FAF8F5", "#F0EBE3", "#C9B99A", "#8B7355"] },
  { name: "Forest & Moss", colors: ["#1A3C2A", "#2D5A3D", "#5A8A5C", "#A0C49D"] },
  { name: "Electric Coral", colors: ["#FF6B6B", "#EE5A70", "#C44569", "#574B90"] },
  { name: "Cloud White", colors: ["#FAFBFC", "#E8ECF1", "#94A3B8", "#3B82F6"] },
  { name: "Emerald Prestige", colors: ["#064E3B", "#0D7A5F", "#C9A84C", "#F5F0E0"] },
  { name: "Midnight Indigo", colors: ["#0A0A1A", "#141432", "#1E1E5A", "#4F46E5"] },
];

export const CMS_OPTIONS: { value: string; label: string; hint: string }[] = [
  { value: "AI decides", label: "I don't know — let the AI decide", hint: "We recommend the best fit for your budget and team." },
  { value: "Easy drag-and-drop editor", label: "Easy drag-and-drop editor", hint: "Edit text and images visually, no technical skills." },
  { value: "WordPress", label: "WordPress", hint: "Popular blogging and content platform with plugins." },
  { value: "Shopify", label: "Shopify", hint: "Best for selling products online with built-in checkout." },
  { value: "Custom Website", label: "Custom website", hint: "Fully bespoke build, fastest and most flexible." },
  { value: "Webflow", label: "Webflow", hint: "Visual builder with designer-level control." },
  { value: "Wix", label: "Wix", hint: "Beginner-friendly, all-in-one hosted builder." },
  { value: "Squarespace", label: "Squarespace", hint: "Polished templates, great for simple sites." },
];

export const CONTACT_METHODS = ["Email", "Phone", "WhatsApp", "Video Call", "In Person"];

export const CURRENCIES = [
  "INR", "USD", "EUR", "GBP", "AED", "AUD", "CAD", "SGD", "SAR", "ZAR", "NGN", "BRL", "JPY",
  "CNY", "MYR", "PHP", "PKR", "BDT", "NZD", "CHF", "SEK", "TRY", "KRW", "THB", "ILS", "QAR",
];

export const PROGRESS_STEPS = [
  "Reading business details",
  "Analyzing industry",
  "Researching competitors",
  "Building sitemap",
  "Designing UI strategy",
  "Selecting typography",
  "Creating color palette",
  "Writing landing page copy",
  "Planning SEO strategy",
  "Choosing technology stack",
  "Estimating project cost",
  "Creating development roadmap",
  "Final quality check",
];

export const DID_YOU_KNOW = [
  "53% of mobile visitors leave a page that takes longer than 3 seconds to load.",
  "A clear single call-to-action above the fold typically lifts conversions more than a redesign.",
  "Accessible sites (WCAG 2.2 AA) reach roughly 15% more of the population — and rank better.",
  "Google's Core Web Vitals score real user experience, not lab tests.",
  "Pages with genuine photography of your team outperform stock imagery on trust metrics.",
  "Local businesses with complete Google Business Profiles get significantly more direction requests.",
  "Every extra form field measurably reduces the number of enquiries you receive.",
  "Your proposal marks anything unverified rather than inventing it — that's deliberate.",
];