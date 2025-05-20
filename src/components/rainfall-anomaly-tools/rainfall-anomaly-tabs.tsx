import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import RainfallAnomalyChart from "./rainfall-anomaly-charts";

function RainfallAnomlayTabs({
  firstChartData,
  secondChartData,
  rainfallAnomalyStatus,
  chartHeight = "380px",
}) {
  return (
    <>
      <div>
        <Tabs defaultValue="charts" className="w-full ">
          <TabsList className="w-full">
            <div className="flex  justify-between w-full">
              <TabsTrigger className="w-full text-green-600" value="charts">
                {firstChartData
                  ? firstChartData?.title?.text
                  : "Rainfall Chart"}
              </TabsTrigger>
              <TabsTrigger
                className="w-full text-green-600"
                value="correlation"
              >
                {secondChartData
                  ? secondChartData?.title?.text
                  : "Rainy Day Chart"}
              </TabsTrigger>
            </div>
          </TabsList>
          <div className="bg-white rounded-lg">
            <TabsContent value="charts">
              <div className="">
                <RainfallAnomalyChart
                  chartHeight={chartHeight}
                  chartData={firstChartData}
                  AnalysisStatus={rainfallAnomalyStatus}
                />
              </div>
            </TabsContent>
            <TabsContent value="correlation">
              <>
                <RainfallAnomalyChart
                  chartHeight={chartHeight}
                  chartData={secondChartData}
                  AnalysisStatus={rainfallAnomalyStatus}
                />
              </>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
}

export default RainfallAnomlayTabs;
