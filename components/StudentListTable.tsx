import { useState } from 'react';

interface Student {
  name: string;
  studentNumber: string;
  timeIn?: string;
}

interface StudentListTableProps {
  title: string;
  students: Student[];
  onAttendanceMarked?: (studentNumber: string, timeIn: string) => void;
}

export function StudentListTable({ title, students, onAttendanceMarked }: StudentListTableProps) {
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});

  const markAttendance = (studentNumber: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    
    setAttendanceData(prev => ({
      ...prev,
      [studentNumber]: timeString
    }));

    onAttendanceMarked?.(studentNumber, timeString);
  };

  return (
    <div className="w-full max-w-2xl mx-4">
      <h2 className="text-2xl font-bold mb-4 text-[#111111]">{title}</h2>
      <div className="overflow-hidden shadow border-1 border-black/6 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                Student Name
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Time In
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {students.map((student) => {
              const timeIn = attendanceData[student.studentNumber] || student.timeIn;
              return (
                <tr key={student.studentNumber} className={timeIn ? "bg-green-50" : undefined}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    {student.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {timeIn || "Not yet present"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}