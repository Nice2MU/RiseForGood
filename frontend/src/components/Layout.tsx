import { ReactNode } from "react";
import Navbar from "./Navbar";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="footer footer-center p-4 bg-base-100 text-xs text-gray-600 border-t border-primary/10">
        <aside>
          <p>
            RiseForGood – รวมพลังคนทำดีเพื่อชุมชนและสังคม | ตัวอย่างเว็บแอป Node.js + React
          </p>
        </aside>
      </footer>
    </div>
  );
};

export default Layout;
