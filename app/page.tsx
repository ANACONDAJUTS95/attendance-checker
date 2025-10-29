'use client';

import { StudentListTable } from "@/components/StudentListTable";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { FaCheckCircle } from "react-icons/fa";
import { students } from "@/lib/data/studentLists";
import { useState, useCallback } from "react";

export default function Home() {
  const [scannedStudents, setScannedStudents] = useState<Record<string, string>>({});
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-between py-8 bg-[#E2F1F6]">
      <div className="w-full flex flex-col items-center">
        <h1 className="text-4xl font-black uppercase text-[#111111]">Attendance Checker</h1>
        <div className="flex flex-row items-center justify-center gap-4 mt-6 mb-8">
          <div className="flex flex-row gap-2 items-center justify-center">
            <FaCheckCircle className="text-green-500 text-base" />
            <p className="text-lg text-[#111111]">Camera is detected</p>
          </div>
          <hr className="border border-black/10 h-5"/>
          <div className="flex flex-row gap-2 items-center justify-center">
            <FaCheckCircle className="text-green-500 text-base" />
            <p className="text-lg text-[#111111]">Database loaded</p>
          </div>
        </div>

        <div className="mb-8 w-full max-w-xl mx-auto px-4">
          <BarcodeScanner onScan={handleScan} />
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
    </div>
  );
}
