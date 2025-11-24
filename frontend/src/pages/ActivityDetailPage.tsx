import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchActivityById,
  enrollInActivity,
  fetchMyActivities
} from "../features/activities/activitiesSlice";

const ActivityDetailPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const {
    selectedActivity: activity,
    loading,
    error,
    myActivities,
    enrolling,
    enrollError
  } = useAppSelector((s) => s.activities);
  const { user, token } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchActivityById(id));
      if (token) {
        dispatch(fetchMyActivities());
      }
    }
  }, [dispatch, id, token]);

  const isEnrolled =
    !!activity && myActivities.some((a) => a._id === activity._id);

  const handleEnroll = () => {
    if (!id || !token) return;
    dispatch(enrollInActivity(id));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error max-w-xl mx-auto mt-8">
        <span>{error}</span>
      </div>
    );
  }

  if (!activity) {
    return <div className="max-w-3xl mx-auto px-4 py-6">ไม่พบข้อมูลกิจกรรม</div>;
  }

  const statusText =
    activity.status === "open"
      ? "เปิดรับสมัคร"
      : "ปิดรับสมัคร (ยังสามารถติดต่อผู้จัดได้)";

  const statusClass =
    activity.status === "open" ? "badge-success" : "badge-error";

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <div className="card bg-base-100 border border-primary/20 shadow-sm overflow-hidden">
        {activity.imageUrl && (
          <figure className="max-h-80 overflow-hidden">
            <img
              src={activity.imageUrl}
              alt={activity.title}
              className="w-full h-full object-cover"
            />
          </figure>
        )}
        <div className="card-body p-5 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-1">
                {activity.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                <span className={`badge ${statusClass}`}>{statusText}</span>
                <span className="badge badge-outline">{activity.category}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 text-sm">
              <div>
                <p className="font-semibold">สมัครเข้าร่วม</p>
                <p className="text-xs text-gray-600">
                  อาสา {activity.currentVolunteers}/{activity.maxVolunteers} คน
                </p>
              </div>
              {!user && (
                <Link to="/login" className="btn btn-sm btn-primary">
                  เข้าสู่ระบบเพื่อสมัคร
                </Link>
              )}
              {user && !isEnrolled && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? "กำลังสมัคร..." : "สมัครเข้าร่วมกิจกรรมนี้"}
                </button>
              )}
              {user && isEnrolled && (
                <div className="flex flex-col items-end gap-1 text-xs">
                  <span className="text-green-700 font-semibold">
                    คุณสมัครกิจกรรมนี้แล้ว
                  </span>
                  <Link to="/my-activities" className="link link-primary">
                    ไปที่หน้ากิจกรรมของฉันเพื่อพูดคุยกับผู้จัด
                  </Link>
                </div>
              )}
              {enrollError && (
                <span className="text-[11px] text-red-500">{enrollError}</span>
              )}
            </div>
          </div>
          <p className="text-sm whitespace-pre-line mt-2">
            {activity.description}
          </p>
          <div className="divider my-3" />
          <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-700">
            <p>
              <span className="font-semibold">ผู้จัดกิจกรรม:</span>{" "}
              {activity.organization}
            </p>
            <p>
              <span className="font-semibold">วันเวลา:</span> {activity.date} •{" "}
              {activity.time}
            </p>
            <p>
              <span className="font-semibold">สถานที่:</span>{" "}
              {activity.location} ({activity.province})
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            * ต้องสมัครเข้าร่วมก่อนจึงจะสามารถสนทนากับผู้จัดในหน้ากิจกรรมของฉันได้
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailPage;
