import { Fragment, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Global states
import { useSession } from "../../globalStates/session.state";

// MUI components
import { Drawer } from "@mui/material";

// MUI icons
import HomeIcon from "@mui/icons-material/Home";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import PhoneAndroidOutlinedIcon from '@mui/icons-material/PhoneAndroidOutlined';
import PhoneEnabledOutlinedIcon from '@mui/icons-material/PhoneEnabledOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';


// Components
import { LangContext } from "../../utils/context/LangContext";


// Images
import ProfileLogo from "../../images/profile-logo.svg";


const NavMenu = () => {
  const { t } = useContext(LangContext);
  const navigate = useNavigate();
  const useLoc = useLocation();
  const [sessionState, sessionAction] = useSession();

  const handleNavigation = (to) => {
    navigate(to);
    sessionAction.setVar("open", false);
  };


  const handleLogout = () => {
    axios.post(`/api/logout.php`).then((res) => {
      if (res.data == true) {
        sessionAction.setVar("open", false);
        navigate("/login");
      }
    });
  };


  return (
    <Drawer
      anchor="left"
      open={sessionState.open}
      onClose={() => sessionAction.setVar("open", false)}
      PaperProps={{
        style: {
          height: "calc(100%)",
          top: 64,
          width: 350
        },
      }}
      slotProps={{
        backdrop: {
          style: { top: 64, height: "calc(100vh )" },
        }
      }}
      sx={{ top: 64, height: "calc(100vh - 64px)" }}
    >
      <div className="bg-valeo-blue flex flex-col h-full items-center">
        <img alt="profil-logo" className="mt-10 mb-5" src={ProfileLogo} />
        <p className="font-semibold text-[#f7f5f5] text-3xl">
          {sessionState.name}
        </p>
        <p className="font-semibold text-gray-300 text-2xl mb-10 uppercase">
          {sessionState.apu}
        </p>
        <ul className="flex flex-col gap-2 h-full p-3 w-full">
          <li>
            <button
              className={`flex gap-3 items-center px-4 py-2 rounded transition-all w-full ${useLoc.pathname == "/home" ? "bg-valeo-green drop-shadow hover:bg-valeo-green-hover text-[#494949]" : "hover:bg-valeo-blue-hover text-[#f7f5f5]"}`}
              onClick={() => handleNavigation("/home")}
            >
              <div className={`flex h-7 items-center justify-center rounded w-7 ${useLoc.pathname == "/home" ? "bg-valeo-blue" : ""}`}>
                <HomeIcon
                  sx={{
                    color: useLoc.pathname == "/home" ? "white" : "",
                    display: useLoc.pathname == "/home" ? "block" : "none"
                  }}
                />
                <HomeOutlinedIcon
                  sx={{
                    display: useLoc.pathname == "/home" ? "none" : "block"
                  }}
                />
              </div>
              <span className="font-semibold text-xl">{t("nav_menu.home")}</span>
            </button>
          </li>

                  {/* History page start */}
                  <li>
            <button
              className={`flex gap-3 items-center px-4 py-2 rounded transition-all w-full ${useLoc.pathname == "/history" ? "bg-valeo-green drop-shadow hover:bg-valeo-green-hover text-[#494949]" : "hover:bg-valeo-blue-hover text-[#f7f5f5]"}`}
              onClick={() => handleNavigation("/history")}
            >
              <div className={`flex h-7 items-center justify-center rounded w-7 ${useLoc.pathname == "/history" ? "bg-valeo-blue" : ""}`}>
                <HistoryOutlinedIcon 
                  sx={{
                    color: useLoc.pathname == "/history" ? "white" : "",
                    display: useLoc.pathname == "/history" ? "block" : "none"
                  }}
                />
                <HistoryOutlinedIcon 
                  sx={{
                    display: useLoc.pathname == "/history" ? "none" : "block"
                  }}
                />
              </div>
              <span className="font-semibold text-xl">{t("nav_menu.history")}</span>
            </button>
          </li>


                    {/* History page end  */}



        {/*  mobiles page start */}

        <li>
            <button
              className={`flex gap-3 items-center px-4 py-2 rounded transition-all w-full ${useLoc.pathname == "/mobiles" ? "bg-valeo-green drop-shadow hover:bg-valeo-green-hover text-[#494949]" : "hover:bg-valeo-blue-hover text-[#f7f5f5]"}`}
              onClick={() => handleNavigation("/mobiles")}
            >
              <div className={`flex h-7 items-center justify-center rounded w-7 ${useLoc.pathname == "/storeMobile" ? "bg-valeo-blue" : ""}`}>
                <PhoneAndroidOutlinedIcon  
                  sx={{
                    color: useLoc.pathname == "/mobiles" ? "white" : "",
                    display: useLoc.pathname == "/mobiles" ? "block" : "none"
                  }}
                />
                <PhoneAndroidOutlinedIcon  
                  sx={{
                    display: useLoc.pathname == "/mobiles" ? "none" : "block"
                  }}
                />
              </div>
              <span className="font-semibold text-xl">{t("nav_menu.mobiles")}</span>
            </button>
          </li>

        {/*  mobiles page end  */}

                {/*  laptops page start */}

                <li>
            <button
              className={`flex gap-3 items-center px-4 py-2 rounded transition-all w-full ${useLoc.pathname == "/laptops" ? "bg-valeo-green drop-shadow hover:bg-valeo-green-hover text-[#494949]" : "hover:bg-valeo-blue-hover text-[#f7f5f5]"}`}
              onClick={() => handleNavigation("/laptops")}
            >
              <div className={`flex h-7 items-center justify-center rounded w-7 ${useLoc.pathname == "/laptops" ? "bg-valeo-blue" : ""}`}>
                <LaptopMacIcon   
                  sx={{
                    color: useLoc.pathname == "/laptops" ? "white" : "",
                    display: useLoc.pathname == "/laptops" ? "block" : "none"
                  }}
                />
                <LaptopMacIcon   
                  sx={{
                    display: useLoc.pathname == "/laptops" ? "none" : "block"
                  }}
                />
              </div>
              <span className="font-semibold text-xl">{t("nav_menu.laptops")}</span>
            </button>
          </li>

        {/*  laptops page end  */}

          {/* add User page start */}

          <li>
            <button
              className={`flex gap-3 items-center px-4 py-2 rounded transition-all w-full ${useLoc.pathname == "/Adduser" ? "bg-valeo-green drop-shadow hover:bg-valeo-green-hover text-[#494949]" : "hover:bg-valeo-blue-hover text-[#f7f5f5]"}`}
              onClick={() => handleNavigation("/Adduser")}
            >
              <div className={`flex h-7 items-center justify-center rounded w-7 ${useLoc.pathname == "/Adduser" ? "bg-valeo-blue" : ""}`}>
                <PersonAddOutlinedIcon 
                  sx={{
                    color: useLoc.pathname == "/Adduser" ? "white" : "",
                    display: useLoc.pathname == "/Adduser" ? "block" : "none"
                  }}
                />
                <PersonAddOutlinedIcon 
                  sx={{
                    display: useLoc.pathname == "/Adduser" ? "none" : "block"
                  }}
                />
              </div>
              <span className="font-semibold text-xl">{t("nav_menu.Adduser")}</span>
            </button>
          </li>


          {/* add User page end  */}


  {/* dashboard page start  */}

  <li>
            <button
              className={`flex gap-3 items-center px-4 py-2 rounded transition-all w-full ${useLoc.pathname == "/dashboard" ? "bg-valeo-green drop-shadow hover:bg-valeo-green-hover text-[#494949]" : "hover:bg-valeo-blue-hover text-[#f7f5f5]"}`}
              onClick={() => handleNavigation("/dashboard")}
            >
              <div className={`flex h-7 items-center justify-center rounded w-7 ${useLoc.pathname == "/dashboard" ? "bg-valeo-blue" : ""}`}>
                <DashboardOutlinedIcon
                  sx={{
                    color: useLoc.pathname == "/dashboard" ? "white" : "",
                    display: useLoc.pathname == "/dashboard" ? "block" : "none"
                  }}
                />
                <DashboardOutlinedIcon
                  sx={{
                    display: useLoc.pathname == "/dashboard" ? "none" : "block"
                  }}
                />
              </div>
              <span className="font-semibold text-xl">{t("nav_menu.dashboard")}</span>
            </button>
  </li>

  {/* Dashboard page end  */}

          <li className="mt-auto">
            <button
              className={`flex gap-3 hover:bg-[#708A99] items-center px-4 py-2 rounded text-[#f7f5f5] transition-all w-full `}
              onClick={() => handleLogout()}
            >
              <div className={`flex h-7 items-center justify-center rounded w-7 `}>
                <ExitToAppIcon />
              </div>
              <span className="font-semibold text-xl">{t("nav_menu.log_out")}</span>
            </button>
          </li>
        </ul>
      </div>
    </Drawer>
  );
};

export default NavMenu;
