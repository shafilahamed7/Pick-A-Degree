const { Client } = require("pg");
const DB_URL = "postgresql://postgres.htztsrklvvscgqtkhbbm:Bharathmatha%4007@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres";

const SCHOLARSHIPS = [
  { name: "Post Matric Scholarship for BC Students", provider: "Tamil Nadu Government", amount: "₹1,500 – ₹3,500/year", category: "BC", eligibility: "BC community students with family income below ₹2.5 lakh/year", deadline: "October 31", applyUrl: "https://tnscholarship.tn.gov.in", description: "State government scholarship for Backward Class students pursuing higher education.", isGovernment: true },
  { name: "Post Matric Scholarship for MBC/DNC Students", provider: "Tamil Nadu Government", amount: "₹2,000 – ₹4,000/year", category: "MBC", eligibility: "MBC/DNC community students with family income below ₹2.5 lakh/year", deadline: "October 31", applyUrl: "https://tnscholarship.tn.gov.in", description: "Scholarship for Most Backward Classes and Denotified Communities.", isGovernment: true },
  { name: "Post Matric Scholarship for SC/ST Students", provider: "Tamil Nadu Government", amount: "Full tuition fee + ₹5,000/year maintenance", category: "SC/ST", eligibility: "SC/ST students with family income below ₹2.5 lakh/year", deadline: "October 31", applyUrl: "https://tnscholarship.tn.gov.in", description: "Full fee waiver plus maintenance allowance for Scheduled Caste and Tribe students.", isGovernment: true },
  { name: "National Scholarship Portal - Central Sector Scheme", provider: "Government of India", amount: "₹10,000 – ₹20,000/year", category: "Merit", eligibility: "Top 20% students in Class 12 board exams, family income below ₹8 lakh", deadline: "November 30", applyUrl: "https://scholarships.gov.in", description: "Central government merit scholarship for undergraduate students.", isGovernment: true },
  { name: "Prime Minister's Scholarship Scheme", provider: "Government of India", amount: "₹36,000 – ₹48,000/year", category: "Defence", eligibility: "Wards of ex-servicemen/coast guard personnel", deadline: "October 15", applyUrl: "https://scholarships.gov.in", description: "For children of armed forces personnel pursuing professional degree courses.", isGovernment: true },
  { name: "Ilaignar Thiran Scholarship", provider: "Tamil Nadu Government", amount: "₹10,000 – ₹50,000", category: "Merit", eligibility: "Students who scored 90%+ in Class 12 and joining government engineering colleges", deadline: "September 30", applyUrl: "https://tnscholarship.tn.gov.in", description: "Merit scholarship for top performers joining government engineering institutions.", isGovernment: true },
  { name: "Dr. Ambedkar Post Matric Scholarship", provider: "Ministry of Social Justice", amount: "Full tuition fee + maintenance", category: "SC/ST", eligibility: "SC students pursuing professional courses, income below ₹2.5 lakh", deadline: "October 31", applyUrl: "https://scholarships.gov.in", description: "Full financial support for Scheduled Caste students in professional programmes.", isGovernment: true },
  { name: "VIT Merit Scholarship", provider: "VIT Vellore", amount: "25% – 100% tuition fee waiver", category: "Merit", eligibility: "VITEEE rank 1–1000 or JEE Mains 99+ percentile", deadline: "At time of admission", applyUrl: "https://vit.ac.in/scholarships", description: "Performance-based scholarship for VITEEE toppers joining VIT.", isGovernment: false },
  { name: "SRM Excellence Scholarship", provider: "SRM Institute of Science and Technology", amount: "Up to ₹2 lakh/year", category: "Merit", eligibility: "JEE Main top scorers or SRMJEEE rank 1–500", deadline: "At time of admission", applyUrl: "https://www.srmist.edu.in/scholarship", description: "Scholarship for meritorious students joining SRM through entrance exam top ranks.", isGovernment: false },
  { name: "TNEA Free Seat Scholarship (Government Quota)", provider: "Tamil Nadu Engineering Admissions", amount: "100% tuition fee waiver", category: "Government Quota", eligibility: "Students admitted through TNEA counselling to government engineering colleges", deadline: "NA (automatic)", applyUrl: "https://tneaonline.org", description: "Government quota students in government colleges pay no tuition fee under Tamil Nadu policy.", isGovernment: true },
  { name: "Minority Post Matric Scholarship", provider: "Ministry of Minority Affairs", amount: "Full course fee + ₹7,000 maintenance/year", category: "Minority", eligibility: "Muslim, Christian, Sikh, Buddhist, Jain students with income below ₹2 lakh", deadline: "October 31", applyUrl: "https://scholarships.gov.in", description: "For religious minority students pursuing professional courses.", isGovernment: true },
  { name: "HDFC Bank Parivartan Scholarship", provider: "HDFC Bank", amount: "₹75,000/year", category: "Merit-cum-Means", eligibility: "Family income below ₹3 lakh, 55%+ in Class 12", deadline: "July 31", applyUrl: "https://www.buddy4study.com/hdfc-scholarship", description: "Private bank scholarship for meritorious students from low-income families.", isGovernment: false },
  { name: "Tata Capital Pankh Scholarship", provider: "Tata Capital", amount: "Up to ₹50,000/year", category: "Merit-cum-Means", eligibility: "Family income below ₹4 lakh, pursuing professional UG course", deadline: "August 31", applyUrl: "https://www.buddy4study.com/tata-pankh", description: "For deserving students from financially weaker backgrounds.", isGovernment: false },
  { name: "Sitaram Jindal Foundation Scholarship", provider: "Sitaram Jindal Foundation", amount: "₹500 – ₹2,000/month", category: "Merit-cum-Means", eligibility: "Income below ₹2 lakh, 60%+ marks, pursuing professional course", deadline: "June 30", applyUrl: "https://www.sitaramjindalfoundation.org", description: "Monthly stipend scholarship for meritorious students.", isGovernment: false },
  { name: "NSP OBC Scholarship", provider: "Ministry of Social Justice & Empowerment", amount: "₹3,000 – ₹5,000/year", category: "OBC", eligibility: "OBC students with family income below ₹1 lakh, post matric", deadline: "November 30", applyUrl: "https://scholarships.gov.in", description: "Post matric scholarship for Other Backward Class students.", isGovernment: true },
];

const ENTRANCE_EXAMS = [
  { name: "Tamil Nadu Engineering Admissions", shortName: "TNEA", conductedBy: "Anna University", examType: "UG Engineering", applicationStart: "April 2026", applicationEnd: "May 2026", examDate: "No exam – Class 12 cutoff based", resultDate: "July 2026", website: "https://tneaonline.org", description: "State-level counselling for admission to B.E/B.Tech in Tamil Nadu government and private engineering colleges. Based on Class 12 marks (Maths + Physics + Chemistry).", eligibility: "Class 12 with PCM, min 45% (40% for reserved categories)" },
  { name: "Joint Entrance Examination Main", shortName: "JEE Main", conductedBy: "NTA (National Testing Agency)", examType: "UG Engineering", applicationStart: "November 2025", applicationEnd: "December 2025", examDate: "January & April 2026", resultDate: "February & May 2026", website: "https://jeemain.nta.ac.in", description: "National level entrance exam for admission to NITs, IIITs, CFTIs and private colleges across India. Required for IIT Madras, NIT Trichy, and VIT/SRM admissions.", eligibility: "Class 12 with PCM, no age limit" },
  { name: "Joint Entrance Examination Advanced", shortName: "JEE Advanced", conductedBy: "IIT Madras (2026)", examType: "UG Engineering – IITs", applicationStart: "April 2026", applicationEnd: "May 2026", examDate: "May 2026", resultDate: "June 2026", website: "https://jeeadv.ac.in", description: "Exam for admission to IITs including IIT Madras. Only JEE Main qualified candidates can appear. One of the toughest exams in India.", eligibility: "JEE Main qualified, top 2.5 lakh rank" },
  { name: "Tamil Nadu Common Entrance Test", shortName: "TANCET", conductedBy: "Anna University", examType: "PG Engineering / MBA / MCA", applicationStart: "February 2026", applicationEnd: "March 2026", examDate: "March 2026", resultDate: "April 2026", website: "https://www.annauniv.edu/tancet", description: "State-level entrance for M.E/M.Tech, MBA and MCA admissions in Tamil Nadu colleges. Required for PG engineering admission.", eligibility: "B.E/B.Tech degree for M.E; Graduation for MBA/MCA" },
  { name: "VIT Engineering Entrance Examination", shortName: "VITEEE", conductedBy: "VIT University", examType: "UG Engineering", applicationStart: "November 2025", applicationEnd: "February 2026", examDate: "April 2026", resultDate: "April 2026", website: "https://viteee.vit.ac.in", description: "Online entrance exam for admission to B.Tech at VIT Vellore, VIT Chennai, VIT Bhopal, and VIT AP campuses.", eligibility: "Class 12 with PCM or PCB, min 60% aggregate" },
  { name: "SRM Joint Engineering Entrance Examination", shortName: "SRMJEEE", conductedBy: "SRM Institute of Science and Technology", examType: "UG Engineering", applicationStart: "November 2025", applicationEnd: "March 2026", examDate: "April 2026", resultDate: "April 2026", website: "https://www.srmist.edu.in/srmjeee", description: "Online entrance exam for B.Tech admission at all SRM campuses. Also accepts JEE Main scores for direct admission.", eligibility: "Class 12 with PCM, min 50% marks" },
  { name: "National Eligibility cum Entrance Test", shortName: "NEET UG", conductedBy: "NTA (National Testing Agency)", examType: "UG Medical / Dental", applicationStart: "November 2025", applicationEnd: "December 2025", examDate: "May 2026", resultDate: "June 2026", website: "https://neet.nta.nic.in", description: "Mandatory national exam for MBBS, BDS, BAMS, BHMS admissions across all medical colleges in India including Tamil Nadu.", eligibility: "Class 12 with PCB, min 50% (40% for reserved)" },
  { name: "Common University Entrance Test", shortName: "CUET UG", conductedBy: "NTA (National Testing Agency)", examType: "UG All Streams", applicationStart: "February 2026", applicationEnd: "March 2026", examDate: "May 2026", resultDate: "June 2026", website: "https://cuet.samarth.ac.in", description: "Central exam for admission to central universities and many deemed universities. Used by some TN colleges for non-engineering UG programmes.", eligibility: "Class 12 pass, any stream" },
  { name: "Karunya Entrance Examination", shortName: "KEE", conductedBy: "Karunya Institute of Technology", examType: "UG Engineering", applicationStart: "November 2025", applicationEnd: "April 2026", examDate: "April 2026", resultDate: "May 2026", website: "https://www.karunya.edu/kee", description: "Online entrance for B.Tech admission at Karunya Institute, Coimbatore. Also accepts JEE Main / TNEA scores.", eligibility: "Class 12 with PCM, min 45%" },
  { name: "Amrita Engineering Entrance Examination", shortName: "AEEE", conductedBy: "Amrita Vishwa Vidyapeetham", examType: "UG Engineering", applicationStart: "December 2025", applicationEnd: "March 2026", examDate: "April 2026", resultDate: "May 2026", website: "https://www.amrita.edu/admissions/aeee", description: "Online/offline entrance for B.Tech at Amrita campuses including Coimbatore, Chennai, and Bengaluru. Also accepts JEE Main.", eligibility: "Class 12 with PCM, min 55%" },
  { name: "SASTRA University Entrance Exam", shortName: "SASTRA", conductedBy: "SASTRA Deemed University", examType: "UG Engineering", applicationStart: "January 2026", applicationEnd: "May 2026", examDate: "May 2026", resultDate: "June 2026", website: "https://www.sastra.edu/admissions", description: "University-level entrance or merit-based admission for B.Tech at SASTRA, Thanjavur. JEE Main score also accepted.", eligibility: "Class 12 with PCM, min 60%" },
];

const SAMPLE_REVIEWS = [
  { collegeSlug: "iit-madras", authorName: "Arjun Krishnan", batchYear: 2023, branch: "Computer Science Engineering", rating: 5, academics: 5, placements: 5, campus: 5, faculty: 5, content: "IIT Madras is truly world-class. The research culture is incredible, and the campus inside the forest is breathtaking. Placements are top-tier with Google, Microsoft, McKinsey visiting every year. Faculty are globally recognized researchers. The student life, clubs, and fests make it a complete experience." },
  { collegeSlug: "nit-trichy", authorName: "Priya Sundaram", batchYear: 2022, branch: "Electronics & Communication Engineering", rating: 4.5, academics: 4.5, placements: 4.5, campus: 4, faculty: 4.5, content: "NIT Trichy has an excellent academic environment. Professors are knowledgeable and research-oriented. Placements are strong — top core companies and IT firms visit every year. Hostel food could be better. The campus is well-maintained with good sports facilities." },
  { collegeSlug: "vit-vellore", authorName: "Deepak Ramachandran", batchYear: 2024, branch: "Computer Science Engineering", rating: 4, academics: 3.5, placements: 4.5, campus: 4.5, faculty: 3.5, content: "VIT has excellent infrastructure and the campus is huge. Placements are good — TCS, Infosys, Wipro, and many product companies visit. The fee is high but placements justify it for most. Faculty quality varies by department. The Technology Tower labs are world-class." },
  { collegeSlug: "srm-institute-of-science-and-technology", authorName: "Kavitha Venkat", batchYear: 2023, branch: "Mechanical Engineering", rating: 3.5, academics: 3.5, placements: 3.5, campus: 4, faculty: 3, content: "SRM has good infrastructure and the fee is high. Placement opportunities are decent for CSE/IT branches. For core branches like Mechanical, opportunities are limited. The campus near Chennai is well-connected. Annual fests are good." },
  { collegeSlug: "psg-college-of-technology", authorName: "Murugan Selvaraj", batchYear: 2022, branch: "Mechanical Engineering", rating: 4.5, academics: 4.5, placements: 4, campus: 4, faculty: 4.5, content: "PSG Tech is one of the best colleges in Coimbatore. Strong faculty, good labs, and industry connections. Placement record is solid for all branches. The college culture promotes discipline and academics. Anna University affiliation ensures rigorous curriculum." },
  { collegeSlug: "anna-university", authorName: "Senthil Kumar", batchYear: 2021, branch: "Civil Engineering", rating: 4, academics: 4.5, placements: 3.5, campus: 4, faculty: 4, content: "Anna University's main campus (CEG) is historical and academically rich. Research facilities are excellent. Placement support could be stronger for non-CS branches. The campus inside Chennai is very accessible. Legacy college with lots of alumni support." },
  { collegeSlug: "sastra-deemed-university", authorName: "Hari Prasad", batchYear: 2023, branch: "Computer Science Engineering", rating: 4, academics: 4, placements: 3.5, campus: 3.5, faculty: 4, content: "SASTRA is a great value-for-money college. The fee is reasonable and academics are strong. Thanjavur city is quiet and focused on studies. Placement numbers are improving each year. The college is known for the Ramanujan Centre which attracts global researchers." },
  { collegeSlug: "thiagarajar-college-of-engineering", authorName: "Meena Durai", batchYear: 2022, branch: "Electronics & Communication Engineering", rating: 4, academics: 4, placements: 3.5, campus: 3.5, faculty: 4, content: "TCE Madurai is a reputed autonomous college. Faculty are experienced and dedicated. Academic rigour is high. Placement cell is active and improving. Madurai city has good connectivity. Strong alumni network in the industry." },
];

async function main() {
  const client = new Client({ connectionString: DB_URL });
  await client.connect();
  console.log("Connected");

  // Clear and insert scholarships
  await client.query('DELETE FROM "Scholarship"');
  for (const s of SCHOLARSHIPS) {
    await client.query(
      `INSERT INTO "Scholarship" (name, provider, amount, category, eligibility, deadline, "applyUrl", description, "isGovernment")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [s.name, s.provider, s.amount, s.category, s.eligibility, s.deadline, s.applyUrl, s.description, s.isGovernment]
    );
  }
  console.log(`Seeded ${SCHOLARSHIPS.length} scholarships`);

  // Clear and insert entrance exams
  await client.query('DELETE FROM "EntranceExam"');
  for (const e of ENTRANCE_EXAMS) {
    await client.query(
      `INSERT INTO "EntranceExam" (name, "shortName", "conductedBy", "examType", "applicationStart", "applicationEnd", "examDate", "resultDate", website, description, eligibility)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [e.name, e.shortName, e.conductedBy, e.examType, e.applicationStart, e.applicationEnd, e.examDate, e.resultDate, e.website, e.description, e.eligibility]
    );
  }
  console.log(`Seeded ${ENTRANCE_EXAMS.length} entrance exams`);

  // Insert sample reviews
  await client.query('DELETE FROM "CollegeReview"');
  for (const r of SAMPLE_REVIEWS) {
    const col = await client.query('SELECT id FROM "College" WHERE slug LIKE $1 LIMIT 1', [`%${r.collegeSlug}%`]);
    if (!col.rows.length) { console.log(`College not found: ${r.collegeSlug}`); continue; }
    await client.query(
      `INSERT INTO "CollegeReview" ("collegeId", "authorName", "batchYear", branch, rating, academics, placements, campus, faculty, content)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [col.rows[0].id, r.authorName, r.batchYear, r.branch, r.rating, r.academics, r.placements, r.campus, r.faculty, r.content]
    );
  }
  console.log(`Seeded ${SAMPLE_REVIEWS.length} reviews`);

  // Update NIRF ranks and NAAC grades for known colleges
  const updates = [
    { slug: "iit-madras", nirfRank: 1, naacGrade: "A++" },
    { slug: "nit-trichy", nirfRank: 9, naacGrade: "A++" },
    { slug: "vit-vellore", nirfRank: 16, naacGrade: "A++" },
    { slug: "srm-institute-of-science-and-technology", nirfRank: 14, naacGrade: "A++" },
    { slug: "sastra-deemed-university", nirfRank: 40, naacGrade: "A" },
    { slug: "amrita-school-of-engineering-coimbatore", nirfRank: 23, naacGrade: "A++" },
    { slug: "kalasalingam-academy-of-research-and-education", nirfRank: 33, naacGrade: "A+" },
    { slug: "ssn-college-of-engineering", nirfRank: 47, naacGrade: "A+" },
    { slug: "sathyabama-institute-of-science-and-technology", nirfRank: 67, naacGrade: "A" },
    { slug: "psg-college-of-technology", nirfRank: 72, naacGrade: "A++" },
    { slug: "anna-university", nirfRank: 10, naacGrade: "A++" },
    { slug: "kumaraguru-college-of-technology", nirfRank: 80, naacGrade: "A+" },
    { slug: "thiagarajar-college-of-engineering", nirfRank: 88, naacGrade: "A+" },
    { slug: "karunya-institute-of-technology-and-sciences", nirfRank: 95, naacGrade: "A" },
    { slug: "kongu-engineering-college", nirfRank: 101, naacGrade: "A+" },
    { slug: "sona-college-of-technology", nirfRank: 120, naacGrade: "A" },
  ];
  for (const u of updates) {
    const col = await client.query('SELECT id FROM "College" WHERE slug LIKE $1 LIMIT 1', [`%${u.slug}%`]);
    if (!col.rows.length) continue;
    await client.query('UPDATE "College" SET "nirfRank" = $1, "naacGrade" = $2 WHERE id = $3', [u.nirfRank, u.naacGrade, col.rows[0].id]);
  }
  console.log(`Updated NIRF ranks and NAAC grades`);

  // Seed cutoff data for top colleges
  const cutoffs = [
    { slug: "iit-madras", branch: "Computer Science Engineering", category: "General", openRank: 54, closeRank: 128 },
    { slug: "iit-madras", branch: "Electrical Engineering", category: "General", openRank: 200, closeRank: 420 },
    { slug: "iit-madras", branch: "Mechanical Engineering", category: "General", openRank: 380, closeRank: 650 },
    { slug: "iit-madras", branch: "Computer Science Engineering", category: "OBC-NCL", openRank: 35, closeRank: 90 },
    { slug: "iit-madras", branch: "Computer Science Engineering", category: "SC", openRank: 8, closeRank: 25 },
    { slug: "nit-trichy", branch: "Computer Science Engineering", category: "General", openRank: 4200, closeRank: 8500 },
    { slug: "nit-trichy", branch: "Electronics & Communication Engineering", category: "General", openRank: 8500, closeRank: 15000 },
    { slug: "nit-trichy", branch: "Mechanical Engineering", category: "General", openRank: 15000, closeRank: 22000 },
    { slug: "nit-trichy", branch: "Computer Science Engineering", category: "OBC-NCL", openRank: 2000, closeRank: 5000 },
    { slug: "nit-trichy", branch: "Computer Science Engineering", category: "SC", openRank: 500, closeRank: 1200 },
    { slug: "anna-university", branch: "Computer Science Engineering", category: "General", openRank: 1, closeRank: 5000 },
    { slug: "anna-university", branch: "Mechanical Engineering", category: "General", openRank: 100, closeRank: 25000 },
    { slug: "vit-vellore", branch: "Computer Science Engineering", category: "General", openRank: 1, closeRank: 25000 },
    { slug: "vit-vellore", branch: "Electronics & Communication Engineering", category: "General", openRank: 5000, closeRank: 50000 },
    { slug: "psg-college-of-technology", branch: "Computer Science Engineering", category: "General", openRank: 1000, closeRank: 8000 },
    { slug: "psg-college-of-technology", branch: "Mechanical Engineering", category: "General", openRank: 8000, closeRank: 35000 },
    { slug: "thiagarajar-college-of-engineering", branch: "Computer Science Engineering", category: "General", openRank: 5000, closeRank: 20000 },
    { slug: "coimbatore-institute-of-technology", branch: "Computer Science Engineering", category: "General", openRank: 3000, closeRank: 12000 },
    { slug: "ssn-college-of-engineering", branch: "Computer Science Engineering", category: "General", openRank: 2000, closeRank: 10000 },
    { slug: "kongu-engineering-college", branch: "Computer Science Engineering", category: "General", openRank: 15000, closeRank: 45000 },
  ];
  await client.query('DELETE FROM "Cutoff"');
  for (const c of cutoffs) {
    const col = await client.query('SELECT id FROM "College" WHERE slug LIKE $1 LIMIT 1', [`%${c.slug}%`]);
    if (!col.rows.length) continue;
    await client.query(
      `INSERT INTO "Cutoff" ("collegeId", year, branch, category, "openRank", "closeRank") VALUES ($1, 2024, $2, $3, $4, $5)`,
      [col.rows[0].id, c.branch, c.category, c.openRank, c.closeRank]
    );
  }
  console.log(`Seeded cutoff data`);

  await client.end();
  console.log("Done!");
}

main().catch(console.error);
