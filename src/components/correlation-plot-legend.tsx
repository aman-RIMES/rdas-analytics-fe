import { formatTitle } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { correlationLegendObject } from "@/constants";

const CorrelationPlotLegend = () => {
  return (
    <div className=" flex flex-col items-center justify-center sm:p-10 p-4 m-1 rounded-lg bg-gray-50 shadow-lg">
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-fuchsia-900 hover:bg-fuchsia-900">
              <TableHead className=" text-white text-center text-md font-medium h-8">
                Correlation Coefficient (R) Value
              </TableHead>
              <TableHead className=" text-white text-center text-md font-medium h-8">
                Direction & Strength of Correlation
              </TableHead>
              <TableHead className=" text-white text-center text-md font-medium h-8">
                Interpretation of Correlation
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {correlationLegendObject?.map((element, index) => (
              <TableRow
                key={index}
                className={`${element.style} hover:${element.style} hover:bg-gray-400`}
              >
                <TableCell className="text-xs text-center font-bold p-1">
                  {element.coefficient}
                </TableCell>

                <TableCell className="text-xs text-center font-medium p-1">
                  {element.description}
                </TableCell>

                <TableCell className="text-xs text-center font-medium p-1">
                  {element.interpretation}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CorrelationPlotLegend;
