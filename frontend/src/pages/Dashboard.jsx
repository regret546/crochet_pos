import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import Home from "./Home";
import Sales from "./Sales";
import Category from "./Category";

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

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-rose-400 to-lavender-400 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
      >
        <i className={`fa-solid ${mobileMenuOpen ? "fa-x" : "fa-bars"}`}></i>
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
      />

      {/* Main Content */}
      <main className="flex-1 md:ml-0 min-h-screen">
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
      </main>
    </div>
  );
}

const Sidebar = ({ selected, setSelected, handleLogout, mobileMenuOpen, setMobileMenuOpen }) => {
  const [open, setOpen] = useState(true);

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.nav
        layout
        className="hidden md:flex sticky top-0 h-screen shrink-0 bg-gradient-to-b from-lavender-300 via-rose-300 to-lavender-300 shadow-xl"
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

            <div className="mt-auto mb-4">
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
            className="md:hidden fixed left-0 top-0 h-full w-[280px] bg-gradient-to-b from-lavender-300 via-rose-300 to-lavender-300 shadow-2xl z-50"
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

                <div className="mt-auto">
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
};

const Option = ({ Icon, title, selected, setSelected, open, handleLogout }) => {
  const handleClick = () => {
    if (title === "Logout") {
      handleLogout();
    } else {
      setSelected(title);
    }
  };

  const isSelected = selected === title;

  return (
    <motion.button
      layout
      onClick={handleClick}
      className={`relative flex h-12 w-full items-center rounded-xl cursor-pointer transition-all duration-200 ${
        isSelected
          ? "bg-white text-rose-500 shadow-lg scale-[1.02]"
          : "text-white hover:bg-white/20 hover:scale-[1.01]"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div layout className="p-4 text-lg">
        {Icon}
      </motion.div>
      {open && (
        <motion.span
          layout
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
};
const TitleSection = ({ open }) => {
  return (
    <div className="border-b border-white/20 p-4">
      <div className={`flex items-center gap-3 ${open ? "" : "justify-center"}`}>
        <Logo />
        {open && (
          <motion.div
            layout
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
};

const ToggleClose = ({ open, setOpen }) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv) => !pv)}
      className="border-t border-white/20 transition-colors cursor-pointer hover:bg-white/10 p-3"
    >
      <div className="flex items-center justify-center gap-2">
        <motion.div
          layout
          className="grid size-8 place-content-center"
        >
          <i
            className={`fa-solid fa-arrow-left transition-transform text-white text-sm ${
              open && "rotate-180"
            }`}
          ></i>
        </motion.div>
        {open && (
          <motion.span
            layout
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
};

const Logo = () => {
  return (
    <motion.div
      layout
      className="logo grid size-12 shrink-0 place-content-center rounded-xl bg-white/20 backdrop-blur-sm p-2"
    >
      <svg
        fill="#ffffff"
        height="auto"
        width="28"
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 512.535 512.535"
        xmlSpace="preserve"
      >
        <g transform="translate(1 1)">
          <g>
            <g>
              <path
                d="M255,357.667c98.987,0,179.2-80.213,179.2-179.2S353.987-0.733,255-0.733S75.8,79.481,75.8,178.467
				S156.013,357.667,255,357.667z M115.215,260.683l88.105,31.461l-39.544,20.401C144.011,299.078,127.389,281.351,115.215,260.683z
				 M92.867,178.467c0-5.499,0.277-10.932,0.81-16.289l239.595,62.921l-45.371,23.408l-194.932-64.56
				C92.908,182.127,92.867,180.302,92.867,178.467z M154.158,113.923l148.039-90.367l-0.183-0.3
				c12.614,3.811,24.576,9.116,35.683,15.71l-133.918,86.71L154.158,113.923z M401.298,190.003l-46.076,23.772l0.137-0.52
				L96.28,145.216c1.84-8.84,4.398-17.414,7.612-25.661L401.298,190.003z M405.587,238.694l-192.738,96.369
				c-11.108-2.979-21.747-7.096-31.775-12.238l234.37-120.917C413.591,214.718,410.247,227.041,405.587,238.694z M331.98,156.044
				l-35.035-8.299l93.842-57.933c5.336,8.16,9.961,16.828,13.776,25.922L331.98,156.044z M410.381,132.024
				c4.18,14.024,6.514,28.844,6.724,44.184l-60.484-14.327L410.381,132.024z M266.678,259.456l-42.599,21.978L104.543,238.75
				l-0.05,0.139c-4.632-11.539-7.977-23.734-9.856-36.411L266.678,259.456z M255,340.601c-4.675,0-9.299-0.209-13.873-0.596
				l151.489-75.744C363.986,310.113,313.084,340.601,255,340.601z M380.678,75.996l-107.213,66.188l-46.696-11.061l126.315-81.787
				C363.302,57.105,372.568,66.058,380.678,75.996z M255,16.334c7.981,0,15.822,0.586,23.493,1.698l-147.932,90.302l-19.486-4.616
				C138.084,51.78,192.368,16.334,255,16.334z"
              />
              <path
                d="M505.88,494.201l-224.16-77.969l120.159-41.794c10.702,15.696,28.726,25.897,49.388,25.897
				c33.28,0,59.733-26.453,59.733-59.733c0-33.28-26.453-59.733-59.733-59.733c-33.28,0-59.733,26.453-59.733,59.733
				c0,6.357,0.972,12.461,2.765,18.183l-138.872,48.303l-139.636-48.569c1.74-5.644,2.676-11.659,2.676-17.917
				c0-33.28-26.453-59.733-59.733-59.733C25.453,280.867-1,307.321-1,340.601c0,33.28,26.453,59.733,59.733,59.733
				c20.767,0,38.875-10.302,49.556-26.135l120.844,42.033L4.973,494.201c-4.267,1.707-6.827,6.827-5.12,11.093
				c0.853,3.413,4.267,5.973,7.68,5.973c0.853,0,1.707,0,3.413-0.853l244.48-85.036l244.48,85.037
				c0.853,0.853,1.707,0.853,2.56,0.853c3.413,0,6.827-2.56,8.533-5.973C512.707,501.027,510.147,495.907,505.88,494.201z
				 M451.267,297.934c23.893,0,42.667,18.773,42.667,42.667c0,23.893-18.773,42.667-42.667,42.667
				c-23.893,0-42.667-18.773-42.667-42.667C408.6,316.707,427.373,297.934,451.267,297.934z M58.733,383.267
				c-23.893,0-42.667-18.773-42.667-42.667c0-23.893,18.773-42.667,42.667-42.667s42.667,18.773,42.667,42.667
				C101.4,364.494,82.627,383.267,58.733,383.267z"
              />
              <path
                d="M67.267,315.001c-18.773,0-34.133,15.36-34.133,34.133c0,5.12,3.413,8.533,8.533,8.533s8.533-3.413,8.533-8.533
				c0-9.387,7.68-17.067,17.067-17.067c5.12,0,8.533-3.413,8.533-8.533S72.387,315.001,67.267,315.001z"
              />
              <path
                d="M434.2,357.667c5.12,0,8.533-3.413,8.533-8.533c0-9.387,7.68-17.067,17.067-17.067c5.12,0,8.533-3.413,8.533-8.533
				s-3.413-8.533-8.533-8.533c-18.773,0-34.133,15.36-34.133,34.133C425.667,354.254,429.08,357.667,434.2,357.667z"
              />
            </g>
          </g>
        </g>
      </svg>
    </motion.div>
  );
};
