import { useState, useEffect } from "react";
import { Activity, Category, Status } from "../types/Activity";
import api from "../api/axiosClient";

interface Props {
  initial?: Activity | null;
  onSave: (data: Partial<Activity>) => void;
}

const categories: Category[] = ["environment", "education", "health", "community", "others"];
const statuses: Status[] = ["open", "closed"];

const defaultActivity: Activity = {
  title: "",
  description: "",
  category: "environment",
  organization: "",
  location: "",
  province: "",
  date: "",
  time: "",
  maxVolunteers: 20,
  currentVolunteers: 0,
  status: "open",
  tags: [],
  imageUrl: ""
};

const ActivityForm = ({ initial, onSave }: Props) => {
  const [form, setForm] = useState<Activity>(defaultActivity);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  useEffect(() => {
    if (initial) {
      setForm({ ...defaultActivity, ...initial });
      if (initial.time) {
        const parts = initial.time.split("-");
        setStartTime(parts[0]?.trim() || "");
        setEndTime(parts[1]?.trim() || "");
      } else {
        setStartTime("");
        setEndTime("");
      }
    } else {
      setForm(defaultActivity);
      setStartTime("");
      setEndTime("");
    }
  }, [initial]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "maxVolunteers" || name === "currentVolunteers") {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post<{ url: string }>("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setForm((prev) => ({ ...prev, imageUrl: res.data.url }));
    } catch (err) {
      console.error("Upload image failed", err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const time =
      startTime && endTime
        ? `${startTime}-${endTime}`
        : startTime || endTime || form.time;
    onSave({ ...form, time });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-sm">
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="label">
            <span className="label-text">ชื่อกิจกรรม</span>
          </label>
          <input
            name="title"
            className="input input-bordered w-full"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">ผู้จัดกิจกรรม</span>
          </label>
          <input
            name="organization"
            className="input input-bordered w-full"
            value={form.organization}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">รูปกิจกรรม</span>
          </label>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered file-input-sm w-full"
            onChange={handleImageUpload}
          />
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="preview"
              className="mt-2 w-full max-h-32 object-cover rounded-md border border-base-300"
            />
          )}
        </div>
        <div>
          <label className="label">
            <span className="label-text">หมวดหมู่</span>
          </label>
          <select
            name="category"
            className="select select-bordered w-full"
            value={form.category}
            onChange={handleChange}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">
            <span className="label-text">สถานะ</span>
          </label>
          <select
            name="status"
            className="select select-bordered w-full"
            value={form.status}
            onChange={handleChange}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">
            <span className="label-text">สถานที่</span>
          </label>
          <input
            name="location"
            className="input input-bordered w-full"
            value={form.location}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">จังหวัด</span>
          </label>
          <input
            name="province"
            className="input input-bordered w-full"
            value={form.province}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">วันที่</span>
          </label>
          <input
            type="date"
            name="date"
            className="input input-bordered w-full"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">เวลาเริ่มงาน</span>
          </label>
          <input
            type="time"
            className="input input-bordered w-full"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">เวลาจบงาน</span>
          </label>
          <input
            type="time"
            className="input input-bordered w-full"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">จำนวนอาสาสูงสุด</span>
          </label>
          <input
            type="number"
            name="maxVolunteers"
            className="input input-bordered w-full"
            value={form.maxVolunteers}
            onChange={handleChange}
            min={1}
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">จำนวนอาสาปัจจุบัน</span>
          </label>
          <input
            type="number"
            name="currentVolunteers"
            className="input input-bordered w-full"
            value={form.currentVolunteers}
            onChange={handleChange}
            min={0}
          />
        </div>
      </div>
      <div>
        <label className="label">
          <span className="label-text">รายละเอียดกิจกรรม</span>
        </label>
        <textarea
          name="description"
          className="textarea textarea-bordered w-full"
          rows={4}
          value={form.description}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        บันทึกกิจกรรม
      </button>
    </form>
  );
};

export default ActivityForm;
