import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

const CustomCalendarGuide = ({ title, className = "" }) => {
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
                  How to upload and use a custom crop calendar
                </p>
                <p className="mt-5 text-lg text-black">
                  1. Download the CSV file
                </p>
                <br />
                <a
                  className="text-white text-lg font-semibold bg-green-800 py-2 px-5 rounded-md mt-1 hover:bg-yellow-300 hover:text-black"
                  href={"src/data/rdas_analytics_custom_crop_calendar.csv"}
                  download
                >
                  Download Here
                </a>

                <p className="mt-5 text-lg text-black">
                  2. Populate data in the CSV file.
                </p>
                <ul className="text-black text-base mt-2 ml-8 list-disc">
                  <li>
                    The first row serves as the field to assign the name of the
                    crop associated with the custom cropping calendar.
                    <ul className="list-disc">
                      <li className="ml-5">
                        Do not remove the # symbol before the crop name.
                      </li>
                    </ul>
                  </li>
                  <li>Do not replace or remove any column headers in row 2.</li>
                  <li>
                    Populate the values for each column for each cropping stage.
                    <ul className="list-disc">
                      <li className="ml-5">
                        Use number equivalents for months, use commas to
                        separate months for any cropping stage that involves
                        multiple months.
                      </li>
                    </ul>
                  </li>
                </ul>
                <br />

                <div className="flex flex-col items-center justify-center m-10 mb-5 mt-5">
                  <img
                    className="h-50px"
                    src="src/assets/custom-calendar-guide.png"
                    alt=""
                  />
                </div>

                <p className="mt-5  text-black text-lg">
                  3. Set the Parameters of the custom calendar.
                </p>

                <ul className="text-black text-base mt-2 ml-5 list-disc ml-8">
                  <li>
                    Country and District - Select which area the uploaded
                    cropping calendar is associated with
                  </li>
                  <li>Crop Calendar - select ‘Custom Calendar’</li>

                  <li>
                    Data Source - Select the data source to use for climate data
                  </li>
                  <li>
                    Analysis Timeline - select the year span for the historical
                    climate data.
                  </li>
                </ul>

                <div className="flex flex-col items-center justify-center m-10 mb-5 mt-5">
                  <img src="src/assets/crop-filter-form.png" alt="" />
                </div>

                <p className="mt-5 text-lg text-black">
                  4. Choose the file for upload - Select the populated CSV file.
                </p>

                <div className="flex flex-col items-center justify-center  my-5 ">
                  <img src="src/assets/calendar-upload-field.png" alt="" />
                </div>

                <p className="mt-5 text-lg text-black">
                  5. Start Analysis - Click the button to begin the analysis
                </p>

                <div className="flex flex-col items-center justify-center my-5 ">
                  <img src="src/assets/start-crop-analysis-button.png" alt="" />
                </div>
              </div>
            </ScrollArea>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CustomCalendarGuide;
