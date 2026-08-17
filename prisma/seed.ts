import { PrismaClient, Role, AuditStatus, SubmissionStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function main() {
  const passwordHash = await bcrypt.hash("Demo@2026", 10);
  const cse = await prisma.department.upsert({ where: { code: "CSE" }, update: {}, create: { name: "Computer Science & Engineering", code: "CSE" } });
  const ece = await prisma.department.upsert({ where: { code: "ECE" }, update: {}, create: { name: "Electronics & Communication", code: "ECE" } });
  await Promise.all([
    prisma.user.upsert({ where: { email: "admin@audit.edu" }, update: {}, create: { name: "Aarav Sharma", email: "admin@audit.edu", passwordHash, role: Role.ADMIN } }),
    prisma.user.upsert({ where: { email: "coordinator@audit.edu" }, update: {}, create: { name: "Meera Nair", email: "coordinator@audit.edu", passwordHash, role: Role.COORD, departmentId: cse.id } }),
    prisma.user.upsert({ where: { email: "head.cse@audit.edu" }, update: {}, create: { name: "Dr. Vikram Rao", email: "head.cse@audit.edu", passwordHash, role: Role.DEPT_HEAD, departmentId: cse.id } }),
    prisma.user.upsert({ where: { email: "auditor@audit.edu" }, update: {}, create: { name: "Nisha Kapoor", email: "auditor@audit.edu", passwordHash, role: Role.AUDITOR } }),
  ]);
  const cycle = await prisma.auditCycle.upsert({ where: { year_title: { year: 2026, title: "Institutional Quality Audit" } }, update: {}, create: { title: "Institutional Quality Audit", year: 2026, status: AuditStatus.ACTIVE } });
  const items = [
    ["Infrastructure", "Laboratory Safety & Equipment", "Verify calibration, safety records and equipment availability.", 25],
    ["Academics", "Course File Completeness", "Confirm course plans, CO mapping and attainment evidence.", 20],
    ["Research", "Research Publications", "Review indexed publications and funded research evidence.", 20],
    ["Student Support", "Placement & Career Services", "Review placement reports and career guidance records.", 15],
    ["Governance", "Faculty Development", "Review faculty training and professional development records.", 20],
  ];
  for (const [category, title, description, weightagePercentage] of items) {
    const item = await prisma.checklistItem.upsert({ where: { id: `${cycle.id}-${String(title).slice(0, 4)}` }, update: {}, create: { auditCycleId: cycle.id, category: String(category), title: String(title), description: String(description), weightagePercentage: Number(weightagePercentage) } });
    await prisma.submission.upsert({ where: { checklistItemId_departmentId: { checklistItemId: item.id, departmentId: cse.id } }, update: {}, create: { checklistItemId: item.id, departmentId: cse.id, evidenceUrl: "https://example.com/evidence/sample.pdf", fileType: "application/pdf", status: SubmissionStatus.SUBMITTED, submittedAt: new Date() } });
  }
  console.log({ cycle: cycle.title, departments: [cse.code, ece.code], demoPassword: "Demo@2026" });
}
main().finally(() => prisma.$disconnect());
