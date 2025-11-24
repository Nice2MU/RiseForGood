import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchHostedActivities,
  createActivity,
  updateActivity,
  deleteActivity
} from "../features/activities/activitiesSlice";
import { Activity } from "../types/Activity";
import ActivityForm from "../components/ActivityForm";

const AdminActivitiesPage = () => {
  const dispatch = useAppDispatch();
  const { hostedActivities, hostedLoading, hostedError } = useAppSelector(
    (s) => s.activities
  );
  const { user } = useAppSelector((s) => s.auth);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchHostedActivities());
    }
  }, [dispatch, user]);

  const handleSave = (data: Partial<Activity>) => {
    if (editing && editing._id) {
      dispatch(updateActivity({ id: editing._id, data }));
    } else {
      dispatch(createActivity(data));
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = (id?: string) => {
    if (!id) return;
    if (confirm("ต้องการลบกิจกรรมนี้หรือไม่?")) {
      dispatch(deleteActivity(id));
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="card bg-base-100 border border-primary/20 shadow-sm">
          <div className="card-body">
            <h1 className="card-title text-primary text-lg">
              เข้าสู่ระบบเพื่อจัดการกิจกรรมของคุณ
            </h1>
            <p className="text-sm text-gray-600">
              หน้านี้ใช้สำหรับสร้าง แก้ไข และลบกิจกรรมที่คุณเป็นคนจัด
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">จัดการกิจกรรมของฉัน</h1>
          <p className="text-xs text-gray-600 mt-1">
            เพิ่ม แก้ไข และลบกิจกรรมที่คุณเป็นผู้จัดได้ที่นี่
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          + เพิ่มกิจกรรมใหม่
        </button>
      </div>

      {hostedLoading && (
        <div className="flex justify-center items-center h-32">
          <span className="loading loading-spinner" />
        </div>
      )}

      {hostedError && (
        <div className="alert alert-error mb-4 text-xs">
          <span>{hostedError}</span>
        </div>
      )}

      {!hostedLoading && (
        <div className="overflow-x-auto mb-6">
          <table className="table table-zebra w-full text-xs">
            <thead>
              <tr>
                <th>ชื่อกิจกรรม</th>
                <th>จังหวัด</th>
                <th>วันที่</th>
                <th>สถานะ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {hostedActivities.map((a) => (
                <tr key={a._id}>
                  <td className="font-semibold">{a.title}</td>
                  <td>{a.province}</td>
                  <td>
                    {a.date} {a.time}
                  </td>
                  <td
                    className={
                      a.status === "open"
                        ? "text-green-600 font-semibold"
                        : "text-red-500 font-semibold"
                    }
                  >
                    {a.status === "open" ? "เปิด" : "ปิด"}
                  </td>
                  <td className="flex gap-2">
                    <button
                      className="btn btn-xs btn-outline"
                      onClick={() => {
                        setEditing(a);
                        setShowForm(true);
                      }}
                    >
                      แก้ไข
                    </button>
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => handleDelete(a._id)}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
              {hostedActivities.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500">
                    คุณยังไม่มีกิจกรรมที่จัด ลองกดปุ่ม “เพิ่มกิจกรรมใหม่” ด้านบน
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg shadow-lg p-4 w-full max-w-3xl border border-primary/20">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-primary">
                {editing ? "แก้ไขกิจกรรม" : "เพิ่มกิจกรรมใหม่"}
              </h2>
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
              >
                ✕
              </button>
            </div>
            <ActivityForm initial={editing || undefined} onSave={handleSave} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminActivitiesPage;
