import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useNavigate, useParams } from "react-router-dom";
import { analysisTopics } from "@/constants";
import NotFoundPage from "./404-page";
import { AnalysisSubject } from "@/types";

const ElNino = () => {
  const [chosenSubject, setChosenSubject] = useState<AnalysisSubject>();
  const navigate = useNavigate();
  const { topic } = useParams();
  const analysisSubject = analysisTopics.find(
    (element) => element.name === topic
  );
  if (!analysisSubject) return <NotFoundPage />;
  // console.log(analysisSubject);

  return (
    <>
      <div className="flex justify-center my-1">
        <h1 className="text-3xl font-bold">{analysisSubject.title}</h1>
      </div>
      <div className="w-full h-full flex gap-10 justify-center items-center mb-6">
        {analysisSubject.options.map((element) => (
          <div key={element.id}>
            <Dialog>
              <DialogTrigger>
                <Card
                  onClick={() => setChosenSubject(element)}
                  className="hover:cursor-pointer hover:border-black hover:border-2"
                >
                  <div className="flex justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-40 h-40"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
                      />
                    </svg>
                  </div>
                  <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
                    <CardTitle className="text-xl font-medium flex justify-center p-2 rounded-sm">
                      {element.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* <div className="text-2xl font-bold">{element.value}</div>
                <p className="text-xs text-muted-foreground">
                  Reported since 1950
                </p> */}
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-80">
                <DialogHeader>
                  <DialogTitle className="text-center mb-2">
                    {element.title}
                  </DialogTitle>
                  <DialogDescription className="text-center text-md mb-2">
                    Choose number of years of analysis
                  </DialogDescription>
                  <div className="flex flex-col gap-2">
                    {chosenSubject?.analysisYears.map((year) => (
                      <div
                        key={year.value}
                        onClick={() =>
                          navigate(
                            `/dashboard/${topic}/analyze?subject-id=${chosenSubject.id.toString()}&year=${
                              year.value
                            }`
                          )
                        }
                        className="text-md font-medium flex justify-center border p-2 rounded-sm hover:border-black hover:cursor-pointer"
                      >
                        {year.label}
                      </div>
                    ))}
                  </div>
                </DialogHeader>
                <DialogClose>
                  <div className="text-md text-white bg-black hover:bg-white hover:text-black hover:border-black font-medium flex justify-center border p-2 rounded-sm">
                    Cancel
                  </div>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </>
  );
};

export default ElNino;
