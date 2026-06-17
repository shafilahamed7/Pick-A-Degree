import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPackage(crore: number) {
  if (crore >= 1) return `₹${crore.toFixed(1)} Cr`;
  return `₹${(crore * 100).toFixed(0)} L`;
}

export function formatFee(annual: number) {
  if (annual >= 100000) return `₹${(annual / 100000).toFixed(1)} L/yr`;
  return `₹${(annual / 1000).toFixed(0)}K/yr`;
}

export const DISTRICTS = [
  "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli",
  "Erode", "Vellore", "Thoothukudi", "Dindigul", "Thanjavur", "Ranipet",
  "Kancheepuram", "Sivakasi", "Tirupur", "Kumbakonam", "Nagercoil", "Hosur",
];

export const COLLEGE_TYPES = [
  { value: "IIT", label: "IIT" },
  { value: "NIT", label: "NIT" },
  { value: "UNIVERSITY", label: "University" },
  { value: "GOVERNMENT", label: "Government" },
  { value: "AUTONOMOUS", label: "Autonomous" },
  { value: "PRIVATE", label: "Private" },
  { value: "DEEMED", label: "Deemed" },
];

export const COURSE_TYPES = [
  "Computer Science Engineering",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Information Technology",
  "AI & Data Science",
  "Biotechnology",
  "Chemical Engineering",
  "MBBS",
  "MBA",
  "MCA",
];
