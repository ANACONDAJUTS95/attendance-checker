import { writeFileSync } from 'fs';
import { join } from 'path';
import bwipjs from 'bwip-js';
import { students, Student } from '../lib/data/studentLists';

// Function to generate PDF417 barcode for a student
async function generatePDF417(studentNumber: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        bwipjs.toBuffer({
            bcid: 'pdf417',       // Barcode type
            text: studentNumber,   // Text to encode
            scale: 3,             // 3x scaling factor
            height: 10,           // Bar height, in millimeters
            width: 50,            // Module width in millimeters
            includetext: true,    // Show human-readable text
            textxalign: 'center', // Center the text
        }, (err: string | Error, png: Buffer) => {
            if (err) {
                reject(err);
            } else {
                resolve(png);
            }
        });
    });
}

// Generate codes for all students
async function generateAllCodes() {
    for (const student of students) {
        try {
            const barcodeBuffer = await generatePDF417(student.studentNumber);
            const filePath = join(__dirname, '../lib/pdf417-generated-code', `${student.studentNumber}.png`);
            writeFileSync(filePath, barcodeBuffer);
            console.log(`Generated PDF417 code for student: ${student.name} (${student.studentNumber})`);
        } catch (error) {
            console.error(`Error generating code for student ${student.studentNumber}:`, error);
        }
    }
}

// Run the generator
generateAllCodes().catch(console.error);