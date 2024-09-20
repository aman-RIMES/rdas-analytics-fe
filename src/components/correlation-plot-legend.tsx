import { formatTitle } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { correlationLegendObject, correlationLegendStyle } from "@/constants";

const CorrelationPlotLegend = () => {
  return (
    <div className="flex flex-col items-center justify-center sm:p-10 p-4 rounded-lg bg-gray-50 shadow-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-yellow-300 hover:bg-yellow-300">
            <TableHead className=" text-black text-lg font-medium">
              Correlation Coefficient (R) Value
            </TableHead>
            <TableHead className=" text-black text-lg font-medium">
              Direction & Strength of Correlation
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(correlationLegendObject)?.map((key, index) => (
            <TableRow
              key={key}
              className={`${correlationLegendStyle[index]} hover:${correlationLegendStyle[index]}`}
            >
              <TableCell className="text-lg font-bold">{key}</TableCell>

              <TableCell className="text-lg font-medium">
                {correlationLegendObject[key]}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CorrelationPlotLegend;
