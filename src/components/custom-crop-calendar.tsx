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
              </div>
            </ScrollArea>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CustomCalendarGuide;
