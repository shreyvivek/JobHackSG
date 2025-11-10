import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { TrendingUp, TrendingDown, ArrowRight, BarChart3 } from "lucide-react";
import { fetchSectorTrends } from "../apiSectorTrends";
import { useSector } from "../components/SectorContext";

interface TrendRecord {
  sector: string;
  year: number;
  quarter: string;
  value: number;
}

interface TrendsTabProps {
  onSectorClick: (sectorId: string) => void;
}

export default function TrendsTab({ onSectorClick }: TrendsTabProps) {
  const [trends, setTrends] = useState<TrendRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedSector } = useSector();

  useEffect(() => {
    fetchSectorTrends().then((data) => {
      setTrends(data);
      setLoading(false);
    });
  }, []);

  const sectorStats = React.useMemo(() => {
    if (!trends.length) return [];

    const grouped: Record<string, TrendRecord[]> = {};
    for (const t of trends) {
      const sectorName = t.sector.trim();
      if (!grouped[sectorName]) grouped[sectorName] = [];
      grouped[sectorName].push(t);
    }

    return Object.entries(grouped).map(([sector, records]) => {
      records.sort((a, b) =>
        a.year === b.year ? a.quarter.localeCompare(b.quarter) : a.year - b.year
      );
      const latest = records[records.length - 1]?.value ?? 0;
      const earlier = records[Math.max(records.length - 5, 0)]?.value ?? latest;
      const growth = ((latest - earlier) / (earlier || 1)) * 100;

      return {
        id: sector.toLowerCase().replace(/\s+/g, "-"),
        name: sector,
        growth: Math.round(growth * 10) / 10,
        value: latest,
      };
    });
  }, [trends]);

  const getGrowthDisplay = (growth: number) => {
    const isPositive = growth >= 0;
    return {
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? "text-blue-dark" : "text-red-600",
      bgColor: isPositive ? "bg-blue-100" : "bg-red-100",
      text: `${isPositive ? "+" : ""}${growth.toFixed(1)}%`,
    };
  };

  if (loading)
    return (
      <div className="p-8 text-center text-blue-darker font-semibold">
        Loading sector trends...
      </div>
    );

  return (
    <div className="min-h-screen p-4 pb-20 space-y-6">
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-dark rounded-2xl flex items-center justify-center shadow-blue">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <h1 className="mb-2 text-blue-darker">Market Trends</h1>
        <p className="text-blue-medium">
          Discover growing sectors based on live data
        </p>
      </div>

      <div className="space-y-4">
        {sectorStats.map((sector) => {
          const growth = getGrowthDisplay(sector.growth);

          return (
            <Card
              key={sector.id}
              className="card-blue shadow-blue border-0 overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-blue-darker">
                    {sector.name}
                  </h3>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg ${growth.bgColor}`}
                  >
                    <growth.icon className={`w-4 h-4 ${growth.color}`} />
                    <span className={`text-sm font-bold ${growth.color}`}>
                      {growth.text}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-blue-medium">
                  Latest Index:{" "}
                  <Badge className="bg-blue-100 text-blue-darker border-blue-200 font-bold">
                    {sector.value.toFixed(2)}
                  </Badge>
                </div>

                <Button
                  className="w-full bg-blue-dark text-white font-semibold hover:opacity-90"
                  onClick={() => {
                    setSelectedSector(sector.name.trim());
                    onSectorClick(sector.name.trim()); // ✅ this switches to Search tab
                  }}
                >
                  Explore {sector.name} Jobs{" "}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
