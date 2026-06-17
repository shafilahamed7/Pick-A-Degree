import { PrismaClient, CollegeType, Ownership, DegreeType, EventType, FacilityType } from "../node_modules/.prisma/client";

const prisma = new PrismaClient();

const colleges = [
  {
    name: "Indian Institute of Technology Madras",
    slug: "iit-madras",
    type: CollegeType.IIT,
    ownership: Ownership.CENTRAL_GOVT,
    established: 1959,
    address: "IIT P.O., Chennai",
    city: "Chennai",
    district: "Chennai",
    pincode: "600036",
    phone: "044-22578000",
    website: "https://www.iitm.ac.in",
    latitude: 12.9915,
    longitude: 80.2337,
    naacGrade: "A++",
    nirfRank: 1,
    description: "Premier engineering institution ranked #1 in India by NIRF consistently.",
    placementPercent: 95,
    avgPackage: 22,
    highPackage: 2.8,
    recruiters: ["Google", "Microsoft", "Amazon", "Goldman Sachs", "McKinsey"],
    departments: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering"],
    courses: [
      { name: "B.Tech Computer Science Engineering", degreeType: DegreeType.UG, duration: 4, seats: 120, fee: 100000 },
      { name: "B.Tech Electrical Engineering", degreeType: DegreeType.UG, duration: 4, seats: 80, fee: 100000 },
      { name: "M.Tech AI & Data Science", degreeType: DegreeType.PG, duration: 2, seats: 30, fee: 50000 },
    ],
  },
  {
    name: "National Institute of Technology Trichy",
    slug: "nit-trichy",
    type: CollegeType.NIT,
    ownership: Ownership.CENTRAL_GOVT,
    established: 1964,
    address: "Tanjore Main Road, National Highway 67",
    city: "Tiruchirappalli",
    district: "Tiruchirappalli",
    pincode: "620015",
    phone: "0431-2503000",
    website: "https://www.nitt.edu",
    latitude: 10.7605,
    longitude: 78.8197,
    naacGrade: "A+",
    nirfRank: 9,
    description: "Top NIT in India, consistently ranked among the best engineering institutes.",
    placementPercent: 90,
    avgPackage: 14,
    highPackage: 1.2,
    recruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "Amazon", "Zoho"],
    departments: ["Computer Science", "Electronics", "Mechanical", "Civil", "Chemical"],
    courses: [
      { name: "B.Tech Computer Science Engineering", degreeType: DegreeType.UG, duration: 4, seats: 130, fee: 75000 },
      { name: "B.Tech Electronics & Communication", degreeType: DegreeType.UG, duration: 4, seats: 100, fee: 75000 },
      { name: "M.Tech VLSI Design", degreeType: DegreeType.PG, duration: 2, seats: 25, fee: 40000 },
    ],
  },
  {
    name: "Anna University",
    slug: "anna-university",
    type: CollegeType.UNIVERSITY,
    ownership: Ownership.GOVERNMENT,
    established: 1978,
    address: "Sardar Patel Road, Guindy",
    city: "Chennai",
    district: "Chennai",
    pincode: "600025",
    phone: "044-22351723",
    website: "https://www.annauniv.edu",
    latitude: 13.0117,
    longitude: 80.2351,
    naacGrade: "A++",
    nirfRank: 22,
    description: "Premier technical university in Tamil Nadu, affiliating hundreds of engineering colleges.",
    placementPercent: 85,
    avgPackage: 8,
    highPackage: 0.6,
    recruiters: ["TCS", "Infosys", "Zoho", "HCL", "Tech Mahindra"],
    departments: ["Computer Science", "Information Technology", "Electrical", "Mechanical", "Chemical"],
    courses: [
      { name: "B.E Computer Science Engineering", degreeType: DegreeType.UG, duration: 4, seats: 200, fee: 60000 },
      { name: "M.E Software Engineering", degreeType: DegreeType.PG, duration: 2, seats: 60, fee: 30000 },
      { name: "Ph.D Computer Science", degreeType: DegreeType.RESEARCH, duration: 3, seats: 20, fee: 25000 },
    ],
  },
  {
    name: "PSG College of Technology",
    slug: "psg-college-of-technology",
    type: CollegeType.AUTONOMOUS,
    ownership: Ownership.PRIVATE_AIDED,
    established: 1951,
    address: "Peelamedu, Avinashi Road",
    city: "Coimbatore",
    district: "Coimbatore",
    pincode: "641004",
    phone: "0422-4344000",
    website: "https://www.psgtech.edu",
    latitude: 11.024,
    longitude: 77.0095,
    naacGrade: "A+",
    nirfRank: 45,
    description: "One of the oldest and most reputed engineering colleges in Tamil Nadu.",
    placementPercent: 88,
    avgPackage: 9,
    highPackage: 0.8,
    recruiters: ["Zoho", "TCS", "Infosys", "Cognizant", "L&T"],
    departments: ["Computer Science", "Mechanical", "Electronics", "Civil", "Textile"],
    courses: [
      { name: "B.E Computer Science Engineering", degreeType: DegreeType.UG, duration: 4, seats: 180, fee: 80000 },
      { name: "B.E Mechanical Engineering", degreeType: DegreeType.UG, duration: 4, seats: 120, fee: 80000 },
      { name: "M.E Computer Science", degreeType: DegreeType.PG, duration: 2, seats: 40, fee: 45000 },
    ],
  },
  {
    name: "Coimbatore Institute of Technology",
    slug: "coimbatore-institute-of-technology",
    type: CollegeType.AUTONOMOUS,
    ownership: Ownership.GOVERNMENT,
    established: 1956,
    address: "Civil Aerodrome Post",
    city: "Coimbatore",
    district: "Coimbatore",
    pincode: "641014",
    phone: "0422-2574071",
    website: "https://www.cit.edu.in",
    latitude: 11.0175,
    longitude: 76.9583,
    naacGrade: "A",
    nirfRank: 67,
    description: "Government aided autonomous college with excellent placements and research facilities.",
    placementPercent: 82,
    avgPackage: 7.5,
    highPackage: 0.55,
    recruiters: ["TCS", "Wipro", "HCL", "Zoho", "Infosys"],
    departments: ["Computer Science", "Electrical", "Mechanical", "Civil"],
    courses: [
      { name: "B.E Computer Science Engineering", degreeType: DegreeType.UG, duration: 4, seats: 120, fee: 65000 },
      { name: "B.E Electrical Engineering", degreeType: DegreeType.UG, duration: 4, seats: 90, fee: 65000 },
    ],
  },
  {
    name: "SSN College of Engineering",
    slug: "ssn-college-of-engineering",
    type: CollegeType.AUTONOMOUS,
    ownership: Ownership.PRIVATE_UNAIDED,
    established: 1996,
    address: "Old Mahabalipuram Road, Kalavakkam",
    city: "Chennai",
    district: "Chennai",
    pincode: "603110",
    phone: "044-27469700",
    website: "https://www.ssn.edu.in",
    latitude: 12.7634,
    longitude: 80.2274,
    naacGrade: "A++",
    nirfRank: 52,
    description: "Top private engineering college in Chennai, known for excellent placements and research.",
    placementPercent: 92,
    avgPackage: 12,
    highPackage: 1.0,
    recruiters: ["Google", "Microsoft", "Amazon", "Flipkart", "Zoho", "TCS"],
    departments: ["Computer Science", "Electronics", "Mechanical", "Electrical", "IT"],
    courses: [
      { name: "B.E Computer Science Engineering", degreeType: DegreeType.UG, duration: 4, seats: 180, fee: 110000 },
      { name: "B.E Electronics & Communication", degreeType: DegreeType.UG, duration: 4, seats: 120, fee: 110000 },
    ],
  },
  {
    name: "Thiagarajar College of Engineering",
    slug: "thiagarajar-college-of-engineering",
    type: CollegeType.AUTONOMOUS,
    ownership: Ownership.PRIVATE_AIDED,
    established: 1957,
    address: "Thiruparankundram",
    city: "Madurai",
    district: "Madurai",
    pincode: "625015",
    phone: "0452-2482240",
    website: "https://www.tce.edu",
    latitude: 9.8926,
    longitude: 78.0892,
    naacGrade: "A+",
    nirfRank: 71,
    description: "Premier engineering college in South Tamil Nadu with strong industry connections.",
    placementPercent: 85,
    avgPackage: 8,
    highPackage: 0.65,
    recruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "HCL"],
    departments: ["Computer Science", "Mechanical", "Electrical", "Civil", "Electronics"],
    courses: [
      { name: "B.E Computer Science Engineering", degreeType: DegreeType.UG, duration: 4, seats: 120, fee: 75000 },
      { name: "B.E Mechanical Engineering", degreeType: DegreeType.UG, duration: 4, seats: 90, fee: 75000 },
    ],
  },
  {
    name: "Government College of Technology Coimbatore",
    slug: "gct-coimbatore",
    type: CollegeType.GOVERNMENT,
    ownership: Ownership.GOVERNMENT,
    established: 1945,
    address: "Thadagam Road",
    city: "Coimbatore",
    district: "Coimbatore",
    pincode: "641013",
    phone: "0422-2432222",
    website: "https://www.gct.ac.in",
    latitude: 11.0335,
    longitude: 76.9688,
    naacGrade: "A",
    nirfRank: 89,
    description: "Oldest government engineering college in Tamil Nadu.",
    placementPercent: 78,
    avgPackage: 6.5,
    highPackage: 0.45,
    recruiters: ["TCS", "Wipro", "HCL", "Hexaware", "Infosys"],
    departments: ["Computer Science", "Mechanical", "Textile", "Civil", "Electrical"],
    courses: [
      { name: "B.E Computer Science Engineering", degreeType: DegreeType.UG, duration: 4, seats: 90, fee: 45000 },
      { name: "B.E Mechanical Engineering", degreeType: DegreeType.UG, duration: 4, seats: 60, fee: 45000 },
    ],
  },
  {
    name: "Madras Medical College",
    slug: "madras-medical-college",
    type: CollegeType.GOVERNMENT,
    ownership: Ownership.GOVERNMENT,
    established: 1835,
    address: "Park Town",
    city: "Chennai",
    district: "Chennai",
    pincode: "600003",
    phone: "044-25305000",
    website: "https://www.mmc.tn.gov.in",
    latitude: 13.0801,
    longitude: 80.2675,
    naacGrade: "A",
    description: "One of Asia's oldest and most prestigious medical colleges.",
    placementPercent: 95,
    avgPackage: 10,
    highPackage: 0.5,
    recruiters: ["Government Hospitals", "Apollo", "Fortis", "AIIMS", "CMC Vellore"],
    departments: ["General Medicine", "Surgery", "Pediatrics", "Obstetrics", "Radiology"],
    courses: [
      { name: "MBBS", degreeType: DegreeType.UG, duration: 5, seats: 250, fee: 15000 },
      { name: "MD General Medicine", degreeType: DegreeType.PG, duration: 3, seats: 30, fee: 10000 },
    ],
  },
  {
    name: "VIT University",
    slug: "vit-university",
    type: CollegeType.DEEMED,
    ownership: Ownership.PRIVATE_UNAIDED,
    established: 1984,
    address: "Vellore",
    city: "Vellore",
    district: "Vellore",
    pincode: "632014",
    phone: "0416-2243091",
    website: "https://www.vit.ac.in",
    latitude: 12.9698,
    longitude: 79.1559,
    naacGrade: "A++",
    nirfRank: 11,
    description: "Deemed university known for global outlook, strong placements, and research.",
    placementPercent: 89,
    avgPackage: 11,
    highPackage: 1.1,
    recruiters: ["Google", "Microsoft", "Amazon", "Samsung", "TCS", "Zoho"],
    departments: ["Computer Science", "Electronics", "Mechanical", "Biotechnology", "IT"],
    courses: [
      { name: "B.Tech Computer Science Engineering", degreeType: DegreeType.UG, duration: 4, seats: 600, fee: 195000 },
      { name: "B.Tech AI & Machine Learning", degreeType: DegreeType.UG, duration: 4, seats: 120, fee: 210000 },
      { name: "M.Tech Software Engineering", degreeType: DegreeType.PG, duration: 2, seats: 60, fee: 120000 },
    ],
  },
];

async function main() {
  console.log("Seeding database...");

  for (const data of colleges) {
    const { placementPercent, avgPackage, highPackage, recruiters, departments, courses, ...collegeData } = data;

    const college = await prisma.college.upsert({
      where: { slug: collegeData.slug },
      update: {},
      create: collegeData,
    });

    await prisma.placement.upsert({
      where: { id: `placement-${college.id}` },
      update: {},
      create: {
        id: `placement-${college.id}`,
        year: 2024,
        placementPercent,
        averagePackage: avgPackage,
        highestPackage: highPackage,
        topRecruiters: recruiters,
        collegeId: college.id,
      },
    });

    for (const deptName of departments) {
      const dept = await prisma.department.create({
        data: { name: deptName, collegeId: college.id },
      });

      const deptCourses = courses.filter((c) =>
        c.name.toLowerCase().includes(deptName.toLowerCase().split(" ")[0].toLowerCase())
      );

      for (const course of deptCourses) {
        await prisma.course.create({
          data: {
            name: course.name,
            degreeType: course.degreeType,
            duration: course.duration,
            totalSeats: course.seats,
            annualFee: course.fee,
            departmentId: dept.id,
          },
        });
      }
    }

    await prisma.event.create({
      data: {
        title: `Annual Technical Symposium ${new Date().getFullYear()}`,
        eventType: EventType.TECHNICAL,
        startDate: new Date("2025-03-15"),
        endDate: new Date("2025-03-16"),
        venue: "Main Auditorium",
        collegeId: college.id,
      },
    });

    for (const facilityName of ["Library", "Hostel", "Sports Complex", "Computer Lab", "Canteen"]) {
      const typeMap: Record<string, FacilityType> = {
        Library: FacilityType.LIBRARY,
        Hostel: FacilityType.HOSTEL,
        "Sports Complex": FacilityType.SPORTS,
        "Computer Lab": FacilityType.LAB,
        Canteen: FacilityType.CANTEEN,
      };
      await prisma.facility.create({
        data: { name: facilityName, type: typeMap[facilityName], collegeId: college.id },
      });
    }
  }

  console.log(`Seeded ${colleges.length} colleges successfully.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
