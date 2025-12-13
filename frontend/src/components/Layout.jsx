import Sidebar from '../components/Sidebar';
import MainHeader from '../components/MainHeader';

function Layout({ children }) {
  return (
    <div className="flex h-screen bg-white dark:bg-dark-900 transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <MainHeader />
        <main className="flex-1 overflow-hidden px-8 py-6">
            {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
