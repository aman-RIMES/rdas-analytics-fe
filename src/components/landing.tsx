import { Grid } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  zeroRightClassName,
  fullWidthClassName,
  noScrollbarsClassName,
} from "react-remove-scroll-bar";

const Landing = () => {
  const navigate = useNavigate();
  const analyticsTools = [
    {
      route: "/elnino-analytics",
      name: "El Nino and Local Climate",
      image: "src/assets/elnino-analytics.png",
    },
    {
      route: "/lanina-analytics",
      name: "La Nina and Local Climate",
      image: "src/assets/lanina-analytics.png",
    },
    {
      route: "/analytics-crop",
      name: "Crop Calendar Suitability",
      image: "src/assets/calendar.png",
    },
    {
      route: "/analytics-mjo",
      name: "MJO and Local Climate",
      image: "src/assets/mjo.png",
    },

    {
      route: "/analytics-rainfall-anomaly",
      name: "Rainfall Anomaly",
      image: "src/assets/rainfall.png",
    },
    {
      route: "/analytics-land",
      name: "Land Use & Land Cover",
      image: "src/assets/land.png",
    },
  ];

  const predictiveTools = [
    {
      route: "/predictive-tools",
      name: "El Nino Impacts Prediction",
      image: "src/assets/elnino-prediction.png",
    },
    {
      route: "/lanina-predictive-tools",
      name: "La Nina Impacts Prediction",
      image: "src/assets/lanina-prediction.png",
    },
    {
      route: "/predictive-gdd-tools",
      name: "Growing Degree Days",
      image: "src/assets/gdd.png",
    },
    {
      route: "/predictive-temps",
      name: "TEMPs",
      image: "src/assets/temps.png",
    },
  ];

  return (
    <>
      <div className="h-screen w-full flex flex-col justify-between bg-[radial-gradient(circle_at_center,#bbf7d0,#fff)]">
        <div className=" flex justify-center items-center mt-14">
          <div className="flex flex-row justify-center flex-wrap  ">
            <div className="flex flex-col items-center gap-5">
              <p className="text-4xl text-green-800 font-medium">
                Analytics Tools
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 ">
                {analyticsTools.map((tool, index) => (
                  <GridItem tool={tool} />
                ))}
              </div>
            </div>
            <div className="inline-block h-[700px] min-h-[1em] w-0.5 self-stretch bg-green-500 mx-5 mt-7"></div>
            <div className="flex flex-col items-center gap-5">
              <p className="text-4xl text-green-800 font-medium">
                Predictive Tools
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 ">
                {predictiveTools.map((tool, index) => (
                  <GridItem tool={tool} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-20 mb-3">
          <div className="w-[80px] ">
            <img src="src/assets/RIMES.png" alt="" />
          </div>
          <div className="w-[150px] ">
            <img src="src/assets/WB.png" alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export const GridItem = ({ tool }) => {
  const navigate = useNavigate();
  return (
    <div
      className="p-5 px-10 bg-green-50 rounded-xl max-w-[350px] shadow-md shadow-green-700 hover:shadow-lg hover:shadow-yellow-400 m-5 flex flex-col items-center justify-center  cursor-pointer"
      onClick={() => navigate(tool.route)}
    >
      <div className="w-[80px] ">
        <img src={tool.image} alt="" />
      </div>
      <p className="text-md font-medium mt-3"> {tool.name}</p>
      <p>Lorem ipsum Lorem Ipsum Lorem </p>
    </div>
  );
};

export default Landing;
