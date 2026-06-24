// TNEA Cutoff seed script
// TNEA cutoff is out of 200 (Physics + Chemistry + Maths*2 / 4)
// Categories: OC, BC, BCM, MBC, SC, SCA, ST
// JEE Advanced (IIT) and JEE Main (NIT) use AIR rank instead

import pg from 'pg';
import { randomUUID } from 'crypto';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Delete existing cutoffs so we start fresh
await pool.query('DELETE FROM "Cutoff"');
console.log('Cleared existing cutoffs');

const YEAR = 2024;
const BRANCHES = ['CSE', 'ECE', 'EEE', 'Mechanical', 'Civil', 'IT', 'AI & Data Science'];
const TNEA_CATEGORIES = ['OC', 'BC', 'BCM', 'MBC', 'SC', 'SCA', 'ST'];
const JEE_CATEGORIES = ['General', 'OBC-NCL', 'SC', 'ST', 'EWS'];

// Category deductions from OC mark (TNEA)
const CAT_DEDUCT = { OC: 0, BC: -3, BCM: -4, MBC: -5, SC: -15, SCA: -18, ST: -20 };
// Category multipliers for JEE rank (lower rank = better, so SC/ST get higher numbers = worse = need lower rank)
const JEE_CAT_OPEN_MULT = { General: 1, 'OBC-NCL': 0.55, SC: 0.25, ST: 0.15, EWS: 0.85 };
const JEE_CAT_CLOSE_MULT = { General: 1, 'OBC-NCL': 0.55, SC: 0.28, ST: 0.18, EWS: 0.87 };

function tnea(collegeId, branch, ocMark, spread = 1.5) {
  const rows = [];
  for (const cat of TNEA_CATEGORIES) {
    const base = ocMark + CAT_DEDUCT[cat];
    const open = Math.min(200, Math.max(100, parseFloat((base + spread).toFixed(2))));
    const close = Math.min(200, Math.max(100, parseFloat((base - spread).toFixed(2))));
    rows.push({
      id: randomUUID(), collegeId, year: YEAR, branch,
      category: cat, openRank: open, closeRank: close
    });
  }
  return rows;
}

function jee(collegeId, branch, genOpen, genClose) {
  return JEE_CATEGORIES.map(cat => ({
    id: randomUUID(), collegeId, year: YEAR, branch, category: cat,
    openRank: Math.round(genOpen * JEE_CAT_OPEN_MULT[cat]),
    closeRank: Math.round(genClose * JEE_CAT_CLOSE_MULT[cat])
  }));
}

const records = [];

// ============================================================
// IIT MADRAS — JEE Advanced ranks
// ============================================================
const IIT = 'cmqhykn1e00000xutmx0yxghn';
records.push(...jee(IIT, 'Computer Science Engineering', 54, 128));
records.push(...jee(IIT, 'Electrical Engineering', 200, 420));
records.push(...jee(IIT, 'Mechanical Engineering', 380, 650));
records.push(...jee(IIT, 'Civil Engineering', 900, 1400));
records.push(...jee(IIT, 'AI & Data Science', 90, 180));
records.push(...jee(IIT, 'Chemical Engineering', 500, 820));

// ============================================================
// NIT TRICHY — JEE Main ranks (state quota)
// ============================================================
const NIT = 'cmqhykuq4000d0xut8rrlt5po';
records.push(...jee(NIT, 'Computer Science Engineering', 2100, 4800));
records.push(...jee(NIT, 'ECE', 5000, 9500));
records.push(...jee(NIT, 'EEE', 8000, 14000));
records.push(...jee(NIT, 'Mechanical Engineering', 10000, 18000));
records.push(...jee(NIT, 'Civil Engineering', 14000, 24000));
records.push(...jee(NIT, 'IT', 3500, 7000));

// ============================================================
// GOVERNMENT COLLEGES — TNEA
// ============================================================

// GCT Coimbatore (top govt college, ~CEG level)
const GCT = 'cmqhym8py002p0xutcp3z1vbn';
records.push(...tnea(GCT, 'CSE', 196.5));
records.push(...tnea(GCT, 'ECE', 194.8));
records.push(...tnea(GCT, 'EEE', 192.5));
records.push(...tnea(GCT, 'Mechanical', 191.2));
records.push(...tnea(GCT, 'Civil', 188.5));
records.push(...tnea(GCT, 'IT', 195.2));

// Anna University (CEG campus)
const CEG = 'cmqhyl2x0000r0xutpi7oi5w6';
records.push(...tnea(CEG, 'CSE', 197.8));
records.push(...tnea(CEG, 'ECE', 196.5));
records.push(...tnea(CEG, 'EEE', 194.2));
records.push(...tnea(CEG, 'Mechanical', 193.5));
records.push(...tnea(CEG, 'Civil', 191.0));
records.push(...tnea(CEG, 'IT', 196.9));
records.push(...tnea(CEG, 'AI & Data Science', 197.2));

// Pondicherry Engineering College
const PEC = 'a8796385-8f94-482c-b36f-3af7d46050ad';
records.push(...tnea(PEC, 'CSE', 191.5));
records.push(...tnea(PEC, 'ECE', 189.8));
records.push(...tnea(PEC, 'EEE', 187.5));
records.push(...tnea(PEC, 'Mechanical', 185.2));
records.push(...tnea(PEC, 'Civil', 182.0));
records.push(...tnea(PEC, 'IT', 190.5));

// GCE Tirunelveli
records.push(...tnea('3cbaee48-983a-459a-b78e-c24d99c4b5e8', 'CSE', 185.5));
records.push(...tnea('3cbaee48-983a-459a-b78e-c24d99c4b5e8', 'ECE', 183.2));
records.push(...tnea('3cbaee48-983a-459a-b78e-c24d99c4b5e8', 'EEE', 180.8));
records.push(...tnea('3cbaee48-983a-459a-b78e-c24d99c4b5e8', 'Mechanical', 178.5));
records.push(...tnea('3cbaee48-983a-459a-b78e-c24d99c4b5e8', 'Civil', 175.0));

// GCE Salem
records.push(...tnea('99573813-ea47-4ad2-9534-93dfc0877eee', 'CSE', 184.2));
records.push(...tnea('99573813-ea47-4ad2-9534-93dfc0877eee', 'ECE', 181.8));
records.push(...tnea('99573813-ea47-4ad2-9534-93dfc0877eee', 'EEE', 179.5));
records.push(...tnea('99573813-ea47-4ad2-9534-93dfc0877eee', 'Mechanical', 177.2));
records.push(...tnea('99573813-ea47-4ad2-9534-93dfc0877eee', 'Civil', 173.8));

// GCE Thanjavur
records.push(...tnea('49dc6805-bbef-425d-93fc-9e3fa3076189', 'CSE', 183.5));
records.push(...tnea('49dc6805-bbef-425d-93fc-9e3fa3076189', 'ECE', 181.0));
records.push(...tnea('49dc6805-bbef-425d-93fc-9e3fa3076189', 'EEE', 178.8));
records.push(...tnea('49dc6805-bbef-425d-93fc-9e3fa3076189', 'Mechanical', 176.5));
records.push(...tnea('49dc6805-bbef-425d-93fc-9e3fa3076189', 'Civil', 172.5));

// GCE Villupuram
records.push(...tnea('ea6edafd-b9cd-4d47-be22-ada355670be5', 'CSE', 181.2));
records.push(...tnea('ea6edafd-b9cd-4d47-be22-ada355670be5', 'ECE', 178.8));
records.push(...tnea('ea6edafd-b9cd-4d47-be22-ada355670be5', 'EEE', 176.5));
records.push(...tnea('ea6edafd-b9cd-4d47-be22-ada355670be5', 'Mechanical', 174.0));
records.push(...tnea('ea6edafd-b9cd-4d47-be22-ada355670be5', 'Civil', 170.5));

// GCE Tiruvannamalai
records.push(...tnea('ed1ea191-c74a-48ab-b843-54fe4fbba0fe', 'CSE', 180.8));
records.push(...tnea('ed1ea191-c74a-48ab-b843-54fe4fbba0fe', 'ECE', 178.2));
records.push(...tnea('ed1ea191-c74a-48ab-b843-54fe4fbba0fe', 'EEE', 175.8));
records.push(...tnea('ed1ea191-c74a-48ab-b843-54fe4fbba0fe', 'Mechanical', 173.5));
records.push(...tnea('ed1ea191-c74a-48ab-b843-54fe4fbba0fe', 'Civil', 170.0));

// GCE Tiruppur
records.push(...tnea('ef29e9b7-f35e-4132-89a9-d0e617b8eae6', 'CSE', 180.5));
records.push(...tnea('ef29e9b7-f35e-4132-89a9-d0e617b8eae6', 'ECE', 178.0));
records.push(...tnea('ef29e9b7-f35e-4132-89a9-d0e617b8eae6', 'EEE', 175.5));
records.push(...tnea('ef29e9b7-f35e-4132-89a9-d0e617b8eae6', 'Mechanical', 173.0));
records.push(...tnea('ef29e9b7-f35e-4132-89a9-d0e617b8eae6', 'Civil', 169.5));

// GCE Tirupattur
records.push(...tnea('a874bf7c-3417-4d4e-a69f-ead5329c81c0', 'CSE', 179.8));
records.push(...tnea('a874bf7c-3417-4d4e-a69f-ead5329c81c0', 'ECE', 177.2));
records.push(...tnea('a874bf7c-3417-4d4e-a69f-ead5329c81c0', 'EEE', 174.8));
records.push(...tnea('a874bf7c-3417-4d4e-a69f-ead5329c81c0', 'Mechanical', 172.5));
records.push(...tnea('a874bf7c-3417-4d4e-a69f-ead5329c81c0', 'Civil', 169.0));

// GCE Tenkasi
records.push(...tnea('57787989-8051-43a9-9c08-ed1f21a8202b', 'CSE', 178.5));
records.push(...tnea('57787989-8051-43a9-9c08-ed1f21a8202b', 'ECE', 176.0));
records.push(...tnea('57787989-8051-43a9-9c08-ed1f21a8202b', 'EEE', 173.5));
records.push(...tnea('57787989-8051-43a9-9c08-ed1f21a8202b', 'Mechanical', 171.0));
records.push(...tnea('57787989-8051-43a9-9c08-ed1f21a8202b', 'Civil', 167.5));

// GCE Ramanathapuram
records.push(...tnea('30615283-39d0-408a-a4f8-b6bbb0820fb1', 'CSE', 178.2));
records.push(...tnea('30615283-39d0-408a-a4f8-b6bbb0820fb1', 'ECE', 175.8));
records.push(...tnea('30615283-39d0-408a-a4f8-b6bbb0820fb1', 'EEE', 173.2));
records.push(...tnea('30615283-39d0-408a-a4f8-b6bbb0820fb1', 'Mechanical', 170.8));
records.push(...tnea('30615283-39d0-408a-a4f8-b6bbb0820fb1', 'Civil', 167.0));

// GCE Pudukkottai
records.push(...tnea('6bc5e384-b205-4fb8-81b4-dba5b8e9548a', 'CSE', 177.8));
records.push(...tnea('6bc5e384-b205-4fb8-81b4-dba5b8e9548a', 'ECE', 175.2));
records.push(...tnea('6bc5e384-b205-4fb8-81b4-dba5b8e9548a', 'EEE', 172.8));
records.push(...tnea('6bc5e384-b205-4fb8-81b4-dba5b8e9548a', 'Mechanical', 170.2));
records.push(...tnea('6bc5e384-b205-4fb8-81b4-dba5b8e9548a', 'Civil', 166.5));

// GCE Nagapattinam
records.push(...tnea('543cd33c-75f3-4332-a704-d820591719a1', 'CSE', 177.5));
records.push(...tnea('543cd33c-75f3-4332-a704-d820591719a1', 'ECE', 175.0));
records.push(...tnea('543cd33c-75f3-4332-a704-d820591719a1', 'EEE', 172.5));
records.push(...tnea('543cd33c-75f3-4332-a704-d820591719a1', 'Mechanical', 169.8));
records.push(...tnea('543cd33c-75f3-4332-a704-d820591719a1', 'Civil', 166.0));

// GCE Mayiladuthurai
records.push(...tnea('9f444d2d-2892-4919-b7ad-7e7d55d5c5f8', 'CSE', 177.2));
records.push(...tnea('9f444d2d-2892-4919-b7ad-7e7d55d5c5f8', 'ECE', 174.8));
records.push(...tnea('9f444d2d-2892-4919-b7ad-7e7d55d5c5f8', 'EEE', 172.2));
records.push(...tnea('9f444d2d-2892-4919-b7ad-7e7d55d5c5f8', 'Mechanical', 169.5));
records.push(...tnea('9f444d2d-2892-4919-b7ad-7e7d55d5c5f8', 'Civil', 165.8));

// GCE Krishnagiri
records.push(...tnea('f9086506-1cb8-4baf-aa9b-084184d6096d', 'CSE', 176.8));
records.push(...tnea('f9086506-1cb8-4baf-aa9b-084184d6096d', 'ECE', 174.2));
records.push(...tnea('f9086506-1cb8-4baf-aa9b-084184d6096d', 'EEE', 171.8));
records.push(...tnea('f9086506-1cb8-4baf-aa9b-084184d6096d', 'Mechanical', 169.0));
records.push(...tnea('f9086506-1cb8-4baf-aa9b-084184d6096d', 'Civil', 165.5));

// GCE Kallakurichi
records.push(...tnea('2840d4c5-d6b2-4bac-bd8c-f3db9c9ca057', 'CSE', 176.5));
records.push(...tnea('2840d4c5-d6b2-4bac-bd8c-f3db9c9ca057', 'ECE', 174.0));
records.push(...tnea('2840d4c5-d6b2-4bac-bd8c-f3db9c9ca057', 'EEE', 171.5));
records.push(...tnea('2840d4c5-d6b2-4bac-bd8c-f3db9c9ca057', 'Mechanical', 168.8));
records.push(...tnea('2840d4c5-d6b2-4bac-bd8c-f3db9c9ca057', 'Civil', 165.0));

// GCE Dharmapuri
records.push(...tnea('308d5114-8b3e-49f7-920e-7b20203606c6', 'CSE', 176.2));
records.push(...tnea('308d5114-8b3e-49f7-920e-7b20203606c6', 'ECE', 173.8));
records.push(...tnea('308d5114-8b3e-49f7-920e-7b20203606c6', 'EEE', 171.2));
records.push(...tnea('308d5114-8b3e-49f7-920e-7b20203606c6', 'Mechanical', 168.5));
records.push(...tnea('308d5114-8b3e-49f7-920e-7b20203606c6', 'Civil', 164.8));

// GCE Tiruvarur
records.push(...tnea('dace39f7-0325-4bbe-9354-62312c09f734', 'CSE', 175.8));
records.push(...tnea('dace39f7-0325-4bbe-9354-62312c09f734', 'ECE', 173.2));
records.push(...tnea('dace39f7-0325-4bbe-9354-62312c09f734', 'EEE', 170.8));
records.push(...tnea('dace39f7-0325-4bbe-9354-62312c09f734', 'Mechanical', 168.0));
records.push(...tnea('dace39f7-0325-4bbe-9354-62312c09f734', 'Civil', 164.5));

// GCE Bargur (Ranipet)
records.push(...tnea('f1906e4d-ec45-4b75-ba8c-13e6eaf99d07', 'CSE', 175.5));
records.push(...tnea('f1906e4d-ec45-4b75-ba8c-13e6eaf99d07', 'ECE', 172.8));
records.push(...tnea('f1906e4d-ec45-4b75-ba8c-13e6eaf99d07', 'EEE', 170.2));
records.push(...tnea('f1906e4d-ec45-4b75-ba8c-13e6eaf99d07', 'Mechanical', 167.8));
records.push(...tnea('f1906e4d-ec45-4b75-ba8c-13e6eaf99d07', 'Civil', 164.0));

// Government Engineering College Salem (separate entry)
records.push(...tnea('d17d5ee7-3846-47c5-a433-e539b817ccec', 'CSE', 182.5));
records.push(...tnea('d17d5ee7-3846-47c5-a433-e539b817ccec', 'ECE', 180.0));
records.push(...tnea('d17d5ee7-3846-47c5-a433-e539b817ccec', 'EEE', 177.5));
records.push(...tnea('d17d5ee7-3846-47c5-a433-e539b817ccec', 'Mechanical', 175.0));
records.push(...tnea('d17d5ee7-3846-47c5-a433-e539b817ccec', 'Civil', 171.5));

// ============================================================
// AUTONOMOUS COLLEGES — TNEA
// ============================================================

// PSG College of Technology (Coimbatore) — top autonomous
const PSG = 'cmqhylb5100150xutvvlho542';
records.push(...tnea(PSG, 'CSE', 195.8));
records.push(...tnea(PSG, 'ECE', 194.2));
records.push(...tnea(PSG, 'EEE', 191.8));
records.push(...tnea(PSG, 'Mechanical', 190.5));
records.push(...tnea(PSG, 'Civil', 187.5));
records.push(...tnea(PSG, 'IT', 194.8));
records.push(...tnea(PSG, 'AI & Data Science', 195.2));

// SSN College of Engineering (Chennai)
const SSN = 'cmqhylreh001x0xutjnz8743d';
records.push(...tnea(SSN, 'CSE', 195.2));
records.push(...tnea(SSN, 'ECE', 193.5));
records.push(...tnea(SSN, 'EEE', 191.0));
records.push(...tnea(SSN, 'Mechanical', 189.5));
records.push(...tnea(SSN, 'Civil', 186.5));
records.push(...tnea(SSN, 'IT', 194.5));

// Thiagarajar College of Engineering (TCE Madurai)
const TCE = 'cmqhylzzn002b0xutw5i24okl';
records.push(...tnea(TCE, 'CSE', 194.5));
records.push(...tnea(TCE, 'ECE', 192.8));
records.push(...tnea(TCE, 'EEE', 190.2));
records.push(...tnea(TCE, 'Mechanical', 188.8));
records.push(...tnea(TCE, 'Civil', 185.8));
records.push(...tnea(TCE, 'IT', 193.8));

// Kongu Engineering College (Erode)
const KEC = '9c5ace48-b44c-46b8-b68e-598f1789efe4';
records.push(...tnea(KEC, 'CSE', 192.8));
records.push(...tnea(KEC, 'ECE', 191.0));
records.push(...tnea(KEC, 'EEE', 188.5));
records.push(...tnea(KEC, 'Mechanical', 187.0));
records.push(...tnea(KEC, 'Civil', 184.0));
records.push(...tnea(KEC, 'IT', 192.0));

// Kumaraguru College of Technology (KCT Coimbatore)
const KCT = '490d2874-b276-4da1-9451-b66569c63f69';
records.push(...tnea(KCT, 'CSE', 192.5));
records.push(...tnea(KCT, 'ECE', 190.8));
records.push(...tnea(KCT, 'EEE', 188.2));
records.push(...tnea(KCT, 'Mechanical', 186.8));
records.push(...tnea(KCT, 'Civil', 183.5));
records.push(...tnea(KCT, 'IT', 191.8));

// Bannari Amman Institute of Technology
const BANARI = '22ae5252-7bb0-4740-8aba-fe048da6be3e';
records.push(...tnea(BANARI, 'CSE', 191.8));
records.push(...tnea(BANARI, 'ECE', 190.0));
records.push(...tnea(BANARI, 'EEE', 187.5));
records.push(...tnea(BANARI, 'Mechanical', 186.0));
records.push(...tnea(BANARI, 'Civil', 182.8));
records.push(...tnea(BANARI, 'IT', 191.0));

// Mepco Schlenk Engineering College (Sivakasi)
const MEPCO = '16f959ef-d109-4e99-ad0e-3d1def55cdb3';
records.push(...tnea(MEPCO, 'CSE', 191.5));
records.push(...tnea(MEPCO, 'ECE', 189.8));
records.push(...tnea(MEPCO, 'EEE', 187.2));
records.push(...tnea(MEPCO, 'Mechanical', 185.8));
records.push(...tnea(MEPCO, 'Civil', 182.5));
records.push(...tnea(MEPCO, 'IT', 190.8));

// Sona College of Technology (Salem)
const SONA = 'ea361149-85ba-4962-a99a-bf37f3b1c2b0';
records.push(...tnea(SONA, 'CSE', 190.5));
records.push(...tnea(SONA, 'ECE', 188.8));
records.push(...tnea(SONA, 'EEE', 186.2));
records.push(...tnea(SONA, 'Mechanical', 184.8));
records.push(...tnea(SONA, 'Civil', 181.5));
records.push(...tnea(SONA, 'IT', 189.8));

// National Engineering College (Kovilpatti)
const NEC = '7036048b-ec0d-4931-be64-af15ef743d86';
records.push(...tnea(NEC, 'CSE', 190.2));
records.push(...tnea(NEC, 'ECE', 188.5));
records.push(...tnea(NEC, 'EEE', 185.8));
records.push(...tnea(NEC, 'Mechanical', 184.2));
records.push(...tnea(NEC, 'Civil', 181.0));
records.push(...tnea(NEC, 'IT', 189.5));

// KPR Institute of Engineering and Technology
const KPR = 'f2508b3b-e022-44e2-a3b7-f9e300dc340c';
records.push(...tnea(KPR, 'CSE', 189.8));
records.push(...tnea(KPR, 'ECE', 188.0));
records.push(...tnea(KPR, 'EEE', 185.5));
records.push(...tnea(KPR, 'Mechanical', 183.8));
records.push(...tnea(KPR, 'Civil', 180.5));
records.push(...tnea(KPR, 'IT', 189.0));

// Sri Ramakrishna Engineering College (SREC)
const SREC = '05be3d4a-c9ed-457e-b65b-c2653968b862';
records.push(...tnea(SREC, 'CSE', 189.5));
records.push(...tnea(SREC, 'ECE', 187.8));
records.push(...tnea(SREC, 'EEE', 185.2));
records.push(...tnea(SREC, 'Mechanical', 183.5));
records.push(...tnea(SREC, 'Civil', 180.2));
records.push(...tnea(SREC, 'IT', 188.8));

// SKCT (Sri Krishna College of Technology, Coimbatore)
const SKCT = 'f6fcdbda-e186-40b0-b0cc-acefd436b317';
records.push(...tnea(SKCT, 'CSE', 189.2));
records.push(...tnea(SKCT, 'ECE', 187.5));
records.push(...tnea(SKCT, 'EEE', 184.8));
records.push(...tnea(SKCT, 'Mechanical', 183.2));
records.push(...tnea(SKCT, 'Civil', 179.8));
records.push(...tnea(SKCT, 'IT', 188.5));

// Sri Eshwar College of Engineering
const SECE = '3f55a375-af1b-486a-a993-08c4d3adf3d1';
records.push(...tnea(SECE, 'CSE', 188.8));
records.push(...tnea(SECE, 'ECE', 187.0));
records.push(...tnea(SECE, 'EEE', 184.5));
records.push(...tnea(SECE, 'Mechanical', 182.8));
records.push(...tnea(SECE, 'Civil', 179.5));
records.push(...tnea(SECE, 'IT', 188.0));

// Easwari Engineering College (Chennai)
const EEC = 'b2a960c9-f246-4123-9638-44b24c3cc01c';
records.push(...tnea(EEC, 'CSE', 188.5));
records.push(...tnea(EEC, 'ECE', 186.8));
records.push(...tnea(EEC, 'EEE', 184.2));
records.push(...tnea(EEC, 'Mechanical', 182.5));
records.push(...tnea(EEC, 'Civil', 179.2));
records.push(...tnea(EEC, 'IT', 187.8));

// KSR College of Engineering
const KSR = 'd710a7e4-a3e2-4f32-b293-ed854d7a1d47';
records.push(...tnea(KSR, 'CSE', 187.8));
records.push(...tnea(KSR, 'ECE', 186.0));
records.push(...tnea(KSR, 'EEE', 183.5));
records.push(...tnea(KSR, 'Mechanical', 181.8));
records.push(...tnea(KSR, 'Civil', 178.5));
records.push(...tnea(KSR, 'IT', 187.0));

// Kamaraj College of Engineering and Technology
const KCET = '32b22d67-cb51-40d7-a809-50dab3f3e75f';
records.push(...tnea(KCET, 'CSE', 187.5));
records.push(...tnea(KCET, 'ECE', 185.8));
records.push(...tnea(KCET, 'EEE', 183.2));
records.push(...tnea(KCET, 'Mechanical', 181.5));
records.push(...tnea(KCET, 'Civil', 178.2));
records.push(...tnea(KCET, 'IT', 186.8));

// Karpagam College of Engineering
const KCE = 'abff56c3-d6cc-4c26-b63e-c04072ba5a5e';
records.push(...tnea(KCE, 'CSE', 186.8));
records.push(...tnea(KCE, 'ECE', 185.0));
records.push(...tnea(KCE, 'EEE', 182.5));
records.push(...tnea(KCE, 'Mechanical', 180.8));
records.push(...tnea(KCE, 'Civil', 177.5));
records.push(...tnea(KCE, 'IT', 186.0));

// PSNA College of Engineering and Technology (Dindigul)
const PSNA = '1aa626ca-c985-4ccd-911d-fed8c1b4a50e';
records.push(...tnea(PSNA, 'CSE', 186.5));
records.push(...tnea(PSNA, 'ECE', 184.8));
records.push(...tnea(PSNA, 'EEE', 182.2));
records.push(...tnea(PSNA, 'Mechanical', 180.5));
records.push(...tnea(PSNA, 'Civil', 177.2));
records.push(...tnea(PSNA, 'IT', 185.8));

// SNS College of Technology
const SNS = '7579fa4e-0ad6-4dbc-923e-b1eda81680bb';
records.push(...tnea(SNS, 'CSE', 186.2));
records.push(...tnea(SNS, 'ECE', 184.5));
records.push(...tnea(SNS, 'EEE', 182.0));
records.push(...tnea(SNS, 'Mechanical', 180.2));
records.push(...tnea(SNS, 'Civil', 177.0));
records.push(...tnea(SNS, 'IT', 185.5));

// Sri Ramakrishna Institute of Technology (SRIT)
const SRIT = '75d13053-37db-442a-916a-6de3527ec20d';
records.push(...tnea(SRIT, 'CSE', 185.8));
records.push(...tnea(SRIT, 'ECE', 184.0));
records.push(...tnea(SRIT, 'EEE', 181.5));
records.push(...tnea(SRIT, 'Mechanical', 179.8));
records.push(...tnea(SRIT, 'Civil', 176.5));

// Dr. Mahalingam College of Engineering and Technology
const MCET = 'c50dfc46-a2cd-48a3-91d2-71300c4dc3b4';
records.push(...tnea(MCET, 'CSE', 185.5));
records.push(...tnea(MCET, 'ECE', 183.8));
records.push(...tnea(MCET, 'EEE', 181.2));
records.push(...tnea(MCET, 'Mechanical', 179.5));
records.push(...tnea(MCET, 'Civil', 176.2));

// Sri Sai Ram Engineering College (Chennai)
const SSREC = '2c25f63f-0b42-4d9e-8c16-48f58d24588d';
records.push(...tnea(SSREC, 'CSE', 185.2));
records.push(...tnea(SSREC, 'ECE', 183.5));
records.push(...tnea(SSREC, 'EEE', 180.8));
records.push(...tnea(SSREC, 'Mechanical', 179.2));
records.push(...tnea(SSREC, 'Civil', 175.8));
records.push(...tnea(SSREC, 'IT', 184.5));

// Kalasalingam Engineering
const KARE = 'eed2cb54-f0c0-42ce-a064-d5be1400798d';
records.push(...tnea(KARE, 'CSE', 184.8));
records.push(...tnea(KARE, 'ECE', 183.0));
records.push(...tnea(KARE, 'EEE', 180.5));
records.push(...tnea(KARE, 'Mechanical', 178.8));
records.push(...tnea(KARE, 'Civil', 175.5));

// SVCE (Sri Venkateswara College of Engineering, Sriperumbudur)
const SVCE = '1a303ba5-4e98-4d34-b390-2ba1b8b19e51';
records.push(...tnea(SVCE, 'CSE', 184.5));
records.push(...tnea(SVCE, 'ECE', 182.8));
records.push(...tnea(SVCE, 'EEE', 180.2));
records.push(...tnea(SVCE, 'Mechanical', 178.5));
records.push(...tnea(SVCE, 'Civil', 175.2));
records.push(...tnea(SVCE, 'IT', 183.8));

// Dr. Sivanthi Aditanar College of Engineering
const SIVANTHI = '97099d79-9e6a-44c1-a5c3-aae8808c0647';
records.push(...tnea(SIVANTHI, 'CSE', 184.0));
records.push(...tnea(SIVANTHI, 'ECE', 182.2));
records.push(...tnea(SIVANTHI, 'EEE', 179.8));
records.push(...tnea(SIVANTHI, 'Mechanical', 178.0));
records.push(...tnea(SIVANTHI, 'Civil', 174.8));

// AVC College (Mayiladuthurai)
const AVC = '9999e878-b952-4956-834e-d68eed5c74d3';
records.push(...tnea(AVC, 'CSE', 183.5));
records.push(...tnea(AVC, 'ECE', 181.8));
records.push(...tnea(AVC, 'EEE', 179.2));
records.push(...tnea(AVC, 'Mechanical', 177.5));
records.push(...tnea(AVC, 'Civil', 174.2));

// Rajalakshmi Engineering College (Chennai)
const REC = '63cc8855-174d-4265-b6b1-88c6fe972fd5';
records.push(...tnea(REC, 'CSE', 188.0));
records.push(...tnea(REC, 'ECE', 186.2));
records.push(...tnea(REC, 'EEE', 183.8));
records.push(...tnea(REC, 'Mechanical', 182.0));
records.push(...tnea(REC, 'Civil', 178.8));
records.push(...tnea(REC, 'IT', 187.2));

// ============================================================
// PRIVATE COLLEGES — TNEA
// ============================================================

// Velammal Engineering College (Chennai)
const VEC = '0c9e231a-5883-44b5-be3c-cd0b3ed7acd5';
records.push(...tnea(VEC, 'CSE', 187.5));
records.push(...tnea(VEC, 'ECE', 185.8));
records.push(...tnea(VEC, 'EEE', 183.2));
records.push(...tnea(VEC, 'Mechanical', 181.5));
records.push(...tnea(VEC, 'Civil', 178.2));
records.push(...tnea(VEC, 'IT', 186.8));

// Panimalar Engineering College (Chennai)
const PEC2 = '29502f13-b0b5-41e3-9d1b-66c1369062cf';
records.push(...tnea(PEC2, 'CSE', 187.2));
records.push(...tnea(PEC2, 'ECE', 185.5));
records.push(...tnea(PEC2, 'EEE', 182.8));
records.push(...tnea(PEC2, 'Mechanical', 181.0));
records.push(...tnea(PEC2, 'Civil', 177.8));
records.push(...tnea(PEC2, 'IT', 186.5));

// St. Joseph's College of Engineering (Chennai)
const SJCE = '11384fb0-01d9-45ba-a361-4fe90dc09853';
records.push(...tnea(SJCE, 'CSE', 186.8));
records.push(...tnea(SJCE, 'ECE', 185.0));
records.push(...tnea(SJCE, 'EEE', 182.5));
records.push(...tnea(SJCE, 'Mechanical', 180.8));
records.push(...tnea(SJCE, 'Civil', 177.5));
records.push(...tnea(SJCE, 'IT', 186.0));

// Jeppiaar Engineering College (Chennai)
const JEC = '2e2ad13c-94d3-47dd-9ce4-820704f08064';
records.push(...tnea(JEC, 'CSE', 184.5));
records.push(...tnea(JEC, 'ECE', 182.8));
records.push(...tnea(JEC, 'EEE', 180.2));
records.push(...tnea(JEC, 'Mechanical', 178.5));
records.push(...tnea(JEC, 'Civil', 175.2));

// Jerusalem College of Engineering (Chennai)
const JCEW = 'e4db5266-a86a-4d23-826f-6eada07b6868';
records.push(...tnea(JCEW, 'CSE', 183.8));
records.push(...tnea(JCEW, 'ECE', 182.0));
records.push(...tnea(JCEW, 'EEE', 179.5));
records.push(...tnea(JCEW, 'Mechanical', 177.8));
records.push(...tnea(JCEW, 'Civil', 174.5));

// Meenakshi Sundararajan Engineering College (Chennai)
const MSEC = '6d720d14-7995-41c7-a7d4-f313d5afbd3c';
records.push(...tnea(MSEC, 'CSE', 183.5));
records.push(...tnea(MSEC, 'ECE', 181.8));
records.push(...tnea(MSEC, 'EEE', 179.2));
records.push(...tnea(MSEC, 'Mechanical', 177.5));
records.push(...tnea(MSEC, 'Civil', 174.2));

// Agni College of Technology (Chennai)
const ACT = 'f39af9e3-7022-4c46-83fd-c270fe655ff8';
records.push(...tnea(ACT, 'CSE', 183.2));
records.push(...tnea(ACT, 'ECE', 181.5));
records.push(...tnea(ACT, 'EEE', 178.8));
records.push(...tnea(ACT, 'Mechanical', 177.0));
records.push(...tnea(ACT, 'Civil', 173.8));

// Saveetha Engineering College (Chennai)
const SEC = 'f043430f-34d2-47cb-9be4-becf900eea44';
records.push(...tnea(SEC, 'CSE', 183.0));
records.push(...tnea(SEC, 'ECE', 181.2));
records.push(...tnea(SEC, 'EEE', 178.5));
records.push(...tnea(SEC, 'Mechanical', 176.8));
records.push(...tnea(SEC, 'Civil', 173.5));

// Tagore Engineering College (Chennai / Villupuram)
const TAGORE = '858f8944-4a0b-4133-af6a-b4c1283b3e50';
records.push(...tnea(TAGORE, 'CSE', 182.5));
records.push(...tnea(TAGORE, 'ECE', 180.8));
records.push(...tnea(TAGORE, 'EEE', 178.2));
records.push(...tnea(TAGORE, 'Mechanical', 176.5));
records.push(...tnea(TAGORE, 'Civil', 173.2));

// RVS College of Engineering and Technology (Coimbatore)
const RVS = 'b66db061-7297-4942-b502-be3d0a9cbfe0';
records.push(...tnea(RVS, 'CSE', 182.2));
records.push(...tnea(RVS, 'ECE', 180.5));
records.push(...tnea(RVS, 'EEE', 177.8));
records.push(...tnea(RVS, 'Mechanical', 176.2));
records.push(...tnea(RVS, 'Civil', 172.8));

// Saranathan College of Engineering (Trichy)
const SARANATHAN = 'e630e4bf-f239-43ec-813a-f3006c07e04f';
records.push(...tnea(SARANATHAN, 'CSE', 181.8));
records.push(...tnea(SARANATHAN, 'ECE', 180.0));
records.push(...tnea(SARANATHAN, 'EEE', 177.5));
records.push(...tnea(SARANATHAN, 'Mechanical', 175.8));
records.push(...tnea(SARANATHAN, 'Civil', 172.5));

// Francis Xavier Engineering College (Tirunelveli)
const FXEC = '9b10bf5b-ebbe-4c9f-a5c3-36966ac46c25';
records.push(...tnea(FXEC, 'CSE', 181.5));
records.push(...tnea(FXEC, 'ECE', 179.8));
records.push(...tnea(FXEC, 'EEE', 177.2));
records.push(...tnea(FXEC, 'Mechanical', 175.5));
records.push(...tnea(FXEC, 'Civil', 172.2));

// Nandha Engineering College (Erode)
const NANDHA = '5aed3e7d-e386-4ad9-a594-4fde5ac87a49';
records.push(...tnea(NANDHA, 'CSE', 181.2));
records.push(...tnea(NANDHA, 'ECE', 179.5));
records.push(...tnea(NANDHA, 'EEE', 176.8));
records.push(...tnea(NANDHA, 'Mechanical', 175.2));
records.push(...tnea(NANDHA, 'Civil', 171.8));

// Tamilnadu College of Engineering (Coimbatore)
const TNCE = 'b3395ed1-68a2-408a-8e81-54c1420d8545';
records.push(...tnea(TNCE, 'CSE', 180.8));
records.push(...tnea(TNCE, 'ECE', 179.0));
records.push(...tnea(TNCE, 'EEE', 176.5));
records.push(...tnea(TNCE, 'Mechanical', 174.8));
records.push(...tnea(TNCE, 'Civil', 171.5));

// K.S.R. (Kit Salem already in autonomous, this is Knowledge Institute of Technology)
const KIT = 'a4c873a8-8930-49c0-9f75-dc69acf85fed';
records.push(...tnea(KIT, 'CSE', 180.5));
records.push(...tnea(KIT, 'ECE', 178.8));
records.push(...tnea(KIT, 'EEE', 176.2));
records.push(...tnea(KIT, 'Mechanical', 174.5));
records.push(...tnea(KIT, 'Civil', 171.2));

// Anand Institute of Higher Technology (Chennai)
const AIHT = 'a4200c8e-fbf1-4ee7-bf3f-2d93b166c410';
records.push(...tnea(AIHT, 'CSE', 180.2));
records.push(...tnea(AIHT, 'ECE', 178.5));
records.push(...tnea(AIHT, 'EEE', 175.8));
records.push(...tnea(AIHT, 'Mechanical', 174.2));
records.push(...tnea(AIHT, 'Civil', 170.8));

// Adhiparasakthi Engineering College
const APEC = 'b8c19bf4-9972-4572-bf5b-a6311156b1fe';
records.push(...tnea(APEC, 'CSE', 179.8));
records.push(...tnea(APEC, 'ECE', 178.0));
records.push(...tnea(APEC, 'EEE', 175.5));
records.push(...tnea(APEC, 'Mechanical', 173.8));
records.push(...tnea(APEC, 'Civil', 170.5));

// Mahendra Engineering College (Namakkal)
const MEC = '9a210208-ef9d-49f5-b5e2-c24862615285';
records.push(...tnea(MEC, 'CSE', 179.5));
records.push(...tnea(MEC, 'ECE', 177.8));
records.push(...tnea(MEC, 'EEE', 175.2));
records.push(...tnea(MEC, 'Mechanical', 173.5));
records.push(...tnea(MEC, 'Civil', 170.2));

// Pavai College of Technology (Namakkal)
const PCT = 'd7ef33c7-db32-4b40-acb3-117ff86e4c2e';
records.push(...tnea(PCT, 'CSE', 179.2));
records.push(...tnea(PCT, 'ECE', 177.5));
records.push(...tnea(PCT, 'EEE', 174.8));
records.push(...tnea(PCT, 'Mechanical', 173.2));
records.push(...tnea(PCT, 'Civil', 169.8));

// Sethu Institute of Technology (Virudhunagar)
const SIT = 'eeda1316-94cc-4cfb-a2d9-92bebaab574b';
records.push(...tnea(SIT, 'CSE', 178.8));
records.push(...tnea(SIT, 'ECE', 177.0));
records.push(...tnea(SIT, 'EEE', 174.5));
records.push(...tnea(SIT, 'Mechanical', 172.8));
records.push(...tnea(SIT, 'Civil', 169.5));

// Ponjesly College of Engineering (Nagercoil)
const PJCE = 'c537780f-1b70-459a-8566-dafca3a271f8';
records.push(...tnea(PJCE, 'CSE', 178.5));
records.push(...tnea(PJCE, 'ECE', 176.8));
records.push(...tnea(PJCE, 'EEE', 174.2));
records.push(...tnea(PJCE, 'Mechanical', 172.5));
records.push(...tnea(PJCE, 'Civil', 169.2));

// Cape Institute of Technology (Kanniyakumari)
const CAPE = 'cf8e1ee5-1812-4238-8302-cc40de610bab';
records.push(...tnea(CAPE, 'CSE', 178.2));
records.push(...tnea(CAPE, 'ECE', 176.5));
records.push(...tnea(CAPE, 'EEE', 173.8));
records.push(...tnea(CAPE, 'Mechanical', 172.2));
records.push(...tnea(CAPE, 'Civil', 168.8));

// C. Abdul Hakeem College (Ranipet)
const CAHCET = '547e550a-0c45-4072-832c-21ce05bca021';
records.push(...tnea(CAHCET, 'CSE', 177.8));
records.push(...tnea(CAHCET, 'ECE', 176.0));
records.push(...tnea(CAHCET, 'EEE', 173.5));
records.push(...tnea(CAHCET, 'Mechanical', 171.8));
records.push(...tnea(CAHCET, 'Civil', 168.5));

// Arunai Engineering College (Tiruvannamalai)
const ARUNAI = '9b180143-ca7c-4fac-a2c0-f3c42e0f900d';
records.push(...tnea(ARUNAI, 'CSE', 177.5));
records.push(...tnea(ARUNAI, 'ECE', 175.8));
records.push(...tnea(ARUNAI, 'EEE', 173.2));
records.push(...tnea(ARUNAI, 'Mechanical', 171.5));
records.push(...tnea(ARUNAI, 'Civil', 168.2));

// Paavai Engineering College (Namakkal)
const PAAVAI = '4a636704-a2ee-475f-8a86-73a512743947';
records.push(...tnea(PAAVAI, 'CSE', 177.2));
records.push(...tnea(PAAVAI, 'ECE', 175.5));
records.push(...tnea(PAAVAI, 'EEE', 172.8));
records.push(...tnea(PAAVAI, 'Mechanical', 171.2));
records.push(...tnea(PAAVAI, 'Civil', 167.8));

// Veltech Multi Tech (Chennai)
const VTMT = 'a6d4ecba-11ad-4b2b-8439-8f5b47a89351';
records.push(...tnea(VTMT, 'CSE', 177.0));
records.push(...tnea(VTMT, 'ECE', 175.2));
records.push(...tnea(VTMT, 'EEE', 172.5));
records.push(...tnea(VTMT, 'Mechanical', 170.8));
records.push(...tnea(VTMT, 'Civil', 167.5));

// Sri Manakula Vinayagar Engineering College (Puducherry)
const SMVEC = 'e48aeffa-9411-40cd-b309-5a8b1633a678';
records.push(...tnea(SMVEC, 'CSE', 176.8));
records.push(...tnea(SMVEC, 'ECE', 175.0));
records.push(...tnea(SMVEC, 'EEE', 172.2));
records.push(...tnea(SMVEC, 'Mechanical', 170.5));
records.push(...tnea(SMVEC, 'Civil', 167.2));

// Dhanalakshmi Srinivasan Engineering College (Perambalur)
const DSEC = '58e68f94-648a-4f81-920e-e0006d103b70';
records.push(...tnea(DSEC, 'CSE', 176.5));
records.push(...tnea(DSEC, 'ECE', 174.8));
records.push(...tnea(DSEC, 'EEE', 172.0));
records.push(...tnea(DSEC, 'Mechanical', 170.2));
records.push(...tnea(DSEC, 'Civil', 166.8));

// Sree Vidyanikethan Engineering College (Dharmapuri)
const SVEC = '2eb1423b-050a-4445-a4d7-4ee878fb770a';
records.push(...tnea(SVEC, 'CSE', 176.2));
records.push(...tnea(SVEC, 'ECE', 174.5));
records.push(...tnea(SVEC, 'EEE', 171.8));
records.push(...tnea(SVEC, 'Mechanical', 170.0));
records.push(...tnea(SVEC, 'Civil', 166.5));

// Priyadarshini Engineering College (Vellore)
const PRI = '4f2870a5-eeaf-411e-a2f8-b12ba404e3c9';
records.push(...tnea(PRI, 'CSE', 175.8));
records.push(...tnea(PRI, 'ECE', 174.0));
records.push(...tnea(PRI, 'EEE', 171.5));
records.push(...tnea(PRI, 'Mechanical', 169.8));
records.push(...tnea(PRI, 'Civil', 166.2));

// Raja College of Engineering and Technology (Madurai)
const RAJA = '08c63d34-72fd-4535-babb-7dad6a461f7d';
records.push(...tnea(RAJA, 'CSE', 175.5));
records.push(...tnea(RAJA, 'ECE', 173.8));
records.push(...tnea(RAJA, 'EEE', 171.2));
records.push(...tnea(RAJA, 'Mechanical', 169.5));
records.push(...tnea(RAJA, 'Civil', 166.0));

// Indra Ganesan College of Engineering (Trichy)
const IGCE = '686008f3-b0e3-4c7e-8445-d69e07d08f95';
records.push(...tnea(IGCE, 'CSE', 175.2));
records.push(...tnea(IGCE, 'ECE', 173.5));
records.push(...tnea(IGCE, 'EEE', 170.8));
records.push(...tnea(IGCE, 'Mechanical', 169.2));
records.push(...tnea(IGCE, 'Civil', 165.8));

// Jayaraj Annapackiam College of Engineering (Periyakulam)
const JACE = '62d015df-0cbc-44f8-8400-03ab5b6abb00';
records.push(...tnea(JACE, 'CSE', 174.8));
records.push(...tnea(JACE, 'ECE', 173.0));
records.push(...tnea(JACE, 'EEE', 170.5));
records.push(...tnea(JACE, 'Mechanical', 168.8));
records.push(...tnea(JACE, 'Civil', 165.5));

// Syed Ammal Engineering College (Ramanathapuram)
const SAEC = 'bb8ad123-72a7-4b72-a3a8-35d9b0a186cb';
records.push(...tnea(SAEC, 'CSE', 174.5));
records.push(...tnea(SAEC, 'ECE', 172.8));
records.push(...tnea(SAEC, 'EEE', 170.2));
records.push(...tnea(SAEC, 'Mechanical', 168.5));
records.push(...tnea(SAEC, 'Civil', 165.2));

// Angel College of Engineering and Technology (Tirupur)
const ANGEL = 'b9949479-ad54-4c7b-9a32-66a26614f2b8';
records.push(...tnea(ANGEL, 'CSE', 174.2));
records.push(...tnea(ANGEL, 'ECE', 172.5));
records.push(...tnea(ANGEL, 'EEE', 169.8));
records.push(...tnea(ANGEL, 'Mechanical', 168.2));
records.push(...tnea(ANGEL, 'Civil', 164.8));

// Ariyalur Engineering College
const AEC = '42345f56-94b8-4ad6-b6fb-9d9bf0aae5b6';
records.push(...tnea(AEC, 'CSE', 173.8));
records.push(...tnea(AEC, 'ECE', 172.0));
records.push(...tnea(AEC, 'EEE', 169.5));
records.push(...tnea(AEC, 'Mechanical', 167.8));
records.push(...tnea(AEC, 'Civil', 164.5));

// Arunachala College of Engineering for Women (Vellichanthai)
const ACEW = '584da71a-394a-4c31-a471-89f0c11b967a';
records.push(...tnea(ACEW, 'CSE', 173.5));
records.push(...tnea(ACEW, 'ECE', 171.8));
records.push(...tnea(ACEW, 'EEE', 169.2));
records.push(...tnea(ACEW, 'Mechanical', 167.5));
records.push(...tnea(ACEW, 'Civil', 164.2));

// AVC College of Engineering (Dindigul)
const AVCE = 'a953b498-3f77-47e6-94b3-fe93cfad9ed2';
records.push(...tnea(AVCE, 'CSE', 173.2));
records.push(...tnea(AVCE, 'ECE', 171.5));
records.push(...tnea(AVCE, 'EEE', 168.8));
records.push(...tnea(AVCE, 'Mechanical', 167.2));
records.push(...tnea(AVCE, 'Civil', 163.8));

// Lieu Seela Vicharaga Engineering College
const LSVEC = 'c663d01d-1977-4340-81de-ea3f9c6f031d';
records.push(...tnea(LSVEC, 'CSE', 172.5));
records.push(...tnea(LSVEC, 'ECE', 170.8));
records.push(...tnea(LSVEC, 'EEE', 168.2));
records.push(...tnea(LSVEC, 'Mechanical', 166.5));
records.push(...tnea(LSVEC, 'Civil', 163.2));

// Rathinam College of Arts and Science (Coimbatore)
const RCAS = '79cd9135-1829-4669-a478-52199e27b41b';
records.push(...tnea(RCAS, 'CSE', 172.2));
records.push(...tnea(RCAS, 'IT', 171.5));

// ============================================================
// DEEMED UNIVERSITIES — TNEA + own entrance
// ============================================================

// SRM Institute (SRMJEEE, but TNEA marks also accepted)
const SRM = '20bc210a-9b9e-480b-8ce3-cc5d8cbaa4ab';
records.push(...tnea(SRM, 'CSE', 192.0));
records.push(...tnea(SRM, 'ECE', 190.2));
records.push(...tnea(SRM, 'EEE', 187.8));
records.push(...tnea(SRM, 'Mechanical', 186.2));
records.push(...tnea(SRM, 'Civil', 183.0));
records.push(...tnea(SRM, 'IT', 191.2));
records.push(...tnea(SRM, 'AI & Data Science', 191.8));

// VIT Vellore (VITEEE, but TNEA marks context)
const VIT = 'cmqhymp5m003g0xutzsez60qq';
records.push(...tnea(VIT, 'CSE', 193.5));
records.push(...tnea(VIT, 'ECE', 191.8));
records.push(...tnea(VIT, 'EEE', 189.2));
records.push(...tnea(VIT, 'Mechanical', 187.8));
records.push(...tnea(VIT, 'Civil', 184.5));
records.push(...tnea(VIT, 'IT', 192.8));
records.push(...tnea(VIT, 'AI & Data Science', 193.0));

// Amrita School of Engineering (Coimbatore)
const AMRITA = '211e2430-0d62-4b7c-9780-65f65976b7a4';
records.push(...tnea(AMRITA, 'CSE', 191.2));
records.push(...tnea(AMRITA, 'ECE', 189.5));
records.push(...tnea(AMRITA, 'EEE', 187.0));
records.push(...tnea(AMRITA, 'Mechanical', 185.5));
records.push(...tnea(AMRITA, 'Civil', 182.2));
records.push(...tnea(AMRITA, 'IT', 190.5));
records.push(...tnea(AMRITA, 'AI & Data Science', 191.0));

// SASTRA Deemed University
const SASTRA = '948c90d3-24a0-4f3a-b178-11f61aaffd7a';
records.push(...tnea(SASTRA, 'CSE', 190.8));
records.push(...tnea(SASTRA, 'ECE', 189.0));
records.push(...tnea(SASTRA, 'EEE', 186.5));
records.push(...tnea(SASTRA, 'Mechanical', 185.0));
records.push(...tnea(SASTRA, 'Civil', 181.8));
records.push(...tnea(SASTRA, 'IT', 190.0));

// Sathyabama Institute of Science and Technology
const SATHYABAMA = 'fc6229c1-7bf2-4084-ad71-ea3ee849afa9';
records.push(...tnea(SATHYABAMA, 'CSE', 189.5));
records.push(...tnea(SATHYABAMA, 'ECE', 187.8));
records.push(...tnea(SATHYABAMA, 'EEE', 185.2));
records.push(...tnea(SATHYABAMA, 'Mechanical', 183.8));
records.push(...tnea(SATHYABAMA, 'Civil', 180.5));
records.push(...tnea(SATHYABAMA, 'IT', 188.8));

// Karunya Institute of Technology and Sciences
const KARUNYA = 'e328d0ed-a925-4e9a-b8b5-bf05262323d8';
records.push(...tnea(KARUNYA, 'CSE', 189.2));
records.push(...tnea(KARUNYA, 'ECE', 187.5));
records.push(...tnea(KARUNYA, 'EEE', 185.0));
records.push(...tnea(KARUNYA, 'Mechanical', 183.5));
records.push(...tnea(KARUNYA, 'Civil', 180.2));
records.push(...tnea(KARUNYA, 'IT', 188.5));

// Hindustan Institute of Technology and Science (Chennai)
const HITS = '92068594-31a4-40c9-8d1e-ed85db8696ec';
records.push(...tnea(HITS, 'CSE', 188.8));
records.push(...tnea(HITS, 'ECE', 187.0));
records.push(...tnea(HITS, 'EEE', 184.5));
records.push(...tnea(HITS, 'Mechanical', 183.0));
records.push(...tnea(HITS, 'Civil', 179.8));
records.push(...tnea(HITS, 'IT', 188.0));

// Vel Tech (Chennai)
const VELTECH = '4c6f3067-4248-41ea-9193-9697d6594246';
records.push(...tnea(VELTECH, 'CSE', 185.5));
records.push(...tnea(VELTECH, 'ECE', 183.8));
records.push(...tnea(VELTECH, 'EEE', 181.2));
records.push(...tnea(VELTECH, 'Mechanical', 179.5));
records.push(...tnea(VELTECH, 'Civil', 176.2));
records.push(...tnea(VELTECH, 'IT', 184.8));

// Periyar Maniammai Institute of Science and Technology
const PMIST = 'ccf27b87-eea6-4c6e-86f0-68a7e75bf0b4';
records.push(...tnea(PMIST, 'CSE', 185.0));
records.push(...tnea(PMIST, 'ECE', 183.2));
records.push(...tnea(PMIST, 'EEE', 180.8));
records.push(...tnea(PMIST, 'Mechanical', 179.0));
records.push(...tnea(PMIST, 'Civil', 175.8));

// Crescent Institute of Science and Technology
const CIST = '6509827b-4884-47c7-8c86-de9a18426aa0';
records.push(...tnea(CIST, 'CSE', 184.8));
records.push(...tnea(CIST, 'ECE', 183.0));
records.push(...tnea(CIST, 'EEE', 180.5));
records.push(...tnea(CIST, 'Mechanical', 178.8));
records.push(...tnea(CIST, 'Civil', 175.5));

// Noorul Islam Centre for Higher Education
const NICHE = '808963c6-f55e-43b2-bd37-50523c42a774';
records.push(...tnea(NICHE, 'CSE', 183.5));
records.push(...tnea(NICHE, 'ECE', 181.8));
records.push(...tnea(NICHE, 'EEE', 179.2));
records.push(...tnea(NICHE, 'Mechanical', 177.5));
records.push(...tnea(NICHE, 'Civil', 174.2));

// Kalasalingam Academy of Research and Education
const KARE2 = '1d0358db-e9df-4db3-a452-199673dd03fd';
records.push(...tnea(KARE2, 'CSE', 183.2));
records.push(...tnea(KARE2, 'ECE', 181.5));
records.push(...tnea(KARE2, 'EEE', 178.8));
records.push(...tnea(KARE2, 'Mechanical', 177.2));
records.push(...tnea(KARE2, 'Civil', 173.8));

// ============================================================
// INSERT ALL RECORDS
// ============================================================
console.log(`Inserting ${records.length} cutoff records...`);

const BATCH = 200;
for (let i = 0; i < records.length; i += BATCH) {
  const batch = records.slice(i, i + BATCH);
  const values = batch.map((r, j) => {
    const base = j * 7;
    return `($${base+1},$${base+2},$${base+3}::int,$${base+4},$${base+5},$${base+6}::float8,$${base+7}::float8,NOW())`;
  }).join(',');
  const params = batch.flatMap(r => [r.id, r.collegeId, r.year, r.branch, r.category, r.openRank, r.closeRank]);
  await pool.query(
    `INSERT INTO "Cutoff" (id,"collegeId",year,branch,category,"openRank","closeRank","createdAt") VALUES ${values}`,
    params
  );
  console.log(`Inserted batch ${Math.floor(i/BATCH)+1} (${Math.min(i+BATCH, records.length)}/${records.length})`);
}

const total = await pool.query('SELECT COUNT(*) FROM "Cutoff"');
console.log('Done! Total cutoff records:', total.rows[0].count);
await pool.end();
