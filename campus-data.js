// campus-data.js - Comprehensive Spatial & Directory Dataset for Army Institute of Technology (AIT), Pune

const CAMPUS_CONFIG = {
  name: "Army Institute of Technology (AIT), Pune",
  shortName: "AIT Pune Nav",
  tagline: "Onward to Glory • Smart Interactive Campus Maps & Navigation",
  affiliation: "Affiliated to Savitribai Phule Pune University (SPPU) | NAAC A+",
  center: [18.6075, 73.8755],
  defaultZoom: 17.5,
  minZoom: 15,
  maxZoom: 20,
  bounds: [
    [18.6020, 73.8690],
    [18.6130, 73.8820]
  ]
};

// 25+ Campus Buildings and Landmarks of AIT Pune
const CAMPUS_BUILDINGS = [
  {
    id: "acad-main",
    name: "Central Wing (Main Academic Block)",
    subtitle: "Director Office, Admin, Principal & Examination Cell",
    category: "admin",
    icon: "landmark",
    color: "#1e3a8a",
    center: [18.6078, 73.8752],
    polygon: [
      [18.6083, 73.8746],
      [18.6083, 73.8758],
      [18.6073, 73.8758],
      [18.6073, 73.8746]
    ],
    height: 35,
    floors: 3,
    rating: 4.9,
    reviewsCount: 480,
    hours: "8:30 AM - 5:30 PM (Administrative) | 24/7 Security",
    isOpenNow: true,
    busyLevel: "Moderate (55% capacity)",
    popularTimeScore: 55,
    heroImage: "central wing.jpg",
    description: "The iconic Central Wing and administrative cornerstone of AIT Pune. Features the central heritage dome, Director's Secretariat, Joint Director, Principal's Office, Central Accounts, Student Section, Exam Cell, Boardroom, and HDFC Bank ATM.",
    tags: ["Central Wing", "Director Office", "Principal Office", "TPO Cell", "Admin Section", "Exam Cell", "HDFC ATM", "Wheelchair Ramp"],
    departments: ["Directorate", "Principal Secretariat", "Training & Placement Cell (TPO)", "Accounts & Registrar", "Exam Section"],
    entrances: [
      { name: "Main Central Dome & Flagpole Entrance", lat: 18.6073, lng: 73.8752, accessible: true },
      { name: "North Admin Porch Entrance", lat: 18.6083, lng: 73.8752, accessible: true }
    ],
    indoorMap: {
      defaultFloor: 1,
      floors: [
        {
          level: 0,
          name: "Ground Floor: Administration & Directorate",
          rooms: [
            { id: "DIR-01", name: "Director's Secretariat & Office", type: "office", x: 15, y: 20, w: 35, h: 40 },
            { id: "PRIN-02", name: "Principal's Office & Conference Chamber", type: "office", x: 55, y: 20, w: 35, h: 40 },
            { id: "TPO-03", name: "Training & Placement Cell (TPO)", type: "office", x: 15, y: 65, w: 30, h: 28 },
            { id: "ADM-04", name: "Student Section & Accounts Counter", type: "service", x: 50, y: 65, w: 30, h: 28 },
            { id: "ATM-G", name: "HDFC Bank ATM Counter", type: "atm", x: 83, y: 65, w: 12, h: 28 }
          ]
        },
        {
          level: 1,
          name: "1st Floor: Examination Cell & Conference Hall",
          rooms: [
            { id: "EXAM-101", name: "Central SPPU Examination Control Room", type: "office", x: 15, y: 20, w: 40, h: 45 },
            { id: "CONF-102", name: "Boardroom & Academic Council Hall", type: "lecture_hall", x: 60, y: 20, w: 32, h: 45 },
            { id: "SERVER-103", name: "Central Campus Server Room & NOC", type: "lab", x: 15, y: 70, w: 35, h: 22 },
            { id: "WC-1", name: "Restrooms (Accessible)", type: "restroom", x: 55, y: 70, w: 15, h: 22 }
          ]
        }
      ]
    }
  },
  {
    id: "lib-aryabhatta",
    name: "Aryabhatta Centre (Central Library)",
    subtitle: "Dr. APJ Abdul Kalam Learning Centre & Digital Library",
    category: "study",
    icon: "book-open",
    color: "#059669",
    center: [18.6075, 73.8765],
    polygon: [
      [18.6079, 73.8760],
      [18.6079, 73.8770],
      [18.6071, 73.8770],
      [18.6071, 73.8760]
    ],
    height: 30,
    floors: 2,
    rating: 4.9,
    reviewsCount: 520,
    hours: "8:00 AM - 11:00 PM Daily (Extended to 1:00 AM during exams)",
    isOpenNow: true,
    busyLevel: "High (78% capacity)",
    popularTimeScore: 78,
    heroImage: "aryabhata center.jpg",
    description: "The primary intellectual repository and study facility of AIT Pune. Features air-conditioned reading halls, over 40,000 engineering volumes, IEEE & ScienceDirect digital terminals, NPTEL video courseware, and dedicated research pods.",
    tags: ["Aryabhatta Centre", "40,000+ Volumes", "Air Conditioned", "Silent Reading Hall", "IEEE / Digital Library", "Photocopy Service", "Wi-Fi"],
    departments: ["Library & Information Services", "Digital Repository"],
    entrances: [
      { name: "Aryabhatta Centre Main Ramp & Steps Entrance", lat: 18.6075, lng: 73.8760, accessible: true }
    ],
    indoorMap: {
      defaultFloor: 1,
      floors: [
        {
          level: 1,
          name: "Floor 1: Circulation, Digital Section & Periodicals",
          rooms: [
            { id: "LIB-DESK", name: "Main Circulation & Lending Counter", type: "service", x: 15, y: 20, w: 30, h: 40 },
            { id: "LIB-DIGITAL", name: "Digital Library (30 NPTEL & IEEE Workstations)", type: "lab", x: 50, y: 20, w: 42, h: 40 },
            { id: "LIB-NEWS", name: "Newspapers, Periodicals & Magazine Lounge", type: "study", x: 15, y: 65, w: 35, h: 28 },
            { id: "LIB-WC", name: "Restrooms", type: "restroom", x: 55, y: 65, w: 15, h: 28 }
          ]
        },
        {
          level: 2,
          name: "Floor 2: Main Stacks & Air-Conditioned Silent Reading Hall",
          rooms: [
            { id: "LIB-SILENT", name: "Air-Conditioned Central Reading Hall (Seats 200)", type: "study", x: 15, y: 20, w: 55, h: 70 },
            { id: "LIB-STACKS", name: "Engineering Book Stacks (Comp, IT, E&TC, Mech, ASGE)", type: "stacks", x: 73, y: 20, w: 20, h: 70 }
          ]
        }
      ]
    }
  },
  {
    id: "aud-manekshaw",
    name: "Manekshaw Hall",
    subtitle: "Main Central Auditorium (Cap: 450)",
    category: "academic",
    icon: "presentation",
    color: "#b45309",
    center: [18.6080, 73.8762],
    polygon: [
      [18.6084, 73.8758],
      [18.6084, 73.8766],
      [18.6076, 73.8766],
      [18.6076, 73.8758]
    ],
    height: 28,
    floors: 2,
    rating: 4.9,
    reviewsCount: 380,
    hours: "Open during events, guest lectures, technical summits & fests",
    isOpenNow: true,
    busyLevel: "High during events (75% capacity)",
    popularTimeScore: 75,
    heroImage: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80",
    description: "Named after Field Marshal Sam Manekshaw. State-of-the-art air-conditioned auditorium hosting orientation ceremonies, AIT Talks, national conferences, cultural fest inaugurations, and leadership summits.",
    tags: ["450 Seats", "Acoustic Audio", "Air Conditioned", "Stage & Green Rooms", "Wheelchair Accessible"],
    departments: ["Campus Events & Cultural Affairs", "I&E Cell Guest Lectures"],
    entrances: [
      { name: "Manekshaw Hall Grand Foyer", lat: 18.6076, lng: 73.8762, accessible: true }
    ]
  },
  {
    id: "dept-comp",
    name: "Department of Computer Engineering",
    subtitle: "Computing Labs, AI Hub & Coding Suites",
    category: "academic",
    icon: "laptop",
    color: "#2563eb",
    center: [18.6086, 73.8750],
    polygon: [
      [18.6090, 73.8745],
      [18.6090, 73.8755],
      [18.6082, 73.8755],
      [18.6082, 73.8745]
    ],
    height: 32,
    floors: 3,
    rating: 4.9,
    reviewsCount: 310,
    hours: "8:00 AM - 8:00 PM (Coding Lab access extended for hackathons)",
    isOpenNow: true,
    busyLevel: "High (70% capacity)",
    popularTimeScore: 70,
    heroImage: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80",
    description: "Flagship computing department equipped with modern programming labs, Deep Learning & GPU servers, Cyber Security suites, and active coding clubs (OSS Club, Competitive Coding Cell).",
    tags: ["Comp Labs 1-6", "AI & GPU Server", "High-Speed LAN", "Air Conditioned", "Seminar Hall"],
    departments: ["Computer Engineering", "Artificial Intelligence & Data Science", "Open Source Software Club (OSS)"],
    entrances: [
      { name: "Comp Dept East Entrance", lat: 18.6082, lng: 73.8750, accessible: true }
    ],
    indoorMap: {
      defaultFloor: 1,
      floors: [
        {
          level: 1,
          name: "Floor 1: Programming & Systems Labs",
          rooms: [
            { id: "CL-101", name: "Computer Lab 1: Data Structures & Algorithms", type: "lab", x: 15, y: 20, w: 35, h: 45 },
            { id: "CL-102", name: "Computer Lab 2: Software Engineering & DB", type: "lab", x: 55, y: 20, w: 35, h: 45 },
            { id: "HOD-COMP", name: "HOD Computer Dept & Faculty Cabins", type: "office", x: 15, y: 70, w: 40, h: 22 },
            { id: "WC-COMP1", name: "Restrooms", type: "restroom", x: 60, y: 70, w: 15, h: 22 }
          ]
        },
        {
          level: 2,
          name: "Floor 2: AI, Cloud & Project Labs",
          rooms: [
            { id: "CL-201", name: "AI, Machine Learning & GPU Lab", type: "lab", x: 15, y: 20, w: 35, h: 45 },
            { id: "CL-202", name: "OSS Club & Open Source Project Suite", type: "lab", x: 55, y: 20, w: 35, h: 45 },
            { id: "SEM-COMP", name: "Comp Dept Seminar Hall (120 Seats)", type: "lecture_hall", x: 15, y: 70, w: 55, h: 22 }
          ]
        }
      ]
    }
  },
  {
    id: "dept-it",
    name: "Department of Information Technology",
    subtitle: "Cloud Computing, Cybersecurity & Web Tech",
    category: "academic",
    icon: "code",
    color: "#0891b2",
    center: [18.6088, 73.8758],
    polygon: [
      [18.6092, 73.8755],
      [18.6092, 73.8763],
      [18.6084, 73.8763],
      [18.6084, 73.8755]
    ],
    height: 30,
    floors: 3,
    rating: 4.8,
    reviewsCount: 240,
    hours: "8:00 AM - 7:30 PM",
    isOpenNow: true,
    busyLevel: "Moderate (50% capacity)",
    popularTimeScore: 50,
    heroImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80",
    description: "Specialized in cloud platforms, cryptography, blockchain systems, and mobile applications. Houses dedicated innovation pods and high-end workstation benches.",
    tags: ["IT Labs 1-4", "Cloud Testing Bed", "Network Lab", "High Speed Wi-Fi"],
    departments: ["Information Technology", "Cybersecurity & Networks"],
    entrances: [
      { name: "IT Wing Main Entrance", lat: 18.6084, lng: 73.8758, accessible: true }
    ]
  },
  {
    id: "dept-etc",
    name: "Department of Electronics & Telecommunication (E&TC)",
    subtitle: "VLSI, IoT, Microwave & Signal Processing Labs",
    category: "academic",
    icon: "cpu",
    color: "#7c3aed",
    center: [18.6074, 73.8742],
    polygon: [
      [18.6078, 73.8737],
      [18.6078, 73.8747],
      [18.6070, 73.8747],
      [18.6070, 73.8737]
    ],
    height: 32,
    floors: 3,
    rating: 4.8,
    reviewsCount: 260,
    hours: "8:00 AM - 7:00 PM",
    isOpenNow: true,
    busyLevel: "Moderate (45% capacity)",
    popularTimeScore: 45,
    heroImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
    description: "Equipped with advanced spectrum analyzers, VLSI cadence design tools, embedded Arduino & Raspberry Pi labs, and robotics sensor suites.",
    tags: ["VLSI Lab", "Microwave & Antenna", "Robotics Bay", "Embedded Systems Lab", "E&TC Seminar Hall"],
    departments: ["Electronics & Telecommunication", "Robotics & Automation"],
    entrances: [
      { name: "E&TC West Wing Entry", lat: 18.6074, lng: 73.8747, accessible: true }
    ]
  },
  {
    id: "dept-mech",
    name: "Department of Mechanical Engineering & Workshops",
    subtitle: "CNC Machines, Foundry, Thermal & CAD/CAM Labs",
    category: "academic",
    icon: "wrench",
    color: "#ea580c",
    center: [18.6068, 73.8744],
    polygon: [
      [18.6072, 73.8738],
      [18.6072, 73.8750],
      [18.6064, 73.8750],
      [18.6064, 73.8738]
    ],
    height: 25,
    floors: 2,
    rating: 4.8,
    reviewsCount: 290,
    hours: "8:00 AM - 6:00 PM (Workshop timings as per batch schedule)",
    isOpenNow: true,
    busyLevel: "Moderate (50% capacity)",
    popularTimeScore: 50,
    heroImage: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80",
    description: "Heavy engineering workshop featuring precision CNC machining, metal casting foundry, welding bays, automobile testing benches, wind tunnel, and 3D printing rapid prototyping facility.",
    tags: ["CNC Lathes", "Foundry & Forging", "Welding Bay", "Thermodynamics Lab", "Baja Racing Workshop", "CAD/CAM"],
    departments: ["Mechanical Engineering", "Mechanical Design (PG)"],
    entrances: [
      { name: "Workshop Main High-Bay Rolling Gate", lat: 18.6068, lng: 73.8750, accessible: true }
    ]
  },
  {
    id: "dept-asge",
    name: "Applied Science & General Engineering (ASGE)",
    subtitle: "First Year Engineering (FE), Physics, Chemistry & Drawing Hall",
    category: "academic",
    icon: "flask-conical",
    color: "#16a34a",
    center: [18.6082, 73.8742],
    polygon: [
      [18.6086, 73.8738],
      [18.6086, 73.8746],
      [18.6078, 73.8746],
      [18.6078, 73.8738]
    ],
    height: 28,
    floors: 2,
    rating: 4.7,
    reviewsCount: 190,
    hours: "8:00 AM - 5:30 PM",
    isOpenNow: true,
    busyLevel: "Moderate (40% capacity)",
    popularTimeScore: 40,
    heroImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80",
    description: "The home for all First Year (FE) engineering cadets. Houses physics optics darkrooms, engineering chemistry analysis labs, language communication lab, and the grand Engineering Drawing Hall.",
    tags: ["FE Classrooms", "Physics Lab", "Chemistry Lab", "Drawing Hall", "First Year Dean Office"],
    departments: ["Applied Sciences & Mathematics", "First Year Engineering"],
    entrances: [
      { name: "ASGE South Walkway Entry", lat: 18.6078, lng: 73.8742, accessible: true }
    ]
  },
  {
    id: "hostel-obh",
    name: "Old Boys Hostel (OBH)",
    subtitle: "Ramanujan & Sarabhai Wings • 2nd & 3rd Year Residence",
    category: "housing",
    icon: "building",
    color: "#0d9488",
    center: [18.6095, 73.8748],
    polygon: [
      [18.6100, 73.8742],
      [18.6100, 73.8754],
      [18.6090, 73.8754],
      [18.6090, 73.8742]
    ],
    height: 38,
    floors: 3,
    rating: 4.6,
    reviewsCount: 340,
    hours: "24/7 Resident Access (Cadet in-time as per college standing orders)",
    isOpenNow: true,
    busyLevel: "Moderate (55% capacity)",
    popularTimeScore: 55,
    heroImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80",
    description: "Historic residential hall for sophomore and junior engineering cadets. Features internal green quadrangle, table tennis recreation room, laundry room, water coolers, and high-speed Wi-Fi.",
    tags: ["Ramanujan Wing", "Sarabhai Wing", "Common Room", "Table Tennis", "Laundry Room", "Wi-Fi Enabled"],
    departments: ["Hostel Administration", "Warden Secretariat"],
    entrances: [
      { name: "OBH Main Security Gate", lat: 18.6090, lng: 73.8748, accessible: true }
    ]
  },
  {
    id: "hostel-nbh1",
    name: "New Boys Hostel 1 (NBH-1)",
    subtitle: "Abdul Kalam & Homi Bhabha Wings • Senior Residence",
    category: "housing",
    icon: "building",
    color: "#0d9488",
    center: [18.6102, 73.8758],
    polygon: [
      [18.6107, 73.8752],
      [18.6107, 73.8764],
      [18.6097, 73.8764],
      [18.6097, 73.8752]
    ],
    height: 44,
    floors: 4,
    rating: 4.7,
    reviewsCount: 290,
    hours: "24/7 Resident Access",
    isOpenNow: true,
    busyLevel: "Moderate (50% capacity)",
    popularTimeScore: 50,
    heroImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80",
    description: "Modern 4-story hostel accommodation housing senior cadets and final-year project scholars. Equipped with study pods, gym equipment, solar water heating, and high-speed LAN connections.",
    tags: ["Abdul Kalam Wing", "Homi Bhabha Wing", "Single/Double Rooms", "Solar Water Heating", "Study Pods"],
    departments: ["Hostel Administration"],
    entrances: [
      { name: "NBH-1 Front Arch Entrance", lat: 18.6097, lng: 73.8758, accessible: true }
    ]
  },
  {
    id: "hostel-nbh2",
    name: "New Boys Hostel 2 (NBH-2)",
    subtitle: "Vishweswaraiya & SN Bose Wings • First Year Cadets",
    category: "housing",
    icon: "building",
    color: "#0d9488",
    center: [18.6100, 73.8770],
    polygon: [
      [18.6105, 73.8765],
      [18.6105, 73.8775],
      [18.6095, 73.8775],
      [18.6095, 73.8765]
    ],
    height: 44,
    floors: 4,
    rating: 4.7,
    reviewsCount: 260,
    hours: "24/7 Resident Access",
    isOpenNow: true,
    busyLevel: "Moderate (50% capacity)",
    popularTimeScore: 50,
    heroImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80",
    description: "Dedicated residential block for First Year (FE) cadets with dedicated warden supervision, indoor badminton court, television lounge, and mentoring rooms.",
    tags: ["Vishweswaraiya Wing", "SN Bose Wing", "FE Hostels", "Badminton Court", "Mentoring Rooms"],
    departments: ["Hostel Administration"],
    entrances: [
      { name: "NBH-2 Security Checkpoint", lat: 18.6095, lng: 73.8770, accessible: true }
    ]
  },
  {
    id: "hostel-kcgh",
    name: "Kalpana Chawla Girls Hostel (KCGH)",
    subtitle: "Female Cadets Residence Complex",
    category: "housing",
    icon: "home",
    color: "#db2777",
    center: [18.6085, 73.8775],
    polygon: [
      [18.6090, 73.8770],
      [18.6090, 73.8780],
      [18.6080, 73.8780],
      [18.6080, 73.8770]
    ],
    height: 40,
    floors: 4,
    rating: 4.8,
    reviewsCount: 310,
    hours: "24/7 Secure Access (Biometric Entry)",
    isOpenNow: true,
    busyLevel: "Moderate (50% capacity)",
    popularTimeScore: 50,
    heroImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80",
    description: "Dedicated residential facility for female engineering cadets with biometric security, in-house Girls Dining Mess, dedicated fitness room, reading rooms, laundry units, and lush inner lawn.",
    tags: ["Biometric Security", "Girls Dining Mess", "Gym Room", "Reading Hall", "Solar Water Heating"],
    departments: ["Girls Hostel Administration", "Warden Office"],
    entrances: [
      { name: "KCGH Main Biometric Gate", lat: 18.6080, lng: 73.8775, accessible: true }
    ]
  },
  {
    id: "mess-cadets",
    name: "Central Cadets Mess (Boys Mess)",
    subtitle: "All-Cadet Dining Hall (Seats 600)",
    category: "dining",
    icon: "utensils",
    color: "#f97316",
    center: [18.6090, 73.8765],
    polygon: [
      [18.6094, 73.8761],
      [18.6094, 73.8769],
      [18.6086, 73.8769],
      [18.6086, 73.8761]
    ],
    height: 20,
    floors: 1,
    rating: 4.6,
    reviewsCount: 580,
    hours: "Breakfast: 7:15-8:45 AM | Lunch: 12:30-2:15 PM | Snacks: 5:00-6:00 PM | Dinner: 7:45-9:30 PM",
    isOpenNow: true,
    busyLevel: "High during meal times (85% capacity)",
    popularTimeScore: 85,
    heroImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80",
    description: "Central dining facility operated by student mess committee. Serves wholesome, balanced, hygienic meals with special Sunday feasts, festival specials, and sweet dishes.",
    tags: ["Breakfast, Lunch, Dinner", "Student Mess Committee", "Special Sunday Feast", "Water Purifier Stations"],
    departments: ["Mess Administration & Catering"],
    entrances: [
      { name: "Cadets Mess Front Doors", lat: 18.6086, lng: 73.8765, accessible: true }
    ]
  },
  {
    id: "canteen-ait",
    name: "AIT Canteen & Juice Corner",
    subtitle: "Student Cafeteria & Snack Lounge",
    category: "dining",
    icon: "coffee",
    color: "#f59e0b",
    center: [18.6070, 73.8758],
    polygon: [
      [18.6074, 73.8754],
      [18.6074, 73.8762],
      [18.6066, 73.8762],
      [18.6066, 73.8754]
    ],
    height: 18,
    floors: 1,
    rating: 4.8,
    reviewsCount: 650,
    hours: "8:00 AM - 10:30 PM Daily",
    isOpenNow: true,
    busyLevel: "Very Busy (80% capacity)",
    popularTimeScore: 80,
    heroImage: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80",
    description: "The primary social hangout on campus serving delicious dosas, samosas, chole bhature, sandwiches, thalis, milkshakes, fresh seasonal fruit juices, and cold drinks at subsidized student rates.",
    tags: ["Dosas & South Indian", "Fresh Fruit Juices", "Fast Food", "Outdoor Shaded Seating", "UPI Accepted"],
    departments: ["Campus Hospitality"],
    entrances: [
      { name: "Canteen Front Canopy Entrance", lat: 18.6070, lng: 73.8754, accessible: true }
    ]
  },
  {
    id: "shop-complex",
    name: "AIT Shopping Complex & CSD Counter",
    subtitle: "Stationery, Xerox, Barber & Daily Essentials",
    category: "transit",
    icon: "shopping-bag",
    color: "#64748b",
    center: [18.6064, 73.8756],
    polygon: [
      [18.6068, 73.8752],
      [18.6068, 73.8760],
      [18.6060, 73.8760],
      [18.6060, 73.8752]
    ],
    height: 18,
    floors: 1,
    rating: 4.6,
    reviewsCount: 320,
    hours: "9:00 AM - 9:00 PM (Closed on Tuesdays)",
    isOpenNow: true,
    busyLevel: "Moderate (45% capacity)",
    popularTimeScore: 45,
    heroImage: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80",
    description: "Convenience center containing the College Stationery & Blueprint Printing Shop, CSD Extension Counter, Gents Barber Shop, Tailor, and General Provisions Store.",
    tags: ["Stationery & Xerox", "Engineering Drawing Supplies", "CSD Counter", "Barber Shop", "Tailor"],
    departments: ["Campus Commercial Services"],
    entrances: [
      { name: "Shopping Complex Walkway Gate", lat: 18.6064, lng: 73.8752, accessible: true }
    ]
  },
  {
    id: "mi-room",
    name: "Medical Inspection (MI) Room & Dispensary",
    subtitle: "Campus Health Centre & 24/7 Ambulance",
    category: "health",
    icon: "cross",
    color: "#16a34a",
    center: [18.6070, 73.8768],
    polygon: [
      [18.6074, 73.8765],
      [18.6074, 73.8771],
      [18.6066, 73.8771],
      [18.6066, 73.8765]
    ],
    height: 18,
    floors: 1,
    rating: 4.7,
    reviewsCount: 180,
    hours: "OPD: 8:30 AM - 1:30 PM & 4:30 PM - 7:30 PM | Emergency: 24/7 On-Call",
    isOpenNow: true,
    busyLevel: "Low (20% capacity)",
    popularTimeScore: 20,
    heroImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80",
    description: "Campus health centre manned by Resident Medical Officer (RMO) and nursing assistants. Equipped with observation beds, first-aid, emergency medicines, and 24/7 dedicated campus ambulance for referral to Command Hospital (Southern Command).",
    tags: ["RMO Doctor", "Observation Beds", "24/7 Ambulance", "Emergency Triage", "First Aid"],
    departments: ["Medical Services", "Southern Command Health Outreach"],
    entrances: [
      { name: "MI Room Ambulance Bay Entrance", lat: 18.6070, lng: 73.8765, accessible: true }
    ]
  },
  {
    id: "sports-indoor",
    name: "Main Sports Complex & Gymnasium",
    subtitle: "Badminton, Squash, Table Tennis & Fitness Gym",
    category: "sports",
    icon: "dumbbell",
    color: "#ea580c",
    center: [18.6060, 73.8748],
    polygon: [
      [18.6065, 73.8742],
      [18.6065, 73.8754],
      [18.6055, 73.8754],
      [18.6055, 73.8742]
    ],
    height: 28,
    floors: 2,
    rating: 4.9,
    reviewsCount: 410,
    hours: "Morning: 5:30 AM - 8:30 AM | Evening: 4:30 PM - 9:30 PM Daily",
    isOpenNow: true,
    busyLevel: "High during evening sessions (75% capacity)",
    popularTimeScore: 75,
    heroImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80",
    description: "Multipurpose indoor sports arena featuring standard wooden badminton courts, international squash court, table tennis hall, cardio machines, and high-performance weightlifting gymnasium.",
    tags: ["Wooden Badminton", "Squash Court", "Modern Gym", "Table Tennis", "Shower Rooms"],
    departments: ["Physical Education & Sports Dept"],
    entrances: [
      { name: "Sports Complex Foyer Entrance", lat: 18.6060, lng: 73.8754, accessible: true }
    ]
  },
  {
    id: "field-cricket",
    name: "Main Sports Ground (Cricket & Football)",
    subtitle: "400m Athletics Track & Parade Ground",
    category: "sports",
    icon: "trophy",
    color: "#ca8a04",
    center: [18.6050, 73.8765],
    polygon: [
      [18.6058, 73.8755],
      [18.6058, 73.8775],
      [18.6042, 73.8775],
      [18.6042, 73.8755]
    ],
    height: 10,
    floors: 1,
    rating: 4.9,
    reviewsCount: 460,
    hours: "5:30 AM - 9:00 PM (Floodlights active for tournament matches)",
    isOpenNow: true,
    busyLevel: "Moderate (40% capacity)",
    popularTimeScore: 40,
    heroImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80",
    description: "Expansive natural grass sports arena hosting the annual Pace sports festival, cricket tournaments, inter-hostel football matches, and ceremonial parades.",
    tags: ["Cricket Pitch", "Football Field", "400m Running Track", "Grandstand Pavilion", "Floodlights"],
    departments: ["Physical Education & Sports Dept"],
    entrances: [
      { name: "Sports Ground North Pavilion Gate", lat: 18.6058, lng: 73.8765, accessible: true }
    ]
  },
  {
    id: "court-basketball",
    name: "Floodlit Basketball & Tennis Courts",
    subtitle: "Synthetic Basketball Arena & Lawn Tennis",
    category: "sports",
    icon: "target",
    color: "#ea580c",
    center: [18.6060, 73.8765],
    polygon: [
      [18.6064, 73.8761],
      [18.6064, 73.8769],
      [18.6056, 73.8769],
      [18.6056, 73.8761]
    ],
    height: 8,
    floors: 1,
    rating: 4.8,
    reviewsCount: 290,
    hours: "6:00 AM - 10:00 PM (Floodlit)",
    isOpenNow: true,
    busyLevel: "High in evening (70% capacity)",
    popularTimeScore: 70,
    heroImage: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=80",
    description: "Professional synthetic hardcourt basketball arena and two regulation tennis courts with high-intensity LED floodlighting for night play.",
    tags: ["Synthetic Basketball", "2 Tennis Courts", "LED Floodlights", "Bleachers"],
    departments: ["Physical Education & Sports Dept"],
    entrances: [
      { name: "Basketball Arena Gate", lat: 18.6060, lng: 73.8761, accessible: true }
    ]
  },
  {
    id: "oat-theatre",
    name: "Open Air Theatre (OAT)",
    subtitle: "Tiered Amphitheatre for Cultural Fests & Band Jams",
    category: "recreation",
    icon: "sparkles",
    color: "#9334e6",
    center: [18.6078, 73.8772],
    polygon: [
      [18.6082, 73.8768],
      [18.6082, 73.8776],
      [18.6074, 73.8776],
      [18.6074, 73.8768]
    ],
    height: 12,
    floors: 1,
    rating: 4.9,
    reviewsCount: 370,
    hours: "Open during fest events, drama practices, music club sessions",
    isOpenNow: true,
    busyLevel: "Moderate in evenings (40% capacity)",
    popularTimeScore: 40,
    heroImage: "https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=1000&q=80",
    description: "Semicircular open-air stone amphitheatre surrounded by lush trees. The vibrant heart of Aakriti cultural fest, rock music jams, street plays, and batch farewells.",
    tags: ["Open Air Amphitheatre", "Stone Tiered Seating", "Aakriti Fest Stage", "Acoustics"],
    departments: ["Cultural Board", "Music & Drama Clubs"],
    entrances: [
      { name: "OAT West Colonnade Entry", lat: 18.6078, lng: 73.8768, accessible: true }
    ]
  },
  {
    id: "gate-main",
    name: "AIT Main Security Gate & Quarter Guard",
    subtitle: "Alandi Road Main Entrance & Security Checkpoint",
    category: "admin",
    icon: "shield-alert",
    color: "#b91c1c",
    center: [18.6052, 73.8745],
    polygon: [
      [18.6056, 73.8740],
      [18.6056, 73.8750],
      [18.6048, 73.8750],
      [18.6048, 73.8740]
    ],
    height: 15,
    floors: 1,
    rating: 4.8,
    reviewsCount: 220,
    hours: "24/7 / 365 Days Military Police & Guard Checkpost",
    isOpenNow: true,
    busyLevel: "High activity (70% traffic)",
    popularTimeScore: 70,
    heroImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80",
    description: "Main guarded entrance on Alandi Road. Features security check-in, visitor pass issuance, automated barrier gate, auto-rickshaw stand, and bus pick-up bay.",
    tags: ["Main Gate", "Security Post", "Visitor Passes", "Auto Stand", "CCTV 24/7"],
    departments: ["Campus Security & Military Police"],
    entrances: [
      { name: "Main Alandi Road Gate", lat: 18.6052, lng: 73.8745, accessible: true }
    ]
  },
  {
    id: "temple-ait",
    name: "AIT Mandir / Sarva Dharma Sthal",
    subtitle: "Campus Prayer Pavilion & Meditation Lawn",
    category: "recreation",
    icon: "sun",
    color: "#eab308",
    center: [18.6092, 73.8740],
    polygon: [
      [18.6096, 73.8736],
      [18.6096, 73.8744],
      [18.6088, 73.8744],
      [18.6088, 73.8736]
    ],
    height: 15,
    floors: 1,
    rating: 4.9,
    reviewsCount: 310,
    hours: "5:30 AM - 9:00 PM Daily",
    isOpenNow: true,
    busyLevel: "Quiet & Peaceful (15% capacity)",
    popularTimeScore: 15,
    heroImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80",
    description: "Tranquil spiritual and meditation sanctuary nestled amidst dense green foliage near the OBH hostel block, promoting peace and reflection.",
    tags: ["Prayer Hall", "Meditation Garden", "Quiet Zone", "Festival Celebrations"],
    departments: ["Campus Welfare"],
    entrances: [
      { name: "Mandir Archway Gate", lat: 18.6092, lng: 73.8740, accessible: true }
    ]
  },
  {
    id: "cell-iic",
    name: "Innovation & Incubation Cell (IIC & E-Cell)",
    subtitle: "Startup Incubator, Prototyping & Hackathon Suite",
    category: "academic",
    icon: "sparkles",
    color: "#8b5cf6",
    center: [18.6084, 73.8766],
    polygon: [
      [18.6088, 73.8762],
      [18.6088, 73.8770],
      [18.6080, 73.8770],
      [18.6080, 73.8762]
    ],
    height: 24,
    floors: 2,
    rating: 4.9,
    reviewsCount: 210,
    hours: "24/7 Access during Hackathons & Startup Incubation",
    isOpenNow: true,
    busyLevel: "Moderate (45% capacity)",
    popularTimeScore: 45,
    heroImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80",
    description: "The entrepreneurship and innovation engine of AIT Pune. Provides seed funding mentoring, 3D printing equipment, patent support, and collaborative startup desks for student ventures.",
    tags: ["E-Cell Hub", "Startup Incubation", "3D Printing", "Hackathon Room", "Investor Pitch Desk"],
    departments: ["Innovation and Entrepreneurship (I&E) Cell", "Institution's Innovation Council"],
    entrances: [
      { name: "IIC Innovation Lab Glass Entrance", lat: 18.6084, lng: 73.8766, accessible: true }
    ]
  }
];

// Campus Amenities (POIs for quick search and filter chips)
const CAMPUS_AMENITIES = [
  { id: "atm-hdfc", name: "HDFC Bank ATM (Central Wing Ground Floor)", type: "atm", icon: "credit-card", lat: 18.6074, lng: 73.8752, building: "acad-main", details: "Withdrawals, PIN Change, Fast Cash • 24/7 Accessible" },
  { id: "atm-sbi", name: "SBI ATM (Near Main Gate Alandi Road)", type: "atm", icon: "credit-card", lat: 18.6053, lng: 73.8744, building: "gate-main", details: "State Bank of India ATM" },
  
  { id: "prn-shop", name: "AIT Stationery & Xerox Center", type: "printer", icon: "printer", lat: 18.6064, lng: 73.8756, building: "shop-complex", details: "Project Binding, Color Printing, Engineering Drawings, CAD Prints" },
  { id: "prn-lib", name: "Aryabhatta Centre Digital Print Desk", type: "printer", icon: "printer", lat: 18.6075, lng: 73.8765, building: "lib-aryabhatta", details: "High Speed B&W and Journal Printing" },
  
  { id: "sos-gate", name: "Emergency Security Point 1 (Main Gate Checkpost)", type: "sos", icon: "phone-call", lat: 18.6052, lng: 73.8745, details: "Direct line to Security In-Charge & Quarter Guard" },
  { id: "sos-mi", name: "Emergency Medical Post (MI Room Ambulance)", type: "sos", icon: "phone-call", lat: 18.6070, lng: 73.8768, details: "24/7 Doctor On-Call & Emergency Ambulance Service" },
  { id: "sos-obh", name: "Hostel Security Post (Between OBH & NBH)", type: "sos", icon: "phone-call", lat: 18.6096, lng: 73.8752, details: "Boys Hostel Warden & Security Helpdesk" },
  { id: "sos-kcgh", name: "KCGH Security Post (Girls Hostel Guard)", type: "sos", icon: "phone-call", lat: 18.6080, lng: 73.8775, details: "Dedicated 24/7 Security Guard & Intercom" },
  
  { id: "cafe-canteen", name: "AIT Central Canteen & Juice Corner", type: "cafe", icon: "coffee", lat: 18.6070, lng: 73.8758, building: "canteen-ait", details: "Tea, Cold Coffee, Fresh Juices, Hot Snacks & Meals" },
  { id: "cafe-nescafe", name: "Nescafe Kiosk & Maggi Point", type: "cafe", icon: "coffee", lat: 18.6082, lng: 73.8764, building: "aud-manekshaw", details: "Hot Espresso, Cappuccino, Iced Tea & Maggi" }
];

// Campus Shuttle & Transit Lines
const CAMPUS_SHUTTLES = [
  {
    id: "ait-bus-line",
    name: "AIT Campus & City Transit Shuttle",
    color: "#2563eb",
    frequencyMinutes: 15,
    activeBuses: [
      { id: "AIT-BUS-1", name: "AIT College Bus #1", currentStopIdx: 0, nextArrivalMins: 3, lat: 18.6052, lng: 73.8745, heading: 45 },
      { id: "AIT-BUS-2", name: "AIT College Bus #2", currentStopIdx: 3, nextArrivalMins: 7, lat: 18.6095, lng: 73.8760, heading: 180 }
    ],
    stops: [
      { id: "stop-gate", name: "Main Gate (Alandi Road)", lat: 18.6052, lng: 73.8745 },
      { id: "stop-acad", name: "Central Wing & Director Office", lat: 18.6073, lng: 73.8752 },
      { id: "stop-library", name: "Aryabhatta Centre & OAT", lat: 18.6075, lng: 73.8765 },
      { id: "stop-hostels", name: "Cadets Mess & Hostels (OBH/NBH)", lat: 18.6092, lng: 73.8760 },
      { id: "stop-sports", name: "Sports Complex & Ground", lat: 18.6060, lng: 73.8752 }
    ],
    routePath: [
      [18.6052, 73.8745],
      [18.6065, 73.8748],
      [18.6073, 73.8752],
      [18.6080, 73.8755],
      [18.6092, 73.8760],
      [18.6100, 73.8765],
      [18.6085, 73.8775],
      [18.6075, 73.8765],
      [18.6065, 73.8758],
      [18.6055, 73.8750],
      [18.6052, 73.8745]
    ]
  }
];

// Campus Graph Network for AIT Pathfinding
const CAMPUS_GRAPH = {
  nodes: {
    "N-GATE": { lat: 18.6052, lng: 73.8745, name: "Main Gate Alandi Road", type: "entrance", buildingId: "gate-main", isAccessible: true },
    "N-SOUTH-ROAD-1": { lat: 18.6058, lng: 73.8748, name: "South Avenue to Sports Complex", type: "path" },
    
    "N-SPORTS-ENTRY": { lat: 18.6060, lng: 73.8754, name: "Sports Complex Foyer", type: "entrance", buildingId: "sports-indoor", isAccessible: true },
    "N-GROUND-ENTRY": { lat: 18.6058, lng: 73.8765, name: "Cricket & Football Ground Pavilion", type: "entrance", buildingId: "field-cricket", isAccessible: true },
    "N-BASKETBALL": { lat: 18.6060, lng: 73.8761, name: "Basketball & Tennis Courts", type: "entrance", buildingId: "court-basketball", isAccessible: true },

    "N-SHOP-COMPLEX": { lat: 18.6064, lng: 73.8752, name: "Shopping Complex & Stationery", type: "entrance", buildingId: "shop-complex", isAccessible: true },
    "N-CANTEEN-ENTRY": { lat: 18.6070, lng: 73.8754, name: "AIT Canteen Canopy", type: "entrance", buildingId: "canteen-ait", isAccessible: true },
    "N-MI-ROOM": { lat: 18.6070, lng: 73.8765, name: "MI Room & Dispensary", type: "entrance", buildingId: "mi-room", isAccessible: true },

    "N-ACAD-MAIN": { lat: 18.6073, lng: 73.8752, name: "Central Wing Dome Entrance", type: "entrance", buildingId: "acad-main", isAccessible: true },
    "N-ACAD-NORTH": { lat: 18.6083, lng: 73.8752, name: "Admin North Porch", type: "entrance", buildingId: "acad-main", isAccessible: true },
    "N-MANEKSHAW": { lat: 18.6076, lng: 73.8762, name: "Manekshaw Hall Foyer", type: "entrance", buildingId: "aud-manekshaw", isAccessible: true },
    
    "N-DEPT-COMP": { lat: 18.6082, lng: 73.8750, name: "Computer Engineering Dept Entry", type: "entrance", buildingId: "dept-comp", isAccessible: true },
    "N-DEPT-IT": { lat: 18.6084, lng: 73.8758, name: "IT Department Entrance", type: "entrance", buildingId: "dept-it", isAccessible: true },
    "N-DEPT-ETC": { lat: 18.6074, lng: 73.8747, name: "E&TC Department Entrance", type: "entrance", buildingId: "dept-etc", isAccessible: true },
    "N-DEPT-MECH": { lat: 18.6068, lng: 73.8750, name: "Mechanical Engineering Workshop Gate", type: "entrance", buildingId: "dept-mech", isAccessible: true },
    "N-DEPT-ASGE": { lat: 18.6078, lng: 73.8742, name: "ASGE First Year Block Entry", type: "entrance", buildingId: "dept-asge", isAccessible: true },
    
    "N-LIBRARY-ENTRY": { lat: 18.6075, lng: 73.8760, name: "Aryabhatta Centre Entrance", type: "entrance", buildingId: "lib-aryabhatta", isAccessible: true },
    "N-IIC-ENTRY": { lat: 18.6084, lng: 73.8766, name: "Innovation & Incubation Cell (IIC)", type: "entrance", buildingId: "cell-iic", isAccessible: true },
    "N-OAT-ENTRY": { lat: 18.6078, lng: 73.8768, name: "Open Air Theatre (OAT)", type: "entrance", buildingId: "oat-theatre", isAccessible: true },

    "N-MESS-ENTRY": { lat: 18.6086, lng: 73.8765, name: "Cadets Mess Main Entry", type: "entrance", buildingId: "mess-cadets", isAccessible: true },
    "N-OBH-ENTRY": { lat: 18.6090, lng: 73.8748, name: "Old Boys Hostel (OBH) Gate", type: "entrance", buildingId: "hostel-obh", isAccessible: true },
    "N-NBH1-ENTRY": { lat: 18.6097, lng: 73.8758, name: "NBH-1 Front Entrance", type: "entrance", buildingId: "hostel-nbh1", isAccessible: true },
    "N-NBH2-ENTRY": { lat: 18.6095, lng: 73.8770, name: "NBH-2 Gate", type: "entrance", buildingId: "hostel-nbh2", isAccessible: true },
    "N-KCGH-ENTRY": { lat: 18.6080, lng: 73.8775, name: "KCGH Girls Hostel Biometric Gate", type: "entrance", buildingId: "hostel-kcgh", isAccessible: true },
    "N-TEMPLE-ENTRY": { lat: 18.6092, lng: 73.8740, name: "AIT Mandir Archway", type: "entrance", buildingId: "temple-ait", isAccessible: true }
  },

  edges: [
    { u: "N-GATE", v: "N-SOUTH-ROAD-1", dist: 75, bikeSafe: true, accessible: true },
    { u: "N-SOUTH-ROAD-1", v: "N-SPORTS-ENTRY", dist: 65, bikeSafe: true, accessible: true },
    { u: "N-SOUTH-ROAD-1", v: "N-SHOP-COMPLEX", dist: 75, bikeSafe: true, accessible: true },
    { u: "N-SPORTS-ENTRY", v: "N-GROUND-ENTRY", dist: 120, bikeSafe: true, accessible: true },
    { u: "N-SPORTS-ENTRY", v: "N-BASKETBALL", dist: 75, bikeSafe: true, accessible: true },
    { u: "N-BASKETBALL", v: "N-GROUND-ENTRY", dist: 50, bikeSafe: true, accessible: true },

    { u: "N-SHOP-COMPLEX", v: "N-DEPT-MECH", dist: 50, bikeSafe: true, accessible: true },
    { u: "N-SHOP-COMPLEX", v: "N-CANTEEN-ENTRY", dist: 65, bikeSafe: true, accessible: true },
    { u: "N-CANTEEN-ENTRY", v: "N-ACAD-MAIN", dist: 40, bikeSafe: true, accessible: true },
    { u: "N-CANTEEN-ENTRY", v: "N-MI-ROOM", dist: 110, bikeSafe: true, accessible: true },
    { u: "N-MI-ROOM", v: "N-LIBRARY-ENTRY", dist: 65, bikeSafe: true, accessible: true },

    { u: "N-ACAD-MAIN", v: "N-DEPT-ETC", dist: 60, bikeSafe: true, accessible: true },
    { u: "N-DEPT-ETC", v: "N-DEPT-MECH", dist: 70, bikeSafe: true, accessible: true },
    { u: "N-DEPT-ETC", v: "N-DEPT-ASGE", dist: 65, bikeSafe: true, accessible: true },
    { u: "N-ACAD-MAIN", v: "N-ACAD-NORTH", dist: 110, bikeSafe: true, accessible: true },
    { u: "N-ACAD-MAIN", v: "N-MANEKSHAW", dist: 110, bikeSafe: true, accessible: true },
    { u: "N-MANEKSHAW", v: "N-LIBRARY-ENTRY", dist: 30, bikeSafe: true, accessible: true },

    { u: "N-ACAD-NORTH", v: "N-DEPT-COMP", dist: 30, bikeSafe: true, accessible: true },
    { u: "N-ACAD-NORTH", v: "N-DEPT-IT", dist: 65, bikeSafe: true, accessible: true },
    { u: "N-DEPT-COMP", v: "N-DEPT-ASGE", dist: 90, bikeSafe: true, accessible: true },
    { u: "N-DEPT-IT", v: "N-IIC-ENTRY", dist: 85, bikeSafe: true, accessible: true },
    { u: "N-LIBRARY-ENTRY", v: "N-OAT-ENTRY", dist: 85, bikeSafe: true, accessible: true },
    { u: "N-IIC-ENTRY", v: "N-OAT-ENTRY", dist: 70, bikeSafe: true, accessible: true },

    { u: "N-DEPT-COMP", v: "N-OBH-ENTRY", dist: 90, bikeSafe: true, accessible: true },
    { u: "N-OBH-ENTRY", v: "N-TEMPLE-ENTRY", dist: 85, bikeSafe: true, accessible: true },
    { u: "N-DEPT-IT", v: "N-MESS-ENTRY", dist: 75, bikeSafe: true, accessible: true },
    { u: "N-MESS-ENTRY", v: "N-NBH1-ENTRY", dist: 130, bikeSafe: true, accessible: true },
    { u: "N-OBH-ENTRY", v: "N-NBH1-ENTRY", dist: 130, bikeSafe: true, accessible: true },
    { u: "N-NBH1-ENTRY", v: "N-NBH2-ENTRY", dist: 130, bikeSafe: true, accessible: true },
    { u: "N-MESS-ENTRY", v: "N-NBH2-ENTRY", dist: 110, bikeSafe: true, accessible: true },
    { u: "N-MESS-ENTRY", v: "N-KCGH-ENTRY", dist: 120, bikeSafe: true, accessible: true },
    { u: "N-OAT-ENTRY", v: "N-KCGH-ENTRY", dist: 75, bikeSafe: true, accessible: true }
  ]
};

// Real AIT Student Timetable Sample
const SAMPLE_STUDENT_SCHEDULE = [
  {
    id: "COMP-301",
    courseCode: "COMP 301",
    courseName: "Design & Analysis of Algorithms",
    instructor: "Dr. S. R. Dhore",
    buildingId: "dept-comp",
    buildingName: "Computer Engineering Dept",
    room: "Computer Lab 1 (Floor 1)",
    time: "09:00 AM - 10:00 AM",
    days: "Mon, Wed, Fri",
    status: "Upcoming Next",
    isNext: true
  },
  {
    id: "IT-304",
    courseCode: "IT 304",
    courseName: "Cloud Computing & DevOps",
    instructor: "Prof. P. B. Patil",
    buildingId: "dept-it",
    buildingName: "Information Technology Dept",
    room: "Cloud Testing Bed Lab (Floor 1)",
    time: "11:15 AM - 12:15 PM",
    days: "Mon, Wed",
    status: "Later Today",
    isNext: false
  },
  {
    id: "ETC-202",
    courseCode: "ETC 202",
    courseName: "Signals & Digital Processing",
    instructor: "Dr. G. R. Patil",
    buildingId: "dept-etc",
    buildingName: "E&TC Department",
    room: "DSP Lab (Floor 1)",
    time: "02:00 PM - 03:30 PM",
    days: "Mon, Thu",
    status: "Later Today",
    isNext: false
  },
  {
    id: "MECH-305",
    courseCode: "MECH 305",
    courseName: "Mechatronics & Robotics",
    instructor: "Prof. J. B. Sankpal",
    buildingId: "dept-mech",
    buildingName: "Mechanical Engineering Block",
    room: "CAD/CAM Studio (Floor 1)",
    time: "04:00 PM - 05:30 PM",
    days: "Tue, Fri",
    status: "Tomorrow",
    isNext: false
  }
];

// Global Export
if (typeof window !== "undefined") {
  window.CAMPUS_CONFIG = CAMPUS_CONFIG;
  window.CAMPUS_BUILDINGS = CAMPUS_BUILDINGS;
  window.CAMPUS_AMENITIES = CAMPUS_AMENITIES;
  window.CAMPUS_SHUTTLES = CAMPUS_SHUTTLES;
  window.CAMPUS_GRAPH = CAMPUS_GRAPH;
  window.SAMPLE_STUDENT_SCHEDULE = SAMPLE_STUDENT_SCHEDULE;
}
