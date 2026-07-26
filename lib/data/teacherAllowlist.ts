export const APPROVED_TEACHERS: string[] = [
    // Add teacher personal emails here, one per line
    "acesepacio@gmail.com",
    "christinejocena@gmail.com",
];

export function isApprovedTeacher(email: string): boolean {
    return APPROVED_TEACHERS.includes(email.toLowerCase().trim());
}
