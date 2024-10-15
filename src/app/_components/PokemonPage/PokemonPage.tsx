import { Card } from "@nextui-org/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PrimarySpinner } from "@/app/_components/PrimarySpinner";
import { NavMenu } from "@/app/_components/PokemonPage/NavMenu";
import { BasicInfoBox } from "@/app/_components/PokemonPage/BasicInfoBox";
import { SpriteGallery } from "@/app/_components/PokemonPage/SpriteGallery";

import { MovesTable } from "@/app/_components/PokemonPage/MovesTable";
import myPokedex from "@/app/_services/pokeapi";
import { StatsTable } from "@/app/_components/PokemonPage/StatsTable";
import { ScrollToTop } from "@/app/_components/ScrollToTop";
import { EvolutionTable } from "@/app/_components/PokemonPage/EvolutionTable";
import { ResistanceTable } from "@/app/_components/PokemonPage/ResistanceTable";
import { PokedexSidePanel } from "@/app/_components/PokemonPage/PokedexSidePanel";
import { PokemonType } from "@/app/_types/pokemon.type";
import { PokemonFullData } from "@/app/_services/models/PokemonFullData";
import useScrollPosition from "@/app/_hooks/useScrollPosition";
import useScreenSize from "@/app/_hooks/useScreenSize";
import UnknownPokemonSprite from "../../_assets/unknown_pokemon.png";
import { PrimaryIconButton } from "@/app/_components/PrimaryIconButton";
import { HiSparkles } from "react-icons/hi2";
import { DetailPanel } from "@/app/_components/PokemonPage/DetailPanel";
import { DetailPanelData } from "@/app/_services/models/DetailPanelData";
import {
  DetailPanelProvider,
  useDetailPanelContext,
} from "./DetailPanelContext";

const PokemonPageContent = () => {
  const { id } = useParams();
  const { scrollY } = useScrollPosition();
  const { size } = useScreenSize();

  const pokemonId: string = Array.isArray(id) ? id[0] : id;
  const pokemonIdInt: number = parseInt(pokemonId, 10);
  const [isLoading, setIsLoading] = useState(true);
  const [showShiny, setShowShiny] = useState<boolean>(false);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(true);
  const [pokemonFullData, setPokemonFullData] = useState<PokemonFullData>();
  const [detailPanelData, setDetailPanelData] = useState<DetailPanelData>();

  const { detailPanelUrl, counter } = useDetailPanelContext();

  useEffect(() => {
    setIsLoading(true);

    myPokedex
      .getPokemonFullDataById(pokemonId)
      .then((fullData) => {
        setPokemonFullData(fullData);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        throw Error("Unable to fetch pokemon details, try again later...");
      });
  }, [pokemonId]);

  function getSpriteUrl() {
    if (showShiny) {
      return (
        pokemonFullData?.simpleData.animatedShinySpriteUrl ||
        pokemonFullData?.simpleData.shinySpriteUrl ||
        UnknownPokemonSprite.src
      );
    } else {
      return (
        pokemonFullData?.simpleData.animatedSpriteUrl ||
        pokemonFullData?.simpleData.spriteUrl ||
        UnknownPokemonSprite.src
      );
    }
  }

  useEffect(() => {
    console.log(detailPanelUrl);
    if (detailPanelUrl) {
      myPokedex
        .getDetailPanelDataByUrl(detailPanelUrl)
        .then((data) => {
          setDetailPanelData(data);
        })
        .catch(() => {
          setIsLoading(false);
          throw Error("Unable to fetch detail panel data, try again later...");
        });
      setIsDetailPanelOpen(true);
    }
  }, [detailPanelUrl, counter]);

  return (
    <div className="relative min-h-screen w-full">
      <PokedexSidePanel />
      <Card className="mx-auto h-full min-h-screen w-full min-w-80 max-w-7xl rounded-none p-4">
        <ScrollToTop />
        {isDetailPanelOpen && detailPanelData && (
          <DetailPanel
            detailPanelData={detailPanelData}
            setIsOpen={setIsDetailPanelOpen}
          />
        )}
        {/* Display info after data is fully loaded */}
        {isLoading || !pokemonFullData ? (
          <PrimarySpinner className="m-auto" />
        ) : (
          <div className="flex flex-col items-center gap-10">
            {/* Nav Menu */}
            <NavMenu
              prevPokeapiId={pokemonFullData.pageData.prevPokeapiId}
              nextPokeapiId={pokemonFullData.pageData.nextPokeapiId}
              dexId={pokemonFullData.simpleData.id}
            />
            {/* Pokemon Info */}
            <div className="mt-6 flex w-full flex-col items-center">
              {/* Pokemon Image */}
              <SpriteGallery imageUrl={getSpriteUrl()} size="lg" />
              <PrimaryIconButton
                className={`absolute h-14 w-14 translate-x-[240%] translate-y-[260%] rounded-full border-none bg-default-200 p-1 shadow-sm ${showShiny && "border-solid border-yellow-400 text-yellow-400"}`}
                size="lg"
                fullWidth
                icon={HiSparkles}
                onClick={() => setShowShiny((prevState) => !prevState)}
                disableAnimation
              />
              {/* Pokemon Basic Info Box */}
              <BasicInfoBox pokemonFullData={pokemonFullData} />
            </div>
            <ResistanceTable
              types={pokemonFullData.simpleData.types as PokemonType[]}
            />
            <StatsTable stats={pokemonFullData.simpleData.stats} />
            <EvolutionTable evolutionChain={pokemonFullData.evolutionChain} />
            {/* Moves Table */}
            <MovesTable
              title="Level Up Moves"
              movesData={pokemonFullData.pokemon?.moves}
              method="level-up"
            />
            <MovesTable
              title="TM Moves"
              movesData={pokemonFullData.pokemon?.moves}
              method="machine"
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export const PokemonPage = () => {
  return (
    <DetailPanelProvider>
      <PokemonPageContent />
    </DetailPanelProvider>
  );
};
