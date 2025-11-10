import React, { createContext, useContext, useState } from "react";

interface SectorContextType {
  selectedSector: string | null;
  setSelectedSector: (sector: string | null) => void;
}

const SectorContext = createContext<SectorContextType | undefined>(undefined);

export const SectorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  return (
    <SectorContext.Provider value={{ selectedSector, setSelectedSector }}>
      {children}
    </SectorContext.Provider>
  );
};

export const useSector = () => {
  const context = useContext(SectorContext);
  if (!context) throw new Error("useSector must be used within a SectorProvider");
  return context;
};
