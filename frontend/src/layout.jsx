import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Layout = ({ active, title, subtitle, children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active={active} />

      <main className="flex-1 p-8 overflow-y-auto">
        <Navbar title={title} subtitle={subtitle} />
        {children}
        <Footer />
      </main>
    </div>
  );
};

export default Layout;