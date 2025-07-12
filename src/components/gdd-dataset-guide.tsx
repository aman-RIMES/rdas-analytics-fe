import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

const GDDDataUploadGuide = ({ title, className = "" }) => {
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
      <DialogContent className="lg:w-[60%]">
        <DialogHeader>
          <DialogDescription>
            <ScrollArea className="h-[700px]">
              <div>
                <p className="text-xl text-center my-3 text-black">
                  How to upload and use a custom dataset
                </p>
                <p className="mt-5 text-lg text-black">
                  1. Download the CSV file
                </p>
                <br />
                <a
                  className="text-white text-lg font-semibold bg-green-800 py-2 px-5 rounded-md mt-1 hover:bg-yellow-300 hover:text-black"
                  href={"src/data/rdas_analytics_gdd_dataset_template.csv"}
                  download
                >
                  Download Here
                </a>

                <p className="mt-5 text-lg text-black">
                  2. Populate data in the CSV file.
                </p>
                <ul className="text-black text-base mt-2 ml-8 list-disc">
                  <li> Do not replace or remove any column headers</li>
                </ul>
                <br />

                <div className="flex flex-col items-center justify-center m-10 mb-5 mt-5">
                  <img
                    className="h-50px"
                    src="src/assets/gdd-dataset-guide-1.png"
                    alt=""
                  />
                  <br />
                  <img
                    className="h-50px"
                    src="src/assets/gdd-dataset-guide-2.png"
                    alt=""
                  />
                </div>

                <p className="mt-5  text-black text-lg">
                  3. Set the Parameters of the custom dataset.
                </p>

                <ul className="text-black text-base mt-2 ml-5 list-disc ml-8">
                  <li>
                    Country and Province/District - Select which area the
                    uploaded data is associated with
                  </li>
                  <li>Data Source - Select ‘Custom Dataset’</li>
                  <li>Crop - Select the subject crop</li>
                  <li>
                    Year - Select the prediction year (the latest year in the
                    uploaded data)
                  </li>
                </ul>

                <div className="flex flex-col items-center justify-center m-10 mb-5 mt-5">
                  <img src="src/assets/gdd-filter.png" alt="" />
                </div>

                <p className="mt-5 text-lg text-black">
                  4. Choose the file for upload - Select the populated CSV file.
                </p>

                <div className="flex flex-col items-center justify-center  my-5 ">
                  <img src="src/assets/upload-field.png" alt="" />
                </div>

                <p className="mt-5 text-lg text-black">
                  5. Start Analysis - Click the button to begin the analysis
                </p>

                <div className="flex flex-col items-center justify-center my-5 ">
                  <img src="src/assets/start-analysis-button.png" alt="" />
                </div>
              </div>
            </ScrollArea>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default GDDDataUploadGuide;
