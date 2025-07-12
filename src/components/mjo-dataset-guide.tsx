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

const MJODataUploadGuide = ({ title, className = "" }) => {
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
                  href={"src/data/rdas_analytics_mjo_dataset_template.csv"}
                  download
                >
                  Download Here
                </a>

                <p className="mt-5 text-lg text-black">
                  2. Populate data in the CSV file.
                </p>
                <ul className="text-black text-base mt-2 ml-8 list-disc">
                  <li> Do not replace or remove any column headers</li>
                  <li>
                    {" "}
                    The minimum number of rows of monthly observation data must
                    be 10957 - this is the minimum of 30 years required by the
                    tool times the number of days in the years span.
                  </li>
                </ul>
                <br />

                {/* TODO: Replace all images */}
                <div className="flex flex-col items-center justify-center m-10 mb-5 mt-5">
                  <img
                    className="h-50px"
                    src="src/assets/mjo-dataset-guide-1.png"
                    alt=""
                  />
                  <br />
                  <img
                    className="h-50px"
                    src="src/assets/mjo-dataset-guide-2.png"
                    alt=""
                  />
                </div>

                <p className="mt-5  text-black text-lg">
                  3. Set the Parameters of the custom dataset.
                </p>

                <ul className="text-black text-base mt-2 ml-5 list-disc ml-8">
                  <li>
                    Country and District - Select which area the uploaded data
                    is associated with
                  </li>

                  <li>Data Source - Select ‘Custom Dataset’</li>
                  <li>
                    Start and End Year - Select the year span of the data. The
                    minimum span should be 30 years.
                  </li>
                </ul>

                <div className="flex flex-col items-center justify-center m-10 mb-5 mt-5">
                  <img src="src/assets/mjo-filter.png" alt="" />
                </div>

                <p className="mt-5 text-lg text-black">
                  4. Choose the file for upload - Select the populated CSV file.
                </p>

                <div className="flex flex-col items-center justify-center  my-5 ">
                  <img src="src/assets/upload-field-2.png" alt="" />
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

export default MJODataUploadGuide;
