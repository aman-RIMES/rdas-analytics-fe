import {
  IDLE_ANALYTICS_CHART_MESSAGE,
  DYNAMIC_MAP_ERROR_MESSAGE,
} from "@/constants";
import { isError, isFinished, isIdle, isLoading } from "@/lib/utils";
import ErrorMessage from "../ui/error-message";
import Loading from "../ui/loading";

const MapOverlay = ({ geoJsonStatus, anomalyMapStatus }) => {
  return (
    <>
      {(!isFinished(geoJsonStatus) || !isFinished(anomalyMapStatus)) && (
        <div className="absolute inset-0 flex justify-center items-center z-30 bg-white bg-opacity-70 ">
          {(isIdle(geoJsonStatus) || isIdle(anomalyMapStatus)) && (
            <p className="text-xl font-bold text-green-800">
              {IDLE_ANALYTICS_CHART_MESSAGE}
            </p>
          )}
          {(isError(geoJsonStatus) || isError(anomalyMapStatus)) && (
            <ErrorMessage errorMessage={DYNAMIC_MAP_ERROR_MESSAGE} />
          )}

          {(isLoading(geoJsonStatus) || isLoading(anomalyMapStatus)) && (
            <Loading
              animation={
                // @ts-ignore
                <l-grid color="green" stroke={8} size="60"></l-grid>
              }
            />
          )}
        </div>
      )}
    </>
  );
};

export default MapOverlay;
