import { CLASS_START_TIME } from '@/lib/data/studentLists';

interface Student {
  name: string;
  studentNumber: string;
  timeIn?: string;
}

interface StudentListTableProps {
  title: string;
  students: Student[];
}

function isLate(timeIn: string): boolean {
  const scheduledTimeIn = CLASS_START_TIME;
  // Parse the actual time-in (12h format produced by toLocaleTimeString)
  const [timePart, period] = timeIn.trim().split(' ');
  const [rawHour, rawMinute] = timePart.split(':').map(Number);

  let actualHour = rawHour % 12;
  if (period?.toUpperCase() === 'PM') actualHour += 12;

  const actualMinutes = actualHour * 60 + rawMinute;

  // Parse the scheduled time (24h "HH:MM")
  const [schedHour, schedMinute] = scheduledTimeIn.split(':').map(Number);
  const scheduledMinutes = schedHour * 60 + schedMinute;

  return actualMinutes > scheduledMinutes;
}

export function StudentListTable({ title, students }: StudentListTableProps) {
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
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => {
              const timeIn = student.timeIn;
              const late = timeIn ? isLate(timeIn) : false;

              const cellStyle: React.CSSProperties = {
                backgroundColor: timeIn
                  ? late
                    ? '#fecaca' // pastel red  — late (red-200)
                    : '#bbf7d0' // pastel green — on time (green-200)
                  : '#ffffff',  // white — absent
              };

              const nameColor = late ? '#b91c1c' : '#111827'; 
              const valueColor = late ? '#dc2626' : '#16a34a'; 

              return (
                <tr key={student.studentNumber}>
                  <td style={{ ...cellStyle, color: nameColor }} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium">
                    {student.name}
                  </td>
                  <td style={{ ...cellStyle, color: timeIn ? valueColor : '#6b7280' }} className="whitespace-nowrap px-3 py-4 text-sm">
                    {timeIn ?? 'Not yet present'}
                  </td>
                  <td style={{ ...cellStyle, color: timeIn ? valueColor : '#6b7280' }} className="whitespace-nowrap px-3 py-4 text-sm font-semibold">
                    {timeIn
                      ? late
                        ? '⚠️ Late'
                        : timeIn
                      : '—'}
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