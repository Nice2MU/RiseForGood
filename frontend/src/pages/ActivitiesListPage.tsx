import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchActivities } from "../features/activities/activitiesSlice";
import ActivityCard from "../components/ActivityCard";
import { Activity } from "../types/Activity";
import { Link } from "react-router-dom";

const ActivitiesListPage = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s) => s.activities);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Activity | null>(null);

  useEffect(() => {
    dispatch(fetchActivities());
  }, [dispatch]);

  const filtered = items.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-[2fr,1.3fr] gap-6">
      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">รายการงานอาสา</h1>
            <p className="text-xs text-gray-600 mt-1">
              ค้นหาและเลือกกิจกรรมที่คุณสนใจเพื่อร่วมพัฒนาชุมชนและสังคม
            </p>
          </div>
          <div className="form-control w-full md:w-64">
            <input
              className="input input-bordered input-sm"
              placeholder="ค้นหาจากชื่อกิจกรรม..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg" />
          </div>
        )}

        {error && (
          <div className="alert alert-error max-w-xl mx-auto mb-4">
            <span>{error}</span>
          </div>
        )}

        {!loading && (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((a) => (
              <ActivityCard
                key={a._id}
                activity={a}
                onSelect={() => setSelected(a)}
              />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="mt-8 text-center text-gray-500 text-sm">
            ไม่พบกิจกรรมที่ตรงกับคำค้นหา
          </div>
        )}
      </div>

      <div className="card bg-base-100 border border-primary/20 shadow-sm h-fit">
        <div className="card-body p-4">
          <h2 className="card-title text-sm mb-2 text-primary">
            รายละเอียดกิจกรรม
          </h2>
          {!selected && (
            <p className="text-xs text-gray-500">
              คลิกเลือกกิจกรรมจากด้านซ้ายเพื่อดูรายละเอียด
              หรือ{" "}
              <Link to="/activities" className="link link-primary">
                ไปยังหน้ากิจกรรม
              </Link>
            </p>
          )}
          {selected && (
            <div className="space-y-2 text-sm">
              {selected.imageUrl && (
                <img
                  src={selected.imageUrl}
                  alt={selected.title}
                  className="w-full max-h-60 object-cover rounded-xl border border-base-300 mb-2"
                />
              )}
              <h3 className="text-lg font-semibold text-primary">
                {selected.title}
              </h3>
              <p className="text-xs text-gray-600">
                ผู้จัด: {selected.organization}
              </p>
              <p className="text-xs text-gray-600">
                สถานที่: {selected.location} ({selected.province})
              </p>
              <p className="text-xs text-gray-600">
                วันเวลา: {selected.date} • {selected.time}
              </p>
              <p className="text-xs text-gray-600">
                อาสา: {selected.currentVolunteers}/{selected.maxVolunteers} คน
              </p>
              <p className="text-sm mt-2 whitespace-pre-line">
                {selected.description}
              </p>
              <Link
                to={`/activities/${selected._id}`}
                className="btn btn-sm btn-primary mt-2"
              >
                เปิดหน้ารายละเอียด
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivitiesListPage;
