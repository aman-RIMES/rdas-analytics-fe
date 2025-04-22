import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import CropCalendar from "./crop-tools/crop-calendar";
import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import CropToolsAnalysisText from "./crop-tools/crop-tool-analysis-text";
import { DownloadIcon } from "lucide-react";

const DownloadPdf = ({ cropAnalysisData, analysisSubject }) => {
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const getPageMargins = () => {
    return `@page { margin: 32px 49px 32px 49px !important; }`;
  };

  return (
    <div>
      <button
        onClick={() => reactToPrintFn()}
        className="bg-yellow-300 shadow-sm shadow-gray-300 p-2 rounded-md text-md font-medium text-black"
      >
        <div className="flex flex-row items-center gap-2">
          Download Report
          <DownloadIcon className="h-5 w-5" />
        </div>
      </button>
      <div className="printContent" ref={contentRef}>
        <style type="text/css" media="print">
          {
            "\
  @page { size: landscape; }\
"
          }
        </style>
        <style>{getPageMargins()}</style>

        <p className="text-center text-3xl my-8 font-bold text-green-800">
          Crop Calendar Suitability Report
        </p>

        <div className="flex flex-col ">
          <CropCalendar
            cropAnalysisData={cropAnalysisData}
            analysisSubject={analysisSubject}
          />
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              ...cropAnalysisData?.chart?.rainfall,
              exporting: { scale: 2 },
              chart: { width: 1000, height: 500 },
            }}
            containerProps={{ style: { height: "100%", width: "100%" } }}
          />

          <HighchartsReact
            highcharts={Highcharts}
            options={{
              ...cropAnalysisData?.chart?.temperature,
              exporting: { scale: 2 },
              chart: { width: 1000, height: 500 },
            }}
          />

          <div className="mt-48 mb-14">
            <p className="ml-2 text-4xl  text-green-800 font-bold"> Analysis</p>

            <CropToolsAnalysisText
              cropAnalysisData={cropAnalysisData}
              isPrint={true}
            />
          </div>

          <div className="mt-6 mb-14">
            <p className="ml-2 text-4xl  text-green-800 font-bold">
              {" "}
              Recommendation
            </p>
            <div>
              <p className="p-2 text-lg" style={{ whiteSpace: "break-spaces" }}>
                {cropAnalysisData?.recommendation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPdf;
