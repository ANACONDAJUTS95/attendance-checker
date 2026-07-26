export interface Student {
    name: string;
    gender: 'male' | 'female';
    studentNumber: string;
    timeIn?: string; // Optional since it will be filled when they check in
}

export interface ClassSection {
    id: string;    // e.g. "grade12-st-jude-thaddeus"
    label: string; // e.g. "Grade 12 - St. Jude Thaddeus"
    students: Student[];
}

export const CLASS_SECTIONS: ClassSection[] = [
    {
        id: "grade12-st-jude-thaddeus",
        label: "Grade 12 - St. Jude Thaddeus",
        students: [
            // Boys
            { name: "Karter Bernardino Abella", gender: "male", studentNumber: "2026-0001" },
            { name: "Ranzale Will Halina Adonis", gender: "male", studentNumber: "2026-0002" },
            { name: "Lance Ninxander San Juan Bagnas", gender: "male", studentNumber: "2026-0003" },
            { name: "Giro Guerzon Balangatan", gender: "male", studentNumber: "2026-0004" },
            { name: "Akiko Leighrobe Balayo", gender: "male", studentNumber: "2026-0005" },
            { name: "Ghio Beato", gender: "male", studentNumber: "2026-0006" },
            { name: "Kaizer John Pendre Bolire", gender: "male", studentNumber: "2026-0007" },
            { name: "Prince Buenaventura", gender: "male", studentNumber: "2026-0008" },
            { name: "Karl Enzo Medina Carigma", gender: "male", studentNumber: "2026-0009" },
            { name: "Prince Eugene Cenedo", gender: "male", studentNumber: "2026-0010" },
            { name: "Vince Cedrick Clarito", gender: "male", studentNumber: "2026-0011" },
            { name: "Rain Mark Catubig Fabiano", gender: "male", studentNumber: "2026-0012" },
            { name: "Jake Justine Ibardaloza Felix", gender: "male", studentNumber: "2026-0013" },
            { name: "Jimmy Canto Feniquito", gender: "male", studentNumber: "2026-0014" },
            { name: "Carter Vinz Millare Francisco", gender: "male", studentNumber: "2026-0015" },
            { name: "Jhuztine Alphonse Cruz Meneses", gender: "male", studentNumber: "2026-0016" },
            { name: "Ian Darryl San Buenaventura Millar", gender: "male", studentNumber: "2026-0017" },
            { name: "James Nuguid", gender: "male", studentNumber: "2026-0018" },
            { name: "Matthew Alzent Bolante San Jose", gender: "male", studentNumber: "2026-0019" },
            { name: "Dax Melbourne Suizo", gender: "male", studentNumber: "2026-0020" },
            { name: "Allen Jeigh Pantaleon", gender: "male", studentNumber: "2026-0021" },

            // Girls
            { name: "Carlene De Jesus Abundo", gender: "female", studentNumber: "2026-0022" },
            { name: "Ericka Jane Sta. Ana Alo", gender: "female", studentNumber: "2026-0023" },
            { name: "Ianne Mishka Francisco Arbiol", gender: "female", studentNumber: "2026-0024" },
            { name: "Selem Mata Austria", gender: "female", studentNumber: "2026-0025" },
            { name: "Khate Ashley Besmonte", gender: "female", studentNumber: "2026-0026" },
            { name: "Angelyn Grepalda Bilog", gender: "female", studentNumber: "2026-0027" },
            { name: "Princess Diane Delos Santos Castaneda", gender: "female", studentNumber: "2026-0028" },
            { name: "Roselle Deinla", gender: "female", studentNumber: "2026-0029" },
            { name: "Angel Dela Cruz De Leon", gender: "female", studentNumber: "2026-0030" },
            { name: "Lhiana Mharis Astillero De Leon", gender: "female", studentNumber: "2026-0031" },
            { name: "Christine Joyce Blanco De Jesus", gender: "female", studentNumber: "2026-0032" },
            { name: "Katrina Mae Leano Francisco", gender: "female", studentNumber: "2026-0033" },
            { name: "Cassandra Lorraine Feliciano Gadon", gender: "female", studentNumber: "2026-0034" },
            { name: "Kisha Mae Javier Gonzalvo", gender: "female", studentNumber: "2026-0035" },
            { name: "Jewel Rosario Macedonio", gender: "female", studentNumber: "2026-0036" },
            { name: "Riza Mae Bajala Oblino", gender: "female", studentNumber: "2026-0037" },
            { name: "Jinger San Luis Ortega", gender: "female", studentNumber: "2026-0038" },
            { name: "Chelsea Mae Bautista Pamintuan", gender: "female", studentNumber: "2026-0039" },
            { name: "Allysa Nicole Bolado Pascual", gender: "female", studentNumber: "2026-0040" },
            { name: "Deanna Joy Espiritu Santo Paz", gender: "female", studentNumber: "2026-0041" },
            { name: "Gabriellah Dumala Ramos", gender: "female", studentNumber: "2026-0042" },
            { name: "Anne Trixie Tiratira", gender: "female", studentNumber: "2026-0043" },
            { name: "Mary Jamie Wyds Tiratira", gender: "female", studentNumber: "2026-0044" },
        ],
    },
];

export function getSectionById(id: string): ClassSection | undefined {
    return CLASS_SECTIONS.find(section => section.id === id);
}

// Preserved for scripts/generateBarcodes.ts, which generates barcodes for
// every student regardless of section.
export const students: Student[] = CLASS_SECTIONS.flatMap(section => section.students);