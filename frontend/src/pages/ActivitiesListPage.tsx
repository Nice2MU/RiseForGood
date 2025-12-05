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
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div>
          <h1 className="text-4xl font-extrabold text-primary mb-2">
            🎯 ค้นหางานอาสา
          </h1>
          <p className="text-gray-600">
            ค้นหาและเลือกกิจกรรมที่คุณสนใจเพื่อร่วมพัฒนาชุมชนและสังคม
          </p>
        </div>

        {/* Search Bar */}
        <div className="form-control w-full">
          <input
            className="input input-bordered input-lg border-primary/30 focus:border-primary"
            placeholder="🔍 ค้นหาจากชื่อกิจกรรม หรือหมวดหมู่..."
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
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {!loading && (
        <>
          {/* Results Info */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <p className="text-sm text-primary font-semibold">
              ✨ พบ {filtered.length} กิจกรรม {search && `(ค้นหา: "${search}")`}
            </p>
          </div>

          {/* Activities Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((a) => (
              <ActivityCard
                key={a._id}
                activity={a}
                onSelect={() => setSelected(a)}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="card bg-base-100 border border-primary/10 shadow-sm">
              <div className="card-body text-center py-16">
                <p className="text-gray-500 text-lg">
                  ไม่พบกิจกรรมที่ตรงกับคำค้นหา
                </p>
                <button
                  className="btn btn-sm btn-ghost mt-2"
                  onClick={() => setSearch("")}
                >
                  ล้างคำค้นหา
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card bg-base-100 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="card-body p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="card-title text-2xl text-primary">
                  {selected.title}
                </h2>
                <button
                  className="btn btn-sm btn-circle btn-ghost"
                  onClick={() => setSelected(null)}
                >
                  ✕
                </button>
              </div>

              {selected.imageUrl && (
                <img
                  src={selected.imageUrl}
                  alt={selected.title}
                  className="w-full h-64 object-cover rounded-xl border border-base-300 mb-4"
                />
              )}

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="stat bg-base-100 border border-base-300 rounded-lg p-4">
                    <div className="stat-title">ผู้จัดกิจกรรม</div>
                    <div className="stat-value text-lg text-primary">{selected.organization}</div>
                  </div>
                  <div className="stat bg-base-100 border border-base-300 rounded-lg p-4">
                    <div className="stat-title">หมวดหมู่</div>
                    <div className="stat-value text-lg text-primary capitalize">{selected.category}</div>
                  </div>
                </div>

                <div className="divider"></div>

                <div>
                  <h3 className="font-semibold mb-2">📝 รายละเอียด</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selected.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">📅 วันที่และเวลา</p>
                    <p className="text-base text-primary font-semibold">
                      {selected.date} • {selected.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">📍 สถานที่</p>
                    <p className="text-base text-primary font-semibold">
                      {selected.location} ({selected.province})
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="stat bg-success/10 border border-success/30 rounded-lg p-4">
                    <div className="stat-title">ผู้เข้าร่วม</div>
                    <div className="stat-value text-lg text-success">
                      {selected.currentVolunteers}/{selected.maxVolunteers}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">สถานะ</p>
                    <span
                      className={`badge badge-lg ${
                        selected.status === "open"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {selected.status === "open"
                        ? "✓ เปิดรับสมัคร"
                        : "✕ ปิดรับสมัคร"}
                    </span>
                  </div>
                </div>

                <div className="divider"></div>

                <div className="flex gap-2">
                  <Link
                    to={`/activities/${selected._id}`}
                    className="btn btn-primary flex-1"
                  >
                    ดูรายละเอียดเต็ม
                  </Link>
                  <button
                    className="btn btn-ghost flex-1"
                    onClick={() => setSelected(null)}
                  >
                    ปิด
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesListPage;
