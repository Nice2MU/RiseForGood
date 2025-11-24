import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <section className="hero hero-gradient rounded-3xl shadow-md border border-primary/20 px-6 py-10 flex flex-col lg:flex-row gap-8 items-center">
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-primary drop-shadow-sm">
            RiseForGood
          </h1>
          <p className="text-sm lg:text-base text-gray-700 max-w-xl">
            แพลตฟอร์มที่เปิดโอกาสให้ทุกคนสามารถ{" "}
            <span className="font-semibold">หางานอาสา</span> หรือ{" "}
            <span className="font-semibold">ประกาศจัดกิจกรรมดี ๆ</span>
            เพื่อชุมชนและสังคมได้ในที่เดียว
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link to="/activities" className="btn btn-primary btn-md">
              ค้นหางานอาสา
            </Link>
            <Link
              to="/admin/activities"
              className="btn btn-outline border-primary text-primary btn-md"
            >
              ประกาศจัดกิจกรรม
            </Link>
          </div>
        </div>
        <div className="flex-1 max-w-md">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="stat bg-base-100 shadow rounded-2xl border border-primary/10">
              <div className="stat-title">กิจกรรม</div>
              <div className="stat-value text-primary">40+</div>
              <div className="stat-desc">งานอาสาตัวอย่างในระบบ</div>
            </div>
            <div className="stat bg-base-100 shadow rounded-2xl border border-primary/10">
              <div className="stat-title">ด้านสังคม</div>
              <div className="stat-value text-primary">4+</div>
              <div className="stat-desc">การศึกษา สิ่งแวดล้อม ชุมชน สุขภาพ</div>
            </div>
            <div className="stat bg-base-100 shadow rounded-2xl border border-primary/10">
              <div className="stat-title">เทคโนโลยี</div>
              <div className="stat-value text-primary">Full-stack</div>
              <div className="stat-desc">Node.js + React + TypeScript</div>
            </div>
            <div className="stat bg-base-100 shadow rounded-2xl border border-primary/10">
              <div className="stat-title">รูปแบบ</div>
              <div className="stat-value text-primary">Responsive</div>
              <div className="stat-desc">ใช้งานได้ทั้งบนคอมและมือถือ</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
