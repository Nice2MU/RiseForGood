import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchMyActivities } from "../features/activities/activitiesSlice";
import { Activity } from "../types/Activity";

const ActivityCalendarPage = () => {
  const dispatch = useAppDispatch();
  const { myActivities, myLoading, myError } = useAppSelector((s) => s.activities);
  const { user } = useAppSelector((s) => s.auth);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchMyActivities());
    }
  }, [dispatch, user]);

  const monthNames = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  const dayNames = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const groupActivitiesByDate = () => {
    const grouped: { [key: string]: Activity[] } = {};
    myActivities.forEach((activity) => {
      const date = activity.date; // format: YYYY-MM-DD
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(activity);
    });
    return grouped;
  };

  const activitiesByDate = groupActivitiesByDate();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-primary mb-6">📅 ปฏิทินกิจกรรมที่ฉันสมัคร</h1>

      {!user && (
        <div className="card bg-base-100 border border-primary/20 shadow-sm max-w-2xl mx-auto">
          <div className="card-body text-center">
            <p className="text-gray-600">เข้าสู่ระบบเพื่อดูปฏิทินกิจกรรมที่คุณสมัครไว้</p>
          </div>
        </div>
      )}

      {user && (
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
          {/* Calendar */}
          <div className="card bg-base-100 border border-primary/10 shadow-sm">
            <div className="card-body p-4">
              <div className="flex justify-between items-center mb-4">
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={previousMonth}
                >
                  ←
                </button>
                <h2 className="text-lg font-bold text-primary">
                  {monthNames[month]} {year}
                </h2>
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={nextMonth}
                >
                  →
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  const dateKey = day ? formatDateKey(year, month, day) : null;
                  const hasActivities = dateKey && activitiesByDate[dateKey] && activitiesByDate[dateKey].length > 0;
                  const isSelected = dateKey === selectedDate;

                  return (
                    <button
                      key={index}
                      className={`p-2 rounded-lg text-xs font-semibold transition-all ${
                        !day
                          ? "bg-transparent"
                          : isSelected
                          ? "bg-primary text-white ring-2 ring-primary/30"
                          : hasActivities
                          ? "bg-success/20 text-success border border-success/50 hover:bg-success/30"
                          : "bg-base-200 hover:bg-base-300"
                      }`}
                      onClick={() => dateKey && setSelectedDate(isSelected ? null : dateKey)}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 p-2 bg-base-200 rounded-lg text-[11px] text-gray-600">
                <p>💚 = วันที่มีกิจกรรมสมัครไว้</p>
                <p>🔵 = วันที่เลือก</p>
              </div>
            </div>
          </div>

          {/* Activities List */}
          <div className="space-y-3">
            {myLoading && (
              <div className="flex justify-center items-center h-32">
                <span className="loading loading-spinner loading-lg" />
              </div>
            )}

            {myError && (
              <div className="alert alert-error text-sm">
                <span>{myError}</span>
              </div>
            )}

            {!myLoading && !selectedDate && (
              <div className="card bg-base-100 border border-primary/10 shadow-sm">
                <div className="card-body">
                  <p className="text-sm text-gray-500 text-center py-8">
                    เลือกวันที่จากปฏิทิน เพื่อดูรายการกิจกรรมที่คุณสมัคร
                  </p>
                </div>
              </div>
            )}

            {selectedDate && (!activitiesByDate[selectedDate] || activitiesByDate[selectedDate].length === 0) && (
              <div className="card bg-base-100 border border-primary/10 shadow-sm">
                <div className="card-body">
                  <p className="text-sm text-gray-500 text-center py-8">
                    ไม่มีกิจกรรมสมัครในวันที่ {selectedDate}
                  </p>
                </div>
              </div>
            )}

            {selectedDate && activitiesByDate[selectedDate] && activitiesByDate[selectedDate].length > 0 && (
              <>
                <h3 className="text-lg font-bold text-primary">
                  กิจกรรมที่สมัครในวันที่ {selectedDate}
                </h3>
                <div className="space-y-3">
                  {activitiesByDate[selectedDate].map((activity) => (
                    <div
                      key={activity._id}
                      className="card bg-base-100 border border-primary/10 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-4">
                        <div className="flex gap-4">
                          {activity.imageUrl && (
                            <img
                              src={activity.imageUrl}
                              alt={activity.title}
                              className="w-20 h-20 object-cover rounded-lg border border-base-300"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="card-title text-sm text-primary mb-1">
                              {activity.title}
                            </h4>
                            <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                              {activity.description}
                            </p>
                            <div className="space-y-1 text-[11px] text-gray-700">
                              <p>⏰ {activity.time}</p>
                              <p>📍 {activity.location} ({activity.province})</p>
                              <p>👥 ผู้เข้าร่วม: {activity.currentVolunteers}/{activity.maxVolunteers}</p>
                            </div>
                            <div className="mt-2 flex gap-2 flex-wrap">
                              <span className={`badge text-[10px] border-none ${activity.status === "open" ? "badge-success" : "badge-error"}`}>
                                {activity.status === "open" ? "เปิดรับสมัคร" : "ปิดรับสมัคร"}
                              </span>
                              <span className="badge badge-info text-[10px] border-none">
                                {activity.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {!myLoading && myActivities.length === 0 && (
              <div className="card bg-base-100 border border-primary/10 shadow-sm">
                <div className="card-body p-4 text-center">
                  <p className="text-gray-600">คุณยังไม่ได้สมัครกิจกรรมใดๆ</p>
                  <p className="text-sm text-gray-500 mt-2">ไปที่หน้า "งานอาสา" เพื่อเลือกกิจกรรมที่สนใจ</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityCalendarPage;
