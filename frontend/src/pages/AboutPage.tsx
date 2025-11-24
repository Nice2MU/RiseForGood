const AboutPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
      <h1 className="text-3xl font-bold text-primary mb-2">เกี่ยวกับ RiseForGood</h1>
      <p className="text-sm text-gray-700">
        RiseForGood เป็นเว็บแอปพลิเคชันตัวอย่างที่พัฒนาด้วยเทคโนโลยี Node.js, Express,
        MongoDB, React, TypeScript และ Redux Toolkit
        โดยมีแนวคิดในการช่วยเชื่อมต่อคนในชุมชนให้สามารถหางานอาสา
        และประกาศจัดกิจกรรมเพื่อสังคมได้ง่ายขึ้น
      </p>
      <p className="text-sm text-gray-700">
        ผู้ใช้ทั่วไปสามารถสมัครสมาชิก เข้าสู่ระบบ สร้างกิจกรรมของตนเอง
        สมัครเข้าร่วมกิจกรรมของผู้อื่น และพูดคุยกันผ่านระบบแชทในหน้ากิจกรรมของฉันได้
        ทั้งหมดนี้ออกแบบให้ใช้งานง่าย รองรับทั้งบนคอมพิวเตอร์และมือถือ
      </p>
    </div>
  );
};

export default AboutPage;
