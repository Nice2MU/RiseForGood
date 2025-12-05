import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { useEffect } from "react";
import { fetchActivities } from "../features/activities/activitiesSlice";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { items: activities } = useAppSelector((s) => s.activities);

  useEffect(() => {
    dispatch(fetchActivities());
  }, [dispatch]);

  const features = [
    {
      icon: "🎯",
      title: "หางานอาสาที่ใจ",
      desc: "ค้นหากิจกรรมอาสาที่สอดคล้องกับความสนใจของคุณ"
    },
    {
      icon: "👥",
      title: "เชื่อมต่อชุมชน",
      desc: "พบปะกับผู้คนที่มีจิตสำนึกเดียวกัน"
    },
    {
      icon: "⭐",
      title: "สะสมแต้มอาสา",
      desc: "ได้รับแต้ม Badge และ Level ระดับ"
    },
    {
      icon: "📅",
      title: "ปฏิทินกิจกรรม",
      desc: "ดูรายการกิจกรรมแบบปฏิทินที่ชัดเจน"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl shadow-md border border-primary/20 px-8 py-16 flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-primary mb-2">
              RiseForGood
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          </div>
          <p className="text-lg text-gray-700 max-w-xl leading-relaxed">
            แพลตฟอร์มที่เปิดโอกาสให้ทุกคนสามารถ{" "}
            <span className="font-semibold text-primary">หางานอาสา</span> หรือ{" "}
            <span className="font-semibold text-primary">ประกาศจัดกิจกรรมดี ๆ</span>
            เพื่อชุมชนและสังคมได้ในที่เดียว
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/activities" className="btn btn-primary btn-lg">
              🔍 ค้นหางานอาสา
            </Link>
            <Link
              to="/calendar"
              className="btn btn-outline border-primary text-primary btn-lg"
            >
              📅 ดูปฏิทิน
            </Link>
          </div>
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="stat bg-base-100/80 backdrop-blur shadow-lg rounded-2xl border border-primary/10 p-4">
              <div className="stat-title text-xs">กิจกรรม</div>
              <div className="stat-value text-primary text-3xl">{activities.length}+</div>
              <div className="stat-desc text-xs">งานอาสาในระบบ</div>
            </div>
            <div className="stat bg-base-100/80 backdrop-blur shadow-lg rounded-2xl border border-primary/10 p-4">
              <div className="stat-title text-xs">หมวดหมู่</div>
              <div className="stat-value text-primary text-3xl">4+</div>
              <div className="stat-desc text-xs">สนาม</div>
            </div>
            <div className="stat bg-base-100/80 backdrop-blur shadow-lg rounded-2xl border border-primary/10 p-4">
              <div className="stat-title text-xs">ระบบแต้ม</div>
              <div className="stat-value text-primary text-3xl">⭐</div>
              <div className="stat-desc text-xs">Rewards</div>
            </div>
            <div className="stat bg-base-100/80 backdrop-blur shadow-lg rounded-2xl border border-primary/10 p-4">
              <div className="stat-title text-xs">เทคโนโลยี</div>
              <div className="stat-value text-primary text-2xl">MERN</div>
              <div className="stat-desc text-xs">Full-stack</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary">
            ✨ คุณสมบัติเด่น
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ทุกสิ่งที่คุณต้องการเพื่อเริ่มต้นอาสาสมัครบรรจุ
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <div key={i} className="card bg-base-100 border border-primary/10 hover:border-primary/30 shadow-sm hover:shadow-md transition-all">
              <div className="card-body p-4 text-center">
                <div className="text-4xl mb-2">{feature.icon}</div>
                <h3 className="card-title text-sm text-primary justify-center">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-600">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activities */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary">
            🚀 กิจกรรมล่าสุด
          </h2>
          <Link to="/activities" className="link link-primary text-sm">
            ดูทั้งหมด →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activities.slice(0, 6).map((activity) => (
            <Link
              key={activity._id}
              to={`/activities/${activity._id}`}
              className="card bg-base-100 border border-primary/10 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all overflow-hidden group"
            >
              {activity.imageUrl && (
                <figure className="h-32 overflow-hidden bg-base-200 group-hover:scale-105 transition-transform">
                  <img
                    src={activity.imageUrl}
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                </figure>
              )}
              <div className="card-body p-4">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="card-title text-sm line-clamp-2 text-primary">
                    {activity.title}
                  </h3>
                  <span className={`badge badge-sm text-[10px] border-none flex-shrink-0 ${activity.status === "open" ? "badge-success" : "badge-error"}`}>
                    {activity.status === "open" ? "เปิด" : "ปิด"}
                  </span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {activity.description}
                </p>
                <div className="divider my-2"></div>
                <div className="flex justify-between items-center text-[10px] text-gray-500">
                  <span>📍 {activity.province}</span>
                  <span>👥 {activity.currentVolunteers}/{activity.maxVolunteers}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl shadow-lg px-8 py-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          พร้อมที่จะเริ่มต้นการอาสาสมัครบรรจุหรือยัง?
        </h2>
        <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
          เข้าร่วมชุมชน RiseForGood วันนี้ และเป็นส่วนหนึ่งของการเปลี่ยนแปลงเชิงบวก
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/activities" className="btn btn-light btn-lg">
            เริ่มต้นเลย
          </Link>
          <Link to="/about" className="btn btn-outline btn-lg border-white text-white hover:bg-white">
            เรียนรู้เพิ่มเติม
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
