import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { registerUser } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await dispatch(registerUser({ name, email, password }));
    if (registerUser.fulfilled.match(res)) {
      navigate("/");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="card bg-base-100 shadow-md border border-primary/20">
        <div className="card-body space-y-3">
          <h1 className="card-title text-primary">สมัครสมาชิก</h1>
          {error && (
            <div className="alert alert-error py-2 text-xs">
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-3 text-sm">
            <div>
              <label className="label">
                <span className="label-text">ชื่อ</span>
              </label>
              <input
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">อีเมล</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">รหัสผ่าน</span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full mt-2"
              disabled={loading}
            >
              {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
            </button>
          </form>
          <p className="text-xs text-gray-600">
            มีบัญชีอยู่แล้ว?{" "}
            <Link to="/login" className="link link-primary">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
