/* eslint-disable @typescript-eslint/no-explicit-any */
import { menus } from "@/constants";
import { useParams, useSearchParams } from "react-router-dom";
import NotFoundPage from "./404-page";
import CommonFilter from "./common-filter";

//TODO: Replace all unknown/any types with their corresponding types/interfaces
const ElNinoAnalytics = () => {
  const { topic } = useParams();
  const subject: any = menus.find(
    (menu) => menu.id === parseInt(topic as string)
  );
  if (!subject) return <NotFoundPage />;

  return (
    <>
      <div className="flex flex-col text-center items-center justify-center gap-3 mb-7">
        <h1 className="text-3xl">{subject.category}</h1>
        {/* <h1 className="text-2xl">{subject.title}</h1> */}
      </div>

      <div className="my-10 border rounded-lg">
        <CommonFilter />
      </div>
    </>
  );
};

export default ElNinoAnalytics;
