import React, { useState, useEffect, lazy, Suspense, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import ResetPasswordModal from "../components/ResetPasswordModal";
import logoImage from "../assets/logo.png";

// Lazy load pages for code splitting
const Home = lazy(() => import("./Home"));
const Sales = lazy(() => import("./Sales"));
const Category = lazy(() => import("./Category"));

export default function Dashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");

    if (!userInfo) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const [selected, setSelected] = useState("Home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-rose-400 to-lavender-400 text-white rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
      >
        <i className={`fa-solid ${mobileMenuOpen ? "fa-x" : "fa-bars"} text-lg`}></i>
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar
        selected={selected}
        setSelected={setSelected}
        handleLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        setResetPasswordOpen={setResetPasswordOpen}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={resetPasswordOpen}
        onClose={() => setResetPasswordOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 md:ml-0 min-h-screen overflow-x-hidden">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <i className="fa-solid fa-spinner fa-spin text-4xl text-rose-400 mb-4"></i>
              <p className="text-slate-600">Loading...</p>
            </div>
          </div>
        }>
          <AnimatePresence mode="wait">
            {selected === "Home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Home setSelected={setSelected} />
              </motion.div>
            )}
            {selected === "Sales" && (
              <motion.div
                key="sales"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Sales />
              </motion.div>
            )}
            {selected === "Category" && (
              <motion.div
                key="category"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Category />
              </motion.div>
            )}
          </AnimatePresence>
        </Suspense>
      </main>
    </div>
  );
}

const Sidebar = memo(({ selected, setSelected, handleLogout, mobileMenuOpen, setMobileMenuOpen, setResetPasswordOpen }) => {
  const [open, setOpen] = useState(true);

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.nav
        className="hidden md:flex sticky top-0 h-screen shrink-0 bg-gradient-to-b from-lavender-300 via-rose-300 to-lavender-300 shadow-xl transition-all duration-300"
        style={{ width: open ? "250px" : "80px" }}
      >
        <div className="flex flex-col h-full w-full">
          <TitleSection open={open} />

          <motion.div
            className="flex flex-col space-y-2 px-3 flex-1 py-4"
            style={{ justifyContent: open ? "" : "center" }}
          >
            <Option
              Icon={<i className="fa-solid fa-house"></i>}
              title="Home"
              selected={selected}
              setSelected={setSelected}
              open={open}
            />

            <Option
              Icon={<i className="fa-solid fa-dollar-sign"></i>}
              title="Sales"
              selected={selected}
              setSelected={setSelected}
              open={open}
            />

            <Option
              Icon={<i className="fa-solid fa-table"></i>}
              title="Category"
              selected={selected}
              setSelected={setSelected}
              open={open}
            />

            <div className="mt-auto mb-4 space-y-2">
              <Option
                Icon={<i className="fa-solid fa-key"></i>}
                title="Reset Password"
                selected={selected}
                setSelected={setSelected}
                open={open}
                handleResetPassword={() => setResetPasswordOpen(true)}
              />
              <Option
                Icon={<i className="fa-solid fa-right-from-bracket"></i>}
                title="Logout"
                selected={selected}
                setSelected={setSelected}
                open={open}
                handleLogout={handleLogout}
              />
            </div>
          </motion.div>

          <ToggleClose open={open} setOpen={setOpen} />
        </div>
      </motion.nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="md:hidden fixed left-0 top-0 h-full w-[280px] max-w-[85vw] bg-gradient-to-b from-lavender-300 via-rose-300 to-lavender-300 shadow-2xl z-50 overflow-y-auto"
          >
            <div className="flex flex-col h-full w-full">
              <div className="flex items-center justify-between p-4 border-b border-white/20">
                <TitleSection open={true} />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                >
                  <i className="fa-solid fa-x"></i>
                </button>
              </div>

              <div className="flex flex-col space-y-2 px-3 flex-1 py-4">
                <Option
                  Icon={<i className="fa-solid fa-house"></i>}
                  title="Home"
                  selected={selected}
                  setSelected={(title) => {
                    setSelected(title);
                    setMobileMenuOpen(false);
                  }}
                  open={true}
                />

                <Option
                  Icon={<i className="fa-solid fa-dollar-sign"></i>}
                  title="Sales"
                  selected={selected}
                  setSelected={(title) => {
                    setSelected(title);
                    setMobileMenuOpen(false);
                  }}
                  open={true}
                />

                <Option
                  Icon={<i className="fa-solid fa-table"></i>}
                  title="Category"
                  selected={selected}
                  setSelected={(title) => {
                    setSelected(title);
                    setMobileMenuOpen(false);
                  }}
                  open={true}
                />

                <div className="mt-auto space-y-2">
                  <Option
                    Icon={<i className="fa-solid fa-key"></i>}
                    title="Reset Password"
                    selected={selected}
                    setSelected={setSelected}
                    open={true}
                    handleResetPassword={() => {
                      setResetPasswordOpen(true);
                      setMobileMenuOpen(false);
                    }}
                  />
                  <Option
                    Icon={<i className="fa-solid fa-right-from-bracket"></i>}
                    title="Logout"
                    selected={selected}
                    setSelected={setSelected}
                    open={true}
                    handleLogout={handleLogout}
                  />
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
});

const Option = memo(({ Icon, title, selected, setSelected, open, handleLogout, handleResetPassword }) => {
  const handleClick = () => {
    if (title === "Logout") {
      handleLogout?.();
    } else if (title === "Reset Password") {
      handleResetPassword?.();
    } else {
      setSelected(title);
    }
  };

  const isSelected = selected === title && title !== "Reset Password" && title !== "Logout";

  return (
    <motion.button
      onClick={handleClick}
      className={`relative flex h-12 w-full items-center rounded-xl cursor-pointer transition-all duration-200 ${
        isSelected
          ? "bg-white text-rose-500 shadow-lg scale-[1.02]"
          : "text-white hover:bg-white/20 hover:scale-[1.01]"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-4 text-lg">
        {Icon}
      </div>
      {open && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm font-semibold"
        >
          {title}
        </motion.span>
      )}
    </motion.button>
  );
});
const TitleSection = memo(({ open }) => {
  return (
    <div className="border-b border-white/20 p-4">
      <div className={`flex items-center gap-3 ${open ? "" : "justify-center"}`}>
        <Logo />
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col"
          >
            <span className="text-xl font-bold text-white">Crochet POS</span>
            <span className="text-xs text-white/70">Point of Sale</span>
          </motion.div>
        )}
      </div>
    </div>
  );
});

const ToggleClose = memo(({ open, setOpen }) => {
  return (
    <motion.button
      onClick={() => setOpen((pv) => !pv)}
      className="border-t border-white/20 transition-colors cursor-pointer hover:bg-white/10 p-3"
    >
      <div className="flex items-center justify-center gap-2">
        <div className="grid size-8 place-content-center">
          <i
            className={`fa-solid fa-arrow-left transition-transform text-white text-sm ${
              open && "rotate-180"
            }`}
          ></i>
        </div>
        {open && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs font-medium text-white"
          >
            Collapse
          </motion.span>
        )}
      </div>
    </motion.button>
  );
});

const Logo = memo(() => {
  return (
    <div className="logo grid size-12 shrink-0 place-content-center rounded-xl bg-white/20 backdrop-blur-sm p-2">
      <img 
        src={logoImage} 
        alt="Crochet POS Logo" 
        className="w-7 h-7 object-contain"
        loading="eager"
      />
    </div>
  );
});
