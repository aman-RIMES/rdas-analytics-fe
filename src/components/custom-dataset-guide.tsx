import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { cn } from "@/lib/utils";

const CustomDatasetGuide = ({ title, className = "" }) => {
  return (
    <Dialog>
      <DialogTrigger className="ml-1">
        <p
          className={cn(
            "text-green-600 text-xs font-semibold text-decoration-line: underline",
            className
          )}
        >
          {title}
        </p>
      </DialogTrigger>
      <DialogContent className="lg:w-[40%]">
        <DialogHeader>
          <DialogDescription>
            <div>
              <p className="mt-5 text-base">
                Use the following template to upload your dataset. The dataset
                should consist of the year & month, the average rainfall, and
                the average temperature.
              </p>
              <br />

              <p className="text-black text-base">
                Make sure that your CSV file strictly follows the exact layout
                shown on the template to make sure the data is analyzed
                properly. You can download a sample CSV template below.
              </p>

              <div className="flex flex-col items-center justify-center m-10 mb-5 ">
                <img src={"src/assets/guide.png"} alt="" />
                <a
                  className="text-white text-lg font-semibold bg-green-800 py-1 px-5 rounded-md mt-10"
                  href={"src/data/rdas_monthly_template.csv"}
                  download
                >
                  Download Template
                </a>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDatasetGuide;
