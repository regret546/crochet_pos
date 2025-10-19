import React, { useState } from "react";
import { motion } from "motion/react";
import Home from "./Home";
import Sales from "./Sales";
import Category from "./Category";

export default function Dashboard() {
  const [selected, setSelected] = useState("Home");
  return (
    <motion.div layout className="flex bg-sky-200 z-20">
      <div>
        {" "}
        <Sidebar selected={selected} setSelected={setSelected} />
        <ExampleContent />
      </div>

      {selected === "Home" && <Home />}
      {selected === "Sales" && <Sales />}
      {selected === "Category" && <Category />}
    </motion.div>
  );
}

const Sidebar = ({ selected, setSelected }) => {
  const [open, setOpen] = useState(true);

  return (
    <motion.nav
      layout
      className="sticky top-0 h-screen shrink-0 bg-sky-200 "
      style={{ width: open ? "225px" : "fit-content" }}
    >
      <TitleSection open={open} />

      <div
        className="space-y-1 grid"
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

        <Option
          Icon={<i className="fa-solid fa-right-from-bracket"></i>}
          title="Logout"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  );
};

const Option = ({ Icon, title, selected, setSelected, open }) => (
  <motion.button
    layout
    onClick={() => setSelected(title)}
    className={`relative flex h-10 w-full items-center rounded-md cursor-pointer transition-colors ${
      selected === title
        ? "bg-white text-black"
        : "text-white hover:bg-white hover:text-black"
    }`}
  >
    <motion.div layout className="p-4">
      {Icon}
    </motion.div>
    {open && (
      <motion.span
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.125 }}
        className="text-md font-medium"
      >
        {title}
      </motion.span>
    )}
  </motion.button>
);
const TitleSection = ({ open }) => {
  return (
    <div>
      <div
        className={`mb-3 border-b border-slate-300 p-4 ${
          open ? "pl-2" : "grid place-items-center"
        }`}
      >
        <div className="flex cursor-pointer items-center justify-between rounded-md trasition-colors hover:bg-slate-800">
          <div className="flex item-center gap-2">
            <Logo />
            {open && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.125 }}
                className="grid place-items-center"
              >
                <span className="text-[1rem] text-white">POS</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ToggleClose = ({ open, setOpen }) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv) => !pv)}
      className=" absolute bottom-0 left-0 right-0 border-t border-white transition-colors cursor-pointer"
    >
      <div className="flex items-center p-2">
        <motion.div
          layout
          className="grid size-10 place-content-center text-lg"
        >
          <div className="flex">
            <i
              className={`fa-solid fa-arrow-right transition-transform text-white  ${
                open && "rotate-180"
              }`}
            ></i>
            {open && (
              <motion.span
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.125 }}
                className="text-xs font-medium text-white "
              >
                Hide
              </motion.span>
            )}
          </div>
        </motion.div>
      </div>
    </motion.button>
  );
};

const Logo = () => {
  return (
    <motion.div
      layout
      className="logo grid size-10 shrink-0 place-content-center rounded sm"
    >
      <svg
        fill="#ffffff"
        height="auto"
        width="24"
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

const ExampleContent = () => <div className="h-[200vh] w-full"></div>;
