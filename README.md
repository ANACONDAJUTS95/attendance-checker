# St. Jerome's Academy Attendance Checker

A web-based attendance system that uses PDF417 barcodes to track student attendance. This system allows for quick and efficient attendance tracking by scanning student-specific barcodes and automatically recording their time-in.

## Features

- PDF417 barcode generation for each student
- Real-time barcode scanning using device camera
- Separate tables for male and female students
- Automatic time-in recording
- Mobile-responsive design

## Prerequisites

Before running this project, make sure you have:
- Node.js installed (v16 or higher)
- A modern web browser
- A device with a camera for barcode scanning

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/ANACONDAJUTS95/attendance-checker.git
cd attendance-checker
```

2. Install dependencies:
```bash
npm install
```

3. Update student list:
- Navigate to `lib/data/studentLists.ts`
- Modify the students array to match your section's student list
- Follow the existing format:
```typescript
{
  name: "Student Name",
  gender: "male" | "female",
  studentNumber: "2023-XXXX"
}
```

4. Generate PDF417 barcodes for students:
```bash
npx ts-node scripts/generateBarcodes.ts
```
This will create barcode images in the `lib/pdf417-generated-code` folder. Print these barcodes and distribute them to the corresponding students.

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to use the attendance system.

## Usage

1. When the app loads, it will request camera access
2. Hold a student's PDF417 barcode in front of the camera
3. The system will automatically:
   - Scan the barcode
   - Identify the student
   - Record their time-in
   - Update the appropriate table (male/female)
   - Highlight the student's row in green

## Technical Details

This project is built with:
- Next.js 14
- TypeScript
- Tailwind CSS
- ZXing for barcode scanning
- BWIP-JS for barcode generation

## Note

Make sure to properly align the barcodes when scanning:
- Hold the barcode steady
- Ensure good lighting
- Keep the barcode within 6-12 inches from the camera
- Align the barcode horizontally in the camera view

## Copyright and Usage Notice

© 2025 St. Jerome's Academy Attendance Checker by Anthon Chris Ellys S. Sepacio. All Rights Reserved.

This project is developed primarily for:
1. Academic research purposes
2. Portfolio demonstration
3. Educational technology advancement

**Research & Portfolio Usage:**
- This attendance system serves as a demonstration of modern web technologies and automated attendance tracking solutions
- The implementation showcases practical applications of barcode technology in educational settings
- The codebase demonstrates proficiency in Next.js, TypeScript, and real-time data processing

Any use, reproduction, or distribution of this software must:
- Maintain all copyright notices
- Acknowledge the original source
- Be used for non-commercial, educational, or research purposes only

For any inquiries about usage or collaboration, please contact the repository owner.
