import React from "react";

const Test = () => {
  return (
    <div className=" h-screen w-screen">
      <div className="flex flex-col gap-5 h-screen w-screen">
        <div className="grid grid-cols-4 gap-5 h-3/5 w-screen">
          <div className="col-span-1 w-full h-full bg-blue-600">{""}</div>
          <div className="col-span-3 w-full h-full bg-blue-600">cc</div>
        </div>
        <div className="w-full h-4/5 bg-blue-600">dd</div>
      </div>
    </div>
  );
};

export default Test;
