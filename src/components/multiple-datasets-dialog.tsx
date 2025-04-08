import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { cn, formatTitle, transformSourceObject } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import SubmitButton from "./submit-button";
import HelpHoverCard from "./help-hover-card";
import { Label } from "@radix-ui/react-dropdown-menu";
import Combobox from "./ui/combobox";
import { ElNinoToolDataIndicators } from "@/constants";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import CustomDatasetGuide from "./custom-dataset-guide";
import { Input } from "./ui/input";

const MultipleDatasetsDialog = ({ newParams, filterData, handleChange }) => {
  const [inputValues, setInputValues] = useState({});
  const [customUploads, setCustomUploads] = useState({});

  const handleInputChange = (datavariable: string, value: any) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [datavariable]: value,
    }));
  };

  const handleUploadChange = (datavariable: string, value: any) => {
    setCustomUploads((prevValues) => ({
      ...prevValues,
      [datavariable]: value,
    }));
  };

  useEffect(() => {
    handleChange("multipleSources", inputValues);
    handleChange("multipleCustomDatasets", customUploads);
  }, [inputValues, customUploads]);

  const verifyFilters =
    Object.keys(inputValues).length === filterData.dataVariable?.length;

  return (
    <>
      <Dialog>
        <DialogTrigger className="ml-1">
          <SubmitButton
            className=" border border-slate-300 text-black bg-transparent hover:text-gray-800 hover:border-slate-300 hover:bg-gray-200"
            label="Choose Multiple Sources"
            verifyFilters={true}
            submitFunction={() => console.log()}
          />
        </DialogTrigger>
        {/* <DialogContent className="lg:w-[50%]"> */}
        <DialogContent className="px-24 top-[40%] lg:w-[30%]">
          <DialogTitle></DialogTitle>
          <DialogHeader>
            <DialogDescription>
              {/* <ScrollArea className="h-[400px]"> */}
              <div>
                <p className="text-xl text-center my-3 text-black font-medium">
                  Choose multiple dataset sources
                </p>
              </div>

              <div className="flex flex-col gap-5 mt-8">
                {filterData.dataVariable?.map((item, index) => (
                  <div className="flex-col items-center justify-center my-2">
                    <div className="flex-col items-center justify-center ">
                      <div className="flex ">
                        <Label className="text-black text-xs font-semibold mb-1">
                          {formatTitle(ElNinoToolDataIndicators[item])} Datset
                        </Label>
                      </div>
                      <Combobox
                        name={item}
                        label={"Source"}
                        array={[...transformSourceObject(newParams?.source)]}
                        state={{
                          value: inputValues[item] || "",
                          setValue: handleInputChange,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <DialogClose className="w-full">
                <SubmitButton
                  className={"my-8"}
                  label="Submit"
                  verifyFilters={verifyFilters}
                  submitFunction={() =>
                    handleChange("allRequiredSourcesChosen", true)
                  }
                />
              </DialogClose>

              {/* </ScrollArea> */}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MultipleDatasetsDialog;
