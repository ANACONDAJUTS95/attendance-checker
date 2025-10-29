export interface Student {
    name: string;
    gender: 'male' | 'female';
    studentNumber: string;
    timeIn?: string; // Optional since it will be filled when they check in
}

export const students: Student[] = [
    { name: "John Smith", gender: "male", studentNumber: "2023-0001" },
    { name: "Maria Garcia", gender: "female", studentNumber: "2023-0002" },
    { name: "David Lee", gender: "male", studentNumber: "2023-0003" },
    { name: "Sarah Johnson", gender: "female", studentNumber: "2023-0004" },
    { name: "Michael Brown", gender: "male", studentNumber: "2023-0005" },
    { name: "Emma Wilson", gender: "female", studentNumber: "2023-0006" },
    { name: "James Davis", gender: "male", studentNumber: "2023-0007" },
    { name: "Sophie Martinez", gender: "female", studentNumber: "2023-0008" },
    { name: "Daniel Taylor", gender: "male", studentNumber: "2023-0009" },
    { name: "Olivia Anderson", gender: "female", studentNumber: "2023-0010" },
];
