import { ScrollArea } from "../ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { cn, formatTitle } from "@/lib/utils";
import sampleCharts from "../../data/sample_charts.json";

const CropToolsAnalysisText = ({ cropAnalysisData, isPrint = false }) => {
  return (
    <>
      <div>
        <p
          className={cn(isPrint && "text-lg", "p-2")}
          style={{ whiteSpace: "break-spaces" }}
        >
          {cropAnalysisData?.analysis || sampleCharts?.crop_analysis}
        </p>
      </div>

      {cropAnalysisData?.analysis_per_stage && (
        <div className={cn(!isPrint && "w-[500px]")}>
          <Table className="mt-2">
            <TableHeader>
              <TableRow>
                {Object.keys(cropAnalysisData?.analysis_per_stage[0])
                  .filter((key) => key !== "number")
                  ?.map((key: any) => (
                    <TableHead className="text-black text-md font-medium text-center">
                      <div>{formatTitle(key)}</div>
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {cropAnalysisData?.analysis_per_stage?.map(
                (element: any, index) => (
                  <TableRow>
                    {Object.keys(element)
                      .filter((key) => key !== "number")
                      ?.map((e: any) => (
                        <TableCell
                          key={index}
                          className="text-md text-center p-[4px] "
                        >
                          {element[e]}
                        </TableCell>
                      ))}
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};

export default CropToolsAnalysisText;
