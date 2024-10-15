import React, { createContext, useContext, useState, ReactNode } from "react";

interface DetailPanelContextType {
  detailPanelUrl: string;
  setDetailPanelUrl: (url: string) => void;
  counter: number;
  setCounter: (count: number) => void;
}

const DetailPanelContext = createContext<DetailPanelContextType | undefined>(
  undefined,
);

interface DetailPanelProviderProps {
  children: ReactNode;
}

export const DetailPanelProvider: React.FC<DetailPanelProviderProps> = ({
  children,
}) => {
  const [detailPanelUrl, setDetailPanelUrl] = useState<string>("");
  const [counter, setCounter] = useState<number>(0);

  return (
    <DetailPanelContext.Provider
      value={{ detailPanelUrl, setDetailPanelUrl, counter, setCounter }}
    >
      {children}
    </DetailPanelContext.Provider>
  );
};

export const useDetailPanelContext = () => {
  const context = useContext(DetailPanelContext);
  if (!context) {
    throw new Error(
      "useDetailPanelContext must be used within a DetailPanelProvider",
    );
  }
  return context;
};
