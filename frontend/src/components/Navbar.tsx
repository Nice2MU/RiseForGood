import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="navbar bg-base-100 shadow-sm border-b border-primary/10">
      <div className="flex-1 gap-2">
        <Link to="/" className="btn btn-ghost normal-case text-xl text-primary">
          RiseForGood
        </Link>
        <span className="hidden sm:inline text-xs text-gray-500">
          แพลตฟอร์มรวมงานอาสาเพื่อชุมชนและสังคม
        </span>
      </div>
      <div className="flex-none gap-3 items-center">
        <ul className="menu menu-horizontal px-1 gap-1 text-sm">
          <li>
            <NavLink to="/" end>
              หน้าแรก
            </NavLink>
          </li>
          <li>
            <NavLink to="/activities">งานอาสา</NavLink>
          </li>
          {user && (
            <li>
              <NavLink to="/my-activities">กิจกรรมของฉัน</NavLink>
            </li>
          )}
          <li>
            <NavLink to="/about">เกี่ยวกับ</NavLink>
          </li>
          {user && (
            <li>
              <NavLink to="/admin/activities">จัดการกิจกรรม</NavLink>
            </li>
          )}
        </ul>
        {user ? (
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-600 text-right hidden sm:block">
              <div className="font-semibold">{user.name}</div>
              <div>{user.role === "admin" ? "ผู้ดูแลระบบ" : "สมาชิก"}</div>
            </div>
            <button className="btn btn-sm btn-outline" onClick={handleLogout}>
              ออกจากระบบ
            </button>
          </div>
        ) : (
          <div className="flex gap-1">
            <Link to="/login" className="btn btn-sm btn-ghost">
              เข้าสู่ระบบ
            </Link>
            <Link to="/register" className="btn btn-sm btn-primary">
              สมัครสมาชิก
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
