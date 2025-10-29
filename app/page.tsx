'use client';

import { StudentListTable } from "@/components/StudentListTable";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { FaCheckCircle } from "react-icons/fa";
import { students } from "@/lib/data/studentLists";
import { useState, useCallback } from "react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Home() {
  const [scannedStudents, setScannedStudents] = useState<Record<string, string>>({});
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const femaleStudents = students.filter(student => student.gender === 'female')
    .map(student => ({ ...student, timeIn: scannedStudents[student.studentNumber] }));
  const maleStudents = students.filter(student => student.gender === 'male')
    .map(student => ({ ...student, timeIn: scannedStudents[student.studentNumber] }));

  const handleScan = useCallback((studentNumber: string) => {
    setScannedStudents(prev => {
      if (prev[studentNumber]) {
        // Already scanned, ignore
        return prev;
      }
      
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      
      return {
        ...prev,
        [studentNumber]: timeString
      };
    });
  }, []);

  const handleExportPDF = useCallback(() => {
    const doc = new jsPDF();
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Add title and date
    doc.setFontSize(16);
    doc.text('St. Jerome\'s Academy - Attendance Sheet', 15, 15);
    doc.setFontSize(12);
    doc.text(dateStr, 15, 25);

    // Prepare female students data
    const femaleTableData = femaleStudents.map(student => [
      student.name,
      student.studentNumber,
      student.timeIn || 'ABSENT'
    ]);

    // Add female students table
    doc.setFontSize(14);
    doc.text('Female Students', 15, 35);
    autoTable(doc, {
      head: [['Name', 'Student Number', 'Time In']],
      body: femaleTableData,
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [100, 149, 237] } // Cornflower blue
    });

    // Add male students table
    const maleTableData = maleStudents.map(student => [
      student.name,
      student.studentNumber,
      student.timeIn || 'ABSENT'
    ]);

    const femaleTableHeight = femaleTableData.length * 10 + 45; // Approximate height calculation
    
    doc.text('Male Students', 15, femaleTableHeight + 15);
    autoTable(doc, {
      head: [['Name', 'Student Number', 'Time In']],
      body: maleTableData,
      startY: femaleTableHeight + 20,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [100, 149, 237] }
    });

    // Add summary at the bottom
    const totalPresent = [...femaleStudents, ...maleStudents].filter(s => s.timeIn).length;
    const totalAbsent = students.length - totalPresent;
    
    const summaryY = femaleTableHeight + (maleTableData.length * 10) + 40;
    doc.setFontSize(12);
    doc.text(`Total Present: ${totalPresent}`, 15, summaryY);
    doc.text(`Total Absent: ${totalAbsent}`, 15, summaryY + 10);

    // Save the PDF
    doc.save(`attendance-${today.toISOString().split('T')[0]}.pdf`);
  }, [femaleStudents, maleStudents]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-8 bg-[#E2F1F6]">
      <div className="w-full flex flex-col items-center">
        <h1 className="text-4xl font-black uppercase text-[#111111]">Attendance Checker</h1>
        <div className="flex flex-row items-center justify-center gap-4 mt-2 mb-8">
          <div className="flex flex-row gap-2 items-center justify-center">
            <FaCheckCircle className={`${isCameraActive ? 'text-green-500' : 'text-black/50'} text-base transition-colors`} />
            <p className={`${isCameraActive ? 'text-green-500' : 'text-black/50'} text-lg transition-colors`}>
              {isCameraActive ? 'Camera is active' : 'Camera initializing...'}
            </p>
          </div>
        </div>

        <div className="mb-8 w-full max-w-xl mx-auto px-4">
          <BarcodeScanner 
            onScan={handleScan} 
            onCameraStatusChange={setIsCameraActive}
          />
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 items-start justify-center w-full px-4">
        <StudentListTable 
          title="Female Students" 
          students={femaleStudents}
        />
        <StudentListTable 
          title="Male Students" 
          students={maleStudents}
        />
      </div>

      <div className="flex mt-6 w-[78%] flex-col gap-2">
        <button 
          onClick={handleExportPDF}
          className="text-white font-semibold bg-blue-500 px-4 py-2 rounded w-fit hover:bg-blue-600 transition-colors"
        >
          Export Attendance Sheet
        </button>
        <p className="text-black/40">Will export attendance in PDF form</p>
      </div>
    </div>
  );
}
