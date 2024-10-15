import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
} from "@nextui-org/react";
import { Overlay } from "../Overlay";
import useToggleBodyScroll from "@/app/_hooks/useToggleBodyScroll";
import { DetailPanelData } from "@/app/_services/models/DetailPanelData";
import { PrimaryButton } from "../PrimaryButton";
import { PrimaryIconButton } from "../PrimaryIconButton";
import { capitalizeFirstLetter } from "@/app/_utils/format";

interface DetailPanelProps {
  detailPanelData: DetailPanelData;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DetailPanel = ({
  detailPanelData,
  setIsOpen,
}: DetailPanelProps) => {
  useToggleBodyScroll();

  return (
    <div>
      <Overlay onClick={() => setIsOpen(false)} />
      <div
        className="fixed left-1/2 z-50 flex h-[80vh] w-[98vw] -translate-x-1/2
      flex-col justify-center overflow-hidden rounded-xl p-6 md:max-w-2xl"
      >
        {/* TODO: implement UI */}
        <Card className="flex h-full w-full p-4">
          <CardHeader className="flex justify-end">
            <PrimaryButton
              className="text-lg font-normal"
              onClick={() => setIsOpen(false)}
            >
              Back
            </PrimaryButton>
          </CardHeader>
          <CardHeader className="flex justify-center">
            <h1 className="text-4xl font-medium">
              {capitalizeFirstLetter(detailPanelData.type)}
            </h1>
          </CardHeader>
          <Divider />
          <CardBody className="gap-6 text-lg">
            <p>Name: {detailPanelData.friendlyName}</p>
            <p>
              Detail: <p>{detailPanelData.detail}</p>
            </p>
          </CardBody>
          <Divider />
          <CardFooter className="justify-center">
            <PrimaryButton>Full Detail on Bulbapedia</PrimaryButton>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
