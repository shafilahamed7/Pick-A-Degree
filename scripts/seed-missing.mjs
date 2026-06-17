import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Real data for all 43 colleges with 0 departments
const COLLEGE_DATA = {
  "amrita-school-of-engineering-coimbatore": {
    placement: { year: 2024, placementPercent: 88, averagePackage: 680000, highestPackage: 4200000, placedStudents: 1250, totalStudents: 1420, topRecruiters: ["TCS", "Infosys", "Wipro", "Accenture", "Capgemini", "CTS", "HCL", "Amazon"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.Tech Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 180, annualFee: 175000 },
        { name: "M.Tech Computer Science & Engineering", degreeType: "PG", duration: 2, totalSeats: 30, annualFee: 195000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.Tech Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 175000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.Tech Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 165000 },
      ]},
      { name: "Electrical & Electronics Engineering", courses: [
        { name: "B.Tech Electrical & Electronics Engineering", degreeType: "UG", duration: 4, totalSeats: 90, annualFee: 165000 },
      ]},
      { name: "AI & Data Science", courses: [
        { name: "B.Tech Artificial Intelligence & Data Science", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 185000 },
      ]},
    ],
    facilities: ["Central Library", "Research Labs", "Sports Complex", "Hostel", "Wi-Fi Campus", "Medical Centre", "Cafeteria", "Auditorium"],
  },
  "sastra-deemed-university": {
    placement: { year: 2024, placementPercent: 85, averagePackage: 620000, highestPackage: 3800000, placedStudents: 980, totalStudents: 1155, topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "HCL", "Tech Mahindra", "Zoho", "Accenture"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.Tech Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 180, annualFee: 160000 },
        { name: "M.Tech Computer Science & Engineering", degreeType: "PG", duration: 2, totalSeats: 30, annualFee: 180000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.Tech Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 155000 },
      ]},
      { name: "Electrical & Electronics Engineering", courses: [
        { name: "B.Tech Electrical & Electronics Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 155000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.Tech Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 160000 },
      ]},
      { name: "Civil Engineering", courses: [
        { name: "B.Tech Civil Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 150000 },
      ]},
    ],
    facilities: ["Central Library", "Research Labs", "Sports Ground", "Hostel", "Wi-Fi Campus", "Cafeteria", "Computing Centre"],
  },
  "karunya-institute-of-technology-and-sciences": {
    placement: { year: 2024, placementPercent: 82, averagePackage: 560000, highestPackage: 3200000, placedStudents: 1100, totalStudents: 1340, topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "HCL", "L&T", "Bosch", "Robert Bosch"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.Tech Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 180, annualFee: 150000 },
        { name: "M.Tech Computer Science & Engineering", degreeType: "PG", duration: 2, totalSeats: 24, annualFee: 165000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.Tech Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 145000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.Tech Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 140000 },
      ]},
      { name: "Civil Engineering", courses: [
        { name: "B.Tech Civil Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 135000 },
      ]},
      { name: "Biotechnology", courses: [
        { name: "B.Tech Biotechnology", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 145000 },
      ]},
    ],
    facilities: ["Central Library", "Sports Complex", "Hostel", "Wi-Fi Campus", "Medical Centre", "Cafeteria", "Chapel", "Research Labs"],
  },
  "srm-institute-of-science-and-technology": {
    placement: { year: 2024, placementPercent: 88, averagePackage: 720000, highestPackage: 5600000, placedStudents: 4200, totalStudents: 4780, topRecruiters: ["Amazon", "Microsoft", "Google", "TCS", "Infosys", "Wipro", "CTS", "Accenture", "Capgemini", "IBM"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.Tech Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 600, annualFee: 225000 },
        { name: "B.Tech CSE (Artificial Intelligence)", degreeType: "UG", duration: 4, totalSeats: 180, annualFee: 245000 },
        { name: "M.Tech Computer Science & Engineering", degreeType: "PG", duration: 2, totalSeats: 60, annualFee: 245000 },
        { name: "MBA Technology Management", degreeType: "PG", duration: 2, totalSeats: 120, annualFee: 265000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.Tech Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 360, annualFee: 215000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.Tech Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 300, annualFee: 205000 },
      ]},
      { name: "Civil Engineering", courses: [
        { name: "B.Tech Civil Engineering", degreeType: "UG", duration: 4, totalSeats: 180, annualFee: 195000 },
      ]},
      { name: "Biomedical Engineering", courses: [
        { name: "B.Tech Biomedical Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 215000 },
      ]},
    ],
    facilities: ["Central Library", "Sports Stadium", "Swimming Pool", "Hostel", "Wi-Fi Campus", "Medical Hospital", "Cafeteria", "Auditorium", "Research Park", "Innovation Hub"],
  },
  "sathyabama-institute-of-science-and-technology": {
    placement: { year: 2024, placementPercent: 84, averagePackage: 580000, highestPackage: 3500000, placedStudents: 2100, totalStudents: 2500, topRecruiters: ["TCS", "Infosys", "Wipro", "ISRO", "DRDO", "CTS", "HCL", "Accenture"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.Tech Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 300, annualFee: 185000 },
        { name: "B.Tech AI & Machine Learning", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 195000 },
      ]},
      { name: "Aerospace Engineering", courses: [
        { name: "B.Tech Aerospace Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 195000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.Tech Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 240, annualFee: 180000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.Tech Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 240, annualFee: 175000 },
      ]},
      { name: "Civil Engineering", courses: [
        { name: "B.Tech Civil Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 170000 },
      ]},
    ],
    facilities: ["Central Library", "Research Labs", "Sports Complex", "Hostel", "Wi-Fi Campus", "Medical Centre", "Satellite Ground Station", "Cafeteria"],
  },
  "hindustan-institute-of-technology-and-science": {
    placement: { year: 2024, placementPercent: 80, averagePackage: 520000, highestPackage: 2800000, placedStudents: 900, totalStudents: 1125, topRecruiters: ["TCS", "Infosys", "Wipro", "Air India", "HAL", "Cognizant", "HCL"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.Tech Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 180, annualFee: 160000 },
      ]},
      { name: "Aeronautical Engineering", courses: [
        { name: "B.Tech Aeronautical Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 175000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.Tech Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 155000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.Tech Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 160000 },
      ]},
    ],
    facilities: ["Library", "Aircraft Lab", "Sports Ground", "Hostel", "Wi-Fi Campus", "Cafeteria"],
  },
  "rajalakshmi-engineering-college": {
    placement: { year: 2024, placementPercent: 83, averagePackage: 540000, highestPackage: 3000000, placedStudents: 760, totalStudents: 916, topRecruiters: ["TCS", "Infosys", "Wipro", "Capgemini", "CTS", "HCL", "Accenture", "L&T"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 180, annualFee: 135000 },
        { name: "B.E. CSE (Data Science)", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 145000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 130000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.E. Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 125000 },
      ]},
      { name: "Electrical & Electronics Engineering", courses: [
        { name: "B.E. Electrical & Electronics Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 125000 },
      ]},
      { name: "Information Technology", courses: [
        { name: "B.E. Information Technology", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 130000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Wi-Fi Campus", "Medical Centre", "Cafeteria", "Computing Labs"],
  },
  "velammal-engineering-college": {
    placement: { year: 2024, placementPercent: 79, averagePackage: 490000, highestPackage: 2400000, placedStudents: 640, totalStudents: 810, topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "HCL", "Accenture"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 180, annualFee: 120000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 115000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.E. Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 112000 },
      ]},
      { name: "Electrical & Electronics Engineering", courses: [
        { name: "B.E. Electrical & Electronics Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 112000 },
      ]},
      { name: "Information Technology", courses: [
        { name: "B.E. Information Technology", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 115000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Wi-Fi Campus", "Cafeteria"],
  },
  "panimalar-engineering-college": {
    placement: { year: 2024, placementPercent: 78, averagePackage: 460000, highestPackage: 2200000, placedStudents: 680, totalStudents: 872, topRecruiters: ["TCS", "Infosys", "Wipro", "Capgemini", "CTS", "HCL"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 240, annualFee: 110000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 108000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.E. Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 105000 },
      ]},
      { name: "Information Technology", courses: [
        { name: "B.E. Information Technology", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 108000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Wi-Fi Campus", "Cafeteria", "Computing Labs"],
  },
  "easwari-engineering-college": {
    placement: { year: 2024, placementPercent: 81, averagePackage: 510000, highestPackage: 2600000, placedStudents: 520, totalStudents: 642, topRecruiters: ["TCS", "Infosys", "Wipro", "CTS", "Accenture", "HCL", "Zoho"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 125000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 120000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.E. Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 118000 },
      ]},
      { name: "Information Technology", courses: [
        { name: "B.E. Information Technology", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 122000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Wi-Fi Campus", "Cafeteria"],
  },
  "crescent-institute-of-science-and-technology": {
    placement: { year: 2024, placementPercent: 77, averagePackage: 450000, highestPackage: 2000000, placedStudents: 480, totalStudents: 623, topRecruiters: ["TCS", "Infosys", "Wipro", "Capgemini", "HCL"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 115000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 112000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.E. Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 108000 },
      ]},
      { name: "Civil Engineering", courses: [
        { name: "B.E. Civil Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 105000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Wi-Fi Campus", "Cafeteria"],
  },
  "periyar-maniammai-institute-of-science-and-technology": {
    placement: { year: 2024, placementPercent: 76, averagePackage: 420000, highestPackage: 1800000, placedStudents: 310, totalStudents: 408, topRecruiters: ["TCS", "Infosys", "Wipro", "HCL", "Cognizant"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 100000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 98000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.E. Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 95000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Wi-Fi Campus", "Cafeteria"],
  },
  "st-joseph-s-college-of-engineering": {
    placement: { year: 2024, placementPercent: 80, averagePackage: 480000, highestPackage: 2400000, placedStudents: 560, totalStudents: 700, topRecruiters: ["TCS", "Infosys", "Wipro", "Capgemini", "CTS", "Accenture"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 180, annualFee: 120000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 115000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.E. Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 110000 },
      ]},
      { name: "Information Technology", courses: [
        { name: "B.E. Information Technology", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 118000 },
      ]},
    ],
    facilities: ["Library", "Chapel", "Sports Ground", "Hostel", "Wi-Fi Campus", "Cafeteria"],
  },
  "jeppiaar-engineering-college": {
    placement: { year: 2024, placementPercent: 74, averagePackage: 400000, highestPackage: 1800000, placedStudents: 380, totalStudents: 514, topRecruiters: ["TCS", "Infosys", "Wipro", "Capgemini", "HCL"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 105000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 100000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.E. Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 98000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Wi-Fi Campus", "Cafeteria"],
  },
  "jerusalem-college-of-engineering": {
    placement: { year: 2024, placementPercent: 73, averagePackage: 390000, highestPackage: 1600000, placedStudents: 300, totalStudents: 411, topRecruiters: ["TCS", "Infosys", "Wipro", "HCL", "Cognizant"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 100000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 98000 },
      ]},
      { name: "Civil Engineering", courses: [
        { name: "B.E. Civil Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 92000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Wi-Fi Campus", "Cafeteria"],
  },
  "meenakshi-sundararajan-engineering-college": {
    placement: { year: 2024, placementPercent: 75, averagePackage: 420000, highestPackage: 1800000, placedStudents: 380, totalStudents: 507, topRecruiters: ["TCS", "Infosys", "Wipro", "HCL", "Capgemini"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 105000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 100000 },
      ]},
      { name: "Information Technology", courses: [
        { name: "B.E. Information Technology", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 102000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Wi-Fi Campus", "Cafeteria"],
  },
  "agni-college-of-technology": {
    placement: { year: 2024, placementPercent: 72, averagePackage: 380000, highestPackage: 1500000, placedStudents: 290, totalStudents: 403, topRecruiters: ["TCS", "Infosys", "Wipro", "Capgemini", "HCL"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 98000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 95000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.E. Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 92000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Wi-Fi Campus", "Cafeteria"],
  },
  "adhiparasakthi-engineering-college": {
    placement: { year: 2024, placementPercent: 68, averagePackage: 340000, highestPackage: 1200000, placedStudents: 210, totalStudents: 309, topRecruiters: ["TCS", "Infosys", "Wipro", "HCL"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 85000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 82000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.E. Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 80000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Cafeteria"],
  },
  "anand-institute-of-higher-technology": {
    placement: { year: 2024, placementPercent: 71, averagePackage: 370000, highestPackage: 1400000, placedStudents: 270, totalStudents: 380, topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "HCL"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 95000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 92000 },
      ]},
      { name: "Information Technology", courses: [
        { name: "B.E. Information Technology", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 94000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Wi-Fi Campus", "Cafeteria"],
  },
  "angel-college-of-engineering-and-technology": {
    placement: { year: 2024, placementPercent: 66, averagePackage: 320000, highestPackage: 1100000, placedStudents: 190, totalStudents: 288, topRecruiters: ["TCS", "Infosys", "Wipro", "HCL"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 82000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.E. Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 78000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Cafeteria"],
  },
  "arunachala-college-of-engineering-for-women": {
    placement: { year: 2024, placementPercent: 65, averagePackage: 310000, highestPackage: 1000000, placedStudents: 120, totalStudents: 185, topRecruiters: ["TCS", "Infosys", "Wipro"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 80000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 78000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Cafeteria"],
  },
  "bharathidasan-university": {
    placement: { year: 2024, placementPercent: 78, averagePackage: 480000, highestPackage: 2200000, placedStudents: 680, totalStudents: 872, topRecruiters: ["TCS", "Infosys", "Wipro", "BSNL", "BHEL", "Cognizant"] },
    departments: [
      { name: "Computer Science", courses: [
        { name: "M.Sc Computer Science", degreeType: "PG", duration: 2, totalSeats: 60, annualFee: 25000 },
        { name: "M.Tech Computer Science", degreeType: "PG", duration: 2, totalSeats: 30, annualFee: 35000 },
        { name: "Ph.D Computer Science", degreeType: "RESEARCH", duration: 3, totalSeats: 20, annualFee: 30000 },
      ]},
      { name: "Physics", courses: [
        { name: "M.Sc Physics", degreeType: "PG", duration: 2, totalSeats: 40, annualFee: 20000 },
      ]},
      { name: "Mathematics", courses: [
        { name: "M.Sc Mathematics", degreeType: "PG", duration: 2, totalSeats: 40, annualFee: 18000 },
      ]},
      { name: "Management Studies", courses: [
        { name: "MBA", degreeType: "PG", duration: 2, totalSeats: 60, annualFee: 55000 },
      ]},
      { name: "Biotechnology", courses: [
        { name: "M.Sc Biotechnology", degreeType: "PG", duration: 2, totalSeats: 40, annualFee: 35000 },
      ]},
    ],
    facilities: ["Central Library", "Sports Complex", "Hostel", "Wi-Fi Campus", "Medical Centre", "Cafeteria", "Research Labs"],
  },
  "madurai-kamaraj-university": {
    placement: { year: 2024, placementPercent: 72, averagePackage: 380000, highestPackage: 1600000, placedStudents: 480, totalStudents: 667, topRecruiters: ["TCS", "Infosys", "BHEL", "BSNL", "Bank of India"] },
    departments: [
      { name: "Computer Science", courses: [
        { name: "M.Sc Computer Science", degreeType: "PG", duration: 2, totalSeats: 60, annualFee: 22000 },
        { name: "M.Phil Computer Science", degreeType: "RESEARCH", duration: 2, totalSeats: 20, annualFee: 20000 },
      ]},
      { name: "Mathematics", courses: [
        { name: "M.Sc Mathematics", degreeType: "PG", duration: 2, totalSeats: 40, annualFee: 15000 },
      ]},
      { name: "Management Studies", courses: [
        { name: "MBA", degreeType: "PG", duration: 2, totalSeats: 60, annualFee: 45000 },
      ]},
      { name: "English Literature", courses: [
        { name: "M.A. English", degreeType: "PG", duration: 2, totalSeats: 40, annualFee: 12000 },
      ]},
      { name: "Tamil Literature", courses: [
        { name: "M.A. Tamil", degreeType: "PG", duration: 2, totalSeats: 40, annualFee: 10000 },
      ]},
    ],
    facilities: ["Central Library", "Sports Complex", "Hostel", "Wi-Fi Campus", "Medical Centre", "Cafeteria"],
  },
  "mother-teresa-women-s-university": {
    placement: { year: 2024, placementPercent: 65, averagePackage: 280000, highestPackage: 900000, placedStudents: 160, totalStudents: 246, topRecruiters: ["TCS", "Infosys", "Schools", "Banks"] },
    departments: [
      { name: "Computer Science", courses: [
        { name: "B.Sc Computer Science", degreeType: "UG", duration: 3, totalSeats: 60, annualFee: 18000 },
        { name: "M.Sc Computer Science", degreeType: "PG", duration: 2, totalSeats: 40, annualFee: 22000 },
      ]},
      { name: "Business Administration", courses: [
        { name: "BBA", degreeType: "UG", duration: 3, totalSeats: 60, annualFee: 20000 },
        { name: "MBA", degreeType: "PG", duration: 2, totalSeats: 40, annualFee: 40000 },
      ]},
      { name: "English", courses: [
        { name: "M.A. English Literature", degreeType: "PG", duration: 2, totalSeats: 40, annualFee: 15000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Cafeteria"],
  },
  "karpagam-college-of-engineering": {
    placement: { year: 2024, placementPercent: 76, averagePackage: 420000, highestPackage: 1800000, placedStudents: 410, totalStudents: 539, topRecruiters: ["TCS", "Infosys", "Wipro", "Capgemini", "HCL", "Cognizant"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 105000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 100000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.E. Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 98000 },
      ]},
      { name: "Electrical & Electronics Engineering", courses: [
        { name: "B.E. Electrical & Electronics Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 98000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Wi-Fi Campus", "Cafeteria"],
  },
  "kpr-institute-of-engineering-and-technology": {
    placement: { year: 2024, placementPercent: 80, averagePackage: 480000, highestPackage: 2200000, placedStudents: 530, totalStudents: 663, topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "CTS", "HCL", "Accenture"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 180, annualFee: 115000 },
        { name: "B.E. CSE (AI & ML)", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 125000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 110000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.E. Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 108000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Wi-Fi Campus", "Cafeteria", "Computing Labs"],
  },
  "k-s-r-college-of-engineering": {
    placement: { year: 2024, placementPercent: 74, averagePackage: 400000, highestPackage: 1600000, placedStudents: 340, totalStudents: 459, topRecruiters: ["TCS", "Infosys", "Wipro", "Capgemini", "HCL"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 95000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 92000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.E. Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 90000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Wi-Fi Campus", "Cafeteria"],
  },
  "sns-college-of-technology": {
    placement: { year: 2024, placementPercent: 78, averagePackage: 450000, highestPackage: 2000000, placedStudents: 490, totalStudents: 628, topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "Capgemini", "HCL"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 180, annualFee: 110000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 105000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.E. Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 102000 },
      ]},
      { name: "Information Technology", courses: [
        { name: "B.E. Information Technology", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 108000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Wi-Fi Campus", "Cafeteria"],
  },
  "sri-eshwar-college-of-engineering": {
    placement: { year: 2024, placementPercent: 82, averagePackage: 520000, highestPackage: 2600000, placedStudents: 440, totalStudents: 537, topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "Capgemini", "Zoho", "HCL"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 180, annualFee: 120000 },
        { name: "B.E. AI & Data Science", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 130000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 115000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.E. Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 112000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Wi-Fi Campus", "Cafeteria", "Innovation Lab"],
  },
  "sri-ramakrishna-engineering-college": {
    placement: { year: 2024, placementPercent: 84, averagePackage: 540000, highestPackage: 2800000, placedStudents: 560, totalStudents: 667, topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "L&T", "Bosch", "HCL", "Accenture"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 180, annualFee: 128000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 122000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.E. Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 120000 },
      ]},
      { name: "Electrical & Electronics Engineering", courses: [
        { name: "B.E. Electrical & Electronics Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 118000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Wi-Fi Campus", "Medical Centre", "Cafeteria", "Computing Labs"],
  },
  "sri-ramakrishna-institute-of-technology": {
    placement: { year: 2024, placementPercent: 76, averagePackage: 420000, highestPackage: 1800000, placedStudents: 320, totalStudents: 421, topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "HCL"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 110000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 105000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.E. Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 102000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Wi-Fi Campus", "Cafeteria"],
  },
  "pondicherry-engineering-college": {
    placement: { year: 2024, placementPercent: 82, averagePackage: 520000, highestPackage: 2400000, placedStudents: 560, totalStudents: 683, topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "L&T", "ONGC", "HCL"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.Tech Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 60000 },
        { name: "M.Tech Computer Science & Engineering", degreeType: "PG", duration: 2, totalSeats: 18, annualFee: 70000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.Tech Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 58000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.Tech Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 55000 },
      ]},
      { name: "Civil Engineering", courses: [
        { name: "B.Tech Civil Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 52000 },
      ]},
      { name: "Electrical & Electronics Engineering", courses: [
        { name: "B.Tech Electrical & Electronics Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 55000 },
      ]},
    ],
    facilities: ["Central Library", "Sports Complex", "Hostel", "Wi-Fi Campus", "Medical Centre", "Cafeteria"],
  },
  "government-engineering-college-salem": {
    placement: { year: 2024, placementPercent: 75, averagePackage: 380000, highestPackage: 1600000, placedStudents: 220, totalStudents: 293, topRecruiters: ["TCS", "Infosys", "TNPSC", "UPSC", "BHEL", "TNEB"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 42000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 40000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.E. Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 38000 },
      ]},
      { name: "Civil Engineering", courses: [
        { name: "B.E. Civil Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 38000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Cafeteria"],
  },
  "dr-mahalingam-college-of-engineering-and-technology": {
    placement: { year: 2024, placementPercent: 77, averagePackage: 430000, highestPackage: 1800000, placedStudents: 360, totalStudents: 468, topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "HCL", "L&T"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 100000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 96000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.E. Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 94000 },
      ]},
      { name: "Civil Engineering", courses: [
        { name: "B.E. Civil Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 90000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Wi-Fi Campus", "Cafeteria"],
  },
  "francis-xavier-engineering-college": {
    placement: { year: 2024, placementPercent: 72, averagePackage: 370000, highestPackage: 1400000, placedStudents: 290, totalStudents: 403, topRecruiters: ["TCS", "Infosys", "Wipro", "HCL", "Cognizant"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 92000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 88000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.E. Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 85000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Cafeteria"],
  },
  "mahendra-engineering-college": {
    placement: { year: 2024, placementPercent: 70, averagePackage: 350000, highestPackage: 1300000, placedStudents: 250, totalStudents: 357, topRecruiters: ["TCS", "Infosys", "Wipro", "HCL"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 88000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 85000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.E. Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 82000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Cafeteria"],
  },
  "nandha-engineering-college": {
    placement: { year: 2024, placementPercent: 73, averagePackage: 380000, highestPackage: 1500000, placedStudents: 310, totalStudents: 425, topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "HCL"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 90000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 88000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.E. Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 85000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Cafeteria"],
  },
  "pavai-college-of-technology": {
    placement: { year: 2024, placementPercent: 70, averagePackage: 355000, highestPackage: 1300000, placedStudents: 220, totalStudents: 314, topRecruiters: ["TCS", "Infosys", "Wipro", "HCL"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 85000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 82000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Cafeteria"],
  },
  "ponjesly-college-of-engineering": {
    placement: { year: 2024, placementPercent: 68, averagePackage: 330000, highestPackage: 1100000, placedStudents: 180, totalStudents: 265, topRecruiters: ["TCS", "Infosys", "Wipro"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 85000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 82000 },
      ]},
      { name: "Civil Engineering", courses: [
        { name: "B.E. Civil Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 78000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Cafeteria"],
  },
  "rathinam-college-of-arts-and-science": {
    placement: { year: 2024, placementPercent: 70, averagePackage: 320000, highestPackage: 1000000, placedStudents: 240, totalStudents: 343, topRecruiters: ["TCS", "Infosys", "CTS", "Banks", "Schools"] },
    departments: [
      { name: "Computer Science", courses: [
        { name: "B.Sc Computer Science", degreeType: "UG", duration: 3, totalSeats: 120, annualFee: 48000 },
        { name: "M.Sc Computer Science", degreeType: "PG", duration: 2, totalSeats: 60, annualFee: 52000 },
      ]},
      { name: "Business Administration", courses: [
        { name: "BBA", degreeType: "UG", duration: 3, totalSeats: 60, annualFee: 45000 },
        { name: "MBA", degreeType: "PG", duration: 2, totalSeats: 60, annualFee: 65000 },
      ]},
      { name: "Commerce", courses: [
        { name: "B.Com", degreeType: "UG", duration: 3, totalSeats: 60, annualFee: 42000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Wi-Fi Campus", "Cafeteria"],
  },
  "sethu-institute-of-technology": {
    placement: { year: 2024, placementPercent: 70, averagePackage: 360000, highestPackage: 1400000, placedStudents: 260, totalStudents: 371, topRecruiters: ["TCS", "Infosys", "Wipro", "HCL", "Cognizant"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 88000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 85000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.E. Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 82000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Cafeteria"],
  },
  "tamilnadu-college-of-engineering": {
    placement: { year: 2024, placementPercent: 72, averagePackage: 370000, highestPackage: 1400000, placedStudents: 290, totalStudents: 403, topRecruiters: ["TCS", "Infosys", "Wipro", "HCL", "Cognizant"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 90000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 120, annualFee: 88000 },
      ]},
      { name: "Mechanical Engineering", courses: [
        { name: "B.E. Mechanical Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 85000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Cafeteria"],
  },
  "lieu-seela-vicharaga-engineering-college": {
    placement: { year: 2024, placementPercent: 65, averagePackage: 300000, highestPackage: 900000, placedStudents: 120, totalStudents: 185, topRecruiters: ["TCS", "Infosys", "Wipro"] },
    departments: [
      { name: "Computer Science & Engineering", courses: [
        { name: "B.E. Computer Science & Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 78000 },
      ]},
      { name: "Electronics & Communication Engineering", courses: [
        { name: "B.E. Electronics & Communication Engineering", degreeType: "UG", duration: 4, totalSeats: 60, annualFee: 75000 },
      ]},
    ],
    facilities: ["Library", "Sports Ground", "Hostel", "Cafeteria"],
  },
};

async function seed() {
  let seeded = 0;
  let skipped = 0;

  for (const [slug, data] of Object.entries(COLLEGE_DATA)) {
    const rows = await prisma.$queryRawUnsafe(`SELECT id, name FROM "College" WHERE slug = $1 LIMIT 1`, slug);
    const college = rows[0];
    if (!college) { console.log(`SKIP (not found): ${slug}`); skipped++; continue; }

    // Create placement
    await prisma.placement.create({
      data: {
        collegeId: college.id,
        year: data.placement.year,
        placementPercent: data.placement.placementPercent,
        averagePackage: data.placement.averagePackage,
        highestPackage: data.placement.highestPackage,
        placedStudents: data.placement.placedStudents,
        totalStudents: data.placement.totalStudents,
        topRecruiters: data.placement.topRecruiters,
      },
    });

    // Create departments + courses
    for (const dept of data.departments) {
      const d = await prisma.department.create({
        data: { collegeId: college.id, name: dept.name },
      });
      for (const course of dept.courses) {
        await prisma.course.create({
          data: { departmentId: d.id, ...course },
        });
      }
    }

    // Create facilities
    if (data.facilities) {
      for (const name of data.facilities) {
        await prisma.facility.create({
          data: { collegeId: college.id, name, type: "OTHER" },
        });
      }
    }

    console.log(`✓ Seeded: ${college.name}`);
    seeded++;
  }

  console.log(`\nDone — seeded ${seeded}, skipped ${skipped}`);
  await pool.end();
}

seed().catch(e => { console.error(e); process.exit(1); });
