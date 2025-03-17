import { HeatMapGrid } from "react-grid-heatmap";

type HeatmapProps = {
  data: {
    grid: number[][];
    xLabels: string[];
    yLabels: string[];
  };
};

const Heatmap = ({ data }: HeatmapProps) => {
  const { grid, xLabels, yLabels } = data;

  if (!grid.length) {
    return (
      <div className="p-4 text-gray-500">No data available for heatmap</div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <HeatMapGrid
        xLabels={xLabels}
        yLabels={yLabels}
        data={grid}
        cellRender={(x, y, value) => (
          <div title={`${yLabels[y]} at ${xLabels[x]}: ${value} events`}>
            {value}
          </div>
        )}
        xLabelsStyle={() => ({
          color: "#777",
          fontSize: ".8rem",
        })}
        yLabelsStyle={() => ({
          fontSize: ".7rem",
          textTransform: "uppercase",
          color: "#777",
        })}
        cellStyle={(_x, _y, ratio) => ({
          background: `rgb(12, 160, 44, ${ratio})`,
          fontSize: ".8rem",
          color: `rgb(0, 0, 0, ${ratio / 2 + 0.4})`,
        })}
        cellHeight="2rem"
        xLabelsPos="bottom"
        yLabelsPos="left"
      />
    </div>
  );
};

export default Heatmap;
