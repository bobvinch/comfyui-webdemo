// import menuUI from "./menus/ui.menu";
import menuApps from "./menus/apps.menu";
// import menuPages from "./menus/pages.menu";
// import menuCharts from "./menus/charts.menu";
// import menuUML from "./menus/uml.menu";
// import menuLanding from "./menus/landing.menu";
import menuData from "./menus/data.menu";
import menuAi from "./menus/ai.menu";

export default {
  menu: [
    {
      text: "",
      key: "",
      items: [
        // {
        //   key: "menu.home",
        //   text: "Home",
        //   link: "/dashboard",
        //   icon: "mdi-home-circle-outline",
        // },
      ],
    },
    {
      text: "我的应用",
      items: menuAi,
    },
    {
      text: "行业应用",
      items: menuApps,
    },
    {
      text: "我的资源",
      items: menuData,
    // },
    // {
    //   text: "Landing",
    //   items: [
    //     ...menuLanding,
        // {
        //   icon: "mdi-airplane-landing",
        //   key: "menu.landingPage",
        //   text: "Landing Page",
        //   link: "/landing",
        // },
    //   ],
    // },

    // {
    //   text: "UI - Theme Preview",
    //   items: menuUI,
    // },
    // {
    //   text: "Pages",
    //   key: "menu.pages",
    //   items: menuPages,
    // },
    // {
    //   text: "Charts",
    //   key: "menu.charts",
    //   items: menuCharts,
    // },
    // {
    //   text: "UML",
    //   // key: "menu.uml",
    //   items: menuUML,
    },
  ],
};
