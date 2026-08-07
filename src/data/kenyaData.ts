import { Pillar, CountyOffice } from '../types';

export const ELEVEN_PILLARS: Pillar[] = [
  {
    id: 1,
    title: "1. Education",
    category: "Social",
    icon: "GraduationCap",
    shortDescription: "Quality, affordable learning from ECDE to tertiary level across all 47 counties.",
    fullDescription: "Education is the foundation of national transformation. DCP commits to guaranteeing equitable, modern, and fully funded Early Childhood Development Education (ECDE), free primary and secondary education, and subsidized technical vocational training (TVET) and university education with prompt HELB disbursements.",
    keyGoals: [
      "Full capitation funding for public primary and secondary schools",
      "Modernization of TVET colleges for technical job market readiness",
      "Universal ECD teacher employment by county governments",
      "Timely disbursement of university bursaries and HELB loans"
    ]
  },
  {
    id: 2,
    title: "2. Healthcare",
    category: "Social",
    icon: "HeartPulse",
    shortDescription: "Accessible, dignified care in every county with essential medicine guarantees.",
    fullDescription: "Every Kenyan citizen deserves dignified, responsive, and affordable healthcare. DCP will reform national health cover to ensure comprehensive medical emergency funds, well-equipped level 4 and level 5 county hospitals, and dignified terms for healthcare personnel.",
    keyGoals: [
      "Guaranteed stock of essential medicines in all level 2-5 public facilities",
      "Universal healthcare subsidy for elderly, PWDs, and low-income families",
      "Fair remuneration and career progression for doctors, nurses, and clinical officers",
      "Specialized cancer care and kidney dialysis centers in all 47 counties"
    ]
  },
  {
    id: 3,
    title: "3. Agriculture",
    category: "Economic",
    icon: "Sprout",
    shortDescription: "Food security and prosperity for our farmers through guaranteed minimum returns.",
    fullDescription: "Agriculture drives Kenya's rural economy. DCP pledges to lower farm input costs, eradicate broker cartels, establish climate-smart irrigation projects, and implement Guaranteed Minimum Returns (GMR) for maize, tea, coffee, sugar, milk, and horticulture.",
    keyGoals: [
      "Direct subsidization of fertilizer, certified seeds, and livestock vaccines",
      "Guaranteed Minimum Returns (GMR) protection for small-scale farmers",
      "Construction of strategic grain reserves and cold storage units per county",
      "Expansion of large-scale solar-powered irrigation schemes"
    ]
  },
  {
    id: 4,
    title: "4. Employment",
    category: "Economic",
    icon: "Briefcase",
    shortDescription: "Jobs, entrepreneurship and industrial growth for Kenya's energetic youth.",
    fullDescription: "Unemployment is a national crisis. DCP will spur industrial manufacturing, support the informal 'Jua Kali' sector through subsidized credit funds (Hustler & Youth Innovation Funds), and incentivize companies hiring young graduates.",
    keyGoals: [
      "Zero-interest micro-equity loans for Youth and Women Jua Kali enterprises",
      "Special Economic Zones (SEZ) in every regional cluster to boost manufacturing",
      "Paid national internship program for all university and college graduates",
      "Tax incentives for local tech startups and manufacturing firms"
    ]
  },
  {
    id: 5,
    title: "5. Infrastructure",
    category: "Infrastructure",
    icon: "Building2",
    shortDescription: "Roads, housing and utilities that connect rural and urban Kenya seamlessly.",
    fullDescription: "Reliable infrastructure unlocks trade and economic production. DCP focuses on last-mile rural feeder roads, affordable clean energy grid extension, clean pipe-borne water supply, and modern market facilities across all constituencies.",
    keyGoals: [
      "Paving 10,000 km of rural agricultural feeder roads (Inua Mashinani)",
      "Universal access to clean piped water in every rural homestead",
      "Lowering electricity tariffs for households and small businesses by 30%",
      "Modern covered fresh-produce markets in every sub-county town"
    ]
  },
  {
    id: 6,
    title: "6. Devolution",
    category: "Governance",
    icon: "Landmark",
    shortDescription: "Strong counties, empowered local leadership, and equitable revenue sharing.",
    fullDescription: "Devolution is the heartbeat of citizen power. DCP will ensure county governments receive at least 35% of national revenue on time without political delays, strengthening county assemblies and ward-level development funds.",
    keyGoals: [
      "Increase equitable share to counties from 15% to minimum 35%",
      "Establishment of Ward Development Funds to decentralize project selection",
      "Automated, prompt monthly disbursement of county allocation funds",
      "Capacity building for local public participation assemblies"
    ]
  },
  {
    id: 7,
    title: "7. Technology",
    category: "Infrastructure",
    icon: "Cpu",
    shortDescription: "Innovation and a digital economy empowering young digital workers.",
    fullDescription: "Kenya is Africa's Silicon Savannah. DCP will expand free fiber-optic Wi-Fi to all public markets and ward centers, lower data costs, foster AI innovation hubs, and protect digital workers' earnings.",
    keyGoals: [
      "Free public Wi-Fi hotspots at all bus parks and county markets",
      "Incentives and incubation hubs for software engineers, freelancers, and AI creators",
      "Reduction of mobile data tariffs through telecommunication sector competition",
      "E-government service digitization to eliminate bribery points"
    ]
  },
  {
    id: 8,
    title: "8. Inclusion",
    category: "Social",
    icon: "Users",
    shortDescription: "Youth, Women and Persons with Disabilities (PWD) at the core of decision making.",
    fullDescription: "No Kenyan will be left behind. DCP mandates at least 30% youth and women representation across all party leadership organs and public appointments, alongside tax exemptions and assistive technologies for PWDs.",
    keyGoals: [
      "30% mandatory procurement quota (AGPO) enforced in all government tenders",
      "Full accessibility infrastructure in public transport and buildings for PWDs",
      "Special revolving fund for women-led agricultural and trade cooperatives",
      "Protection of indigenous communities and minority cultural groups"
    ]
  },
  {
    id: 9,
    title: "9. Housing",
    category: "Infrastructure",
    icon: "Home",
    shortDescription: "Dignified, affordable housing for Kenyan families with tenant purchase schemes.",
    fullDescription: "Shelter is a basic human right. DCP will accelerate social housing projects, upgrading informal settlements with proper sanitation, security of tenure, and low-interest long-term mortgages.",
    keyGoals: [
      "Tenant-purchase scheme allowing monthly rent to count towards home ownership",
      "Slum upgrading programs with clean water, sewerage, and paved walkways",
      "Subsidized building materials for rural housing improvement",
      "Titling programs to give informal settlement dwellers land ownership security"
    ]
  },
  {
    id: 10,
    title: "10. Governance",
    category: "Governance",
    icon: "ShieldCheck",
    shortDescription: "Transparent, accountable public institutions fighting corruption fiercely.",
    fullDescription: "Corruption drains public resources and undermines citizen trust. DCP pledges zero tolerance to graft, lifestyle audits for public servants, independent judiciary funding, and direct public accountability forums (Skiza Wakenya Townhalls).",
    keyGoals: [
      "Mandatory public declaration of assets for senior elected and appointed officials",
      "Specialized fast-track Anti-Corruption courts with strict trial timelines",
      "Protection and financial rewards for whistleblowers exposing public fraud",
      "Strengthening the independence of Ethics & Anti-Corruption Commission (EACC)"
    ]
  },
  {
    id: 11,
    title: "11. National Unity",
    category: "Governance",
    icon: "Handshake",
    shortDescription: "Bridging communities and generations across Kenya under 'Skiza Wakenya'.",
    fullDescription: "Unity in diversity is Kenya's greatest strength. DCP rejects tribal mobilization and identity politics, championing a broad-based citizen front where every tribe, religion, and region is respected and represented equally.",
    keyGoals: [
      "Eradication of ethnic bias in public service recruitment and appointments",
      "National Skiza Wakenya cohesion dialogue forums in all 47 counties",
      "Peace building initiatives along inter-county boundary corridors",
      "Promotion of Swahili and local languages as instruments of national pride"
    ]
  }
];

// 47 Counties of Kenya with sample Constituencies
export const KENYA_COUNTIES: { [key: string]: string[] } = {
  "Nairobi": ["Westlands", "Dagoretti North", "Dagoretti South", "Lang'ata", "Kibarani", "Ruaraka", "Kasarani", "Embakasi South", "Embakasi North", "Embakasi Central", "Embakasi East", "Embakasi West", "Makadara", "Kamukunji", "Starehe", "Mathare"],
  "Kiambu": ["Gatundu South", "Gatundu North", "Juja", "Thika Town", "Ruiru", "Githunguri", "Kiambu", "Kiambaa", "Kabete", "Kikuyu", "Limuru", "Lari"],
  "Nakuru": ["Molo", "Njoro", "Naivasha", "Gilgil", "Kuresoi South", "Kuresoi North", "Subukia", "Rongai", "Bahati", "Nakuru Town West", "Nakuru Town East"],
  "Mombasa": ["Changamwe", "Jomvu", "Kisauni", "Nyali", "Likoni", "Mvita"],
  "Kisumu": ["Kisumu East", "Kisumu West", "Kisumu Central", "Seme", "Nyando", "Muhoroni", "Nyakach"],
  "Uasin Gishu": ["Soy", "Turbo", "Moiben", "Ainabkoi", "Kapseret", "Kesses"],
  "Machakos": ["Masinga", "Yatta", "Kangundo", "Matungulu", "Kathiani", "Mavoko", "Machakos Town", "Mwala"],
  "Kilifi": ["Kilifi North", "Kilifi South", "Kaloleni", "Rabai", "Ganze", "Malindi", "Magarini"],
  "Kakamega": ["Lugari", "Likuyani", "Malava", "Lurambi", "Navakholo", "Mumias West", "Mumias East", "Matungu", "Butere", "Khwisero", "Shinyalu", "Ikolomani"],
  "Meru": ["Igembe South", "Igembe Central", "Igembe North", "Tigania West", "Tigania East", "North Imenti", "Buuri", "Central Imenti", "South Imenti"],
  "Bungoma": ["Mt. Elgon", "Sirisia", "Kabuchai", "Bumula", "Kanduyi", "Webuye East", "Webuye West", "Kimilili", "Tongaren"],
  "Nyeri": ["Tetu", "Kieni", "Mathira", "Othaya", "Mukurweini", "Nyeri Town"],
  "Kajiado": ["Kajiado North", "Kajiado Central", "Kajiado East", "Kajiado West", "Kajiado South"],
  "Garissa": ["Garissa Township", "Balambala", "Lagdera", "Dadaab", "Fafi", "Ijara"],
  "Turkana": ["Turkana North", "Turkana West", "Turkana Central", "Loima", "Turkana South", "Turkana East"],
  "Makueni": ["Mbooni", "Kilome", "Kaiti", "Makueni", "Kibwezi West", "Kibwezi East"],
  "Murang'a": ["Kangema", "Mathioya", "Kiharu", "Kigumo", "Maragua", "Kandara", "Gatanga"],
  "Kisii": ["Bonchari", "South Mugirango", "Bomachoge Borabu", "Bobasi", "Bomachoge Chache", "Nyaribari Chache", "Nyaribari Masaba", "Kitutu Chache North", "Kitutu Chache South"],
  "Bomet": ["Sotik", "Chepalungu", "Bomet East", "Bomet Central", "Konoin"],
  "Kericho": ["Kipkelion East", "Kipkelion West", "Belgut", "Ainamoi", "Bureti", "Soin Sigowet"],
  "Trans Nzoia": ["Kwanza", "Endebess", "Saboti", "Kiminini", "Cherangany"],
  "Laikipia": ["Laikipia West", "Laikipia East", "Laikipia North"],
  "Narok": ["Kilgoris", "Emurua Dikirr", "Narok North", "Narok East", "Narok South", "Narok West"],
  "Embu": ["Manyatta", "Runyenjes", "Mbeere North", "Mbeere South"],
  "Kitui": ["Mwingi North", "Mwingi West", "Mwingi Central", "Kitui West", "Kitui Rural", "Kitui Central", "Kitui East", "Kitui South"],
  "Kwale": ["Msambweni", "Lunga Lunga", "Matuga", "Kinango"],
  "Nandi": ["Tinderet", "Aldai", "Nandi Hills", "Chesumei", "Emgwen", "Mosop"],
  "Homa Bay": ["Kasipul", "Kabondo Kasipul", "Karachuonyo", "Rangwe", "Homa Bay Town", "Ndhiwa", "Mbita", "Suba"],
  "Siaya": ["Ugenya", "Ugunja", "Alego Usonga", "Gemin", "Bondo", "Rarieda"],
  "Baringo": ["Tiaty", "Baringo North", "Baringo Central", "Baringo South", "Mogotio", "Eldama Ravine"],
  "Nyamira": ["Kitutu Masaba", "West Mugirango", "North Mugirango", "Borabu"],
  "Mandera": ["Mandera West", "Mandera Banissa", "Mandera North", "Mandera South", "Mandera East", "Lafey"],
  "Wajir": ["Wajir North", "Wajir West", "Wajir Eldas", "Wajir Tarbaj", "Wajir East", "Wajir South"],
  "Marsabit": ["Moyale", "North Horr", "Saku", "Laisamis"],
  "Isiolo": ["Isiolo North", "Isiolo South"],
  "Tharaka-Nithi": ["Maara", "Chuka/Igambang'ombe", "Tharaka"],
  "Nyandarua": ["Kinangop", "Kipipiri", "Ol Kalou", "Ol Jorok", "Ndaragwa"],
  "Samburu": ["Samburu West", "Samburu North", "Samburu East"],
  "Elgeyo-Marakwet": ["Marakwet East", "Marakwet West", "Keiyo North", "Keiyo South"],
  "West Pokot": ["Kapenguria", "Sigor", "Kacheliba", "Pokot South"],
  "Tana River": ["Garsen", "Galole", "Bura"],
  "Lamu": ["Lamu East", "Lamu West"],
  "Taita-Taveta": ["Taveta", "Wundanyi", "Mwatate", "Voi"],
  "Migori": ["Rongo", "Awendo", "Suna South", "Suna West", "Uriri", "Nyatike", "Kuria West", "Kuria East"],
  "Busia": ["Teso North", "Teso South", "Nambale", "Matayos", "Butula", "Funyula", "Budalangi"],
  "Vihiga": ["Vihiga", "Sabatia", "Hamisi", "Luanda", "Emuhaya"],
  "Baringo / Central": ["Baringo Central"]
};

export const COUNTY_OFFICES: CountyOffice[] = [
  {
    county: "Nairobi",
    code: 47,
    town: "Nairobi City",
    address: "Musa Gitau Road, Muthangari Drive, Lavington, Nairobi",
    phone: "+254 700 123 456",
    email: "nairobi@dcp.or.ke",
    coordinator: "Hon. James Omondi"
  },
  {
    county: "Mombasa",
    code: 1,
    town: "Mombasa Town",
    address: "DCP Secretariat Plaza, Nkrumah Road, Mombasa",
    phone: "+254 711 234 567",
    email: "mombasa@dcp.or.ke",
    coordinator: "Amina Hassan Mzee"
  },
  {
    county: "Kisumu",
    code: 42,
    town: "Kisumu CBD",
    address: "Skiza House, Oginga Odinga Street, Kisumu",
    phone: "+254 722 345 678",
    email: "kisumu@dcp.or.ke",
    coordinator: "Otieno Wafula"
  },
  {
    county: "Nakuru",
    code: 32,
    town: "Nakuru Town",
    address: "Kenyatta Avenue, Near County Assembly, Nakuru",
    phone: "+254 733 456 789",
    email: "nakuru@dcp.or.ke",
    coordinator: "Grace Wanjiru Kamau"
  },
  {
    county: "Uasin Gishu",
    code: 27,
    town: "Eldoret",
    address: "Uganda Road, Skiza Center, Eldoret",
    phone: "+254 744 567 890",
    email: "eldoret@dcp.or.ke",
    coordinator: "Kipchumba Chebet"
  },
  {
    county: "Kiambu",
    code: 22,
    town: "Thika",
    address: "Commercial Street, Opposite Sub-County Offices, Thika",
    phone: "+254 755 678 901",
    email: "kiambu@dcp.or.ke",
    coordinator: "David Njuguna"
  }
];
