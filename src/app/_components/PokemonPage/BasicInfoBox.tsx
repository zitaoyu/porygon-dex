import { Pokemon, PokemonForm, PokemonSpecies } from "pokedex-promise-v2";
import Link from "next/link";
import { getPokemonTypeColor } from "@/app/_utils/type-colors";
import { formatName } from "@/app/_utils/format";
import { statNameMap } from "@/app/_utils/stats";
import { useEffect, useState } from "react";
import { PrimarySpinner } from "../PrimarySpinner";
import { PokemonTypeBoxes } from "../PokemonTypeBox";
import {
  DataLink,
  PokemonFullData,
} from "@/app/_services/models/PokemonFullData";
import { useDetailPanelContext } from "./DetailPanelContext";

type BasicInfoBoxItemProps = {
  title: string;
  items: DataLink[];
  isVerticle?: boolean;
};

const BasicInfoBoxItem = ({
  title,
  items,
  isVerticle = false,
}: BasicInfoBoxItemProps) => {
  const { setDetailPanelUrl, counter, setCounter } = useDetailPanelContext();
  return (
    <div className={`w-full items-center p-1`}>
      <div className={`font-medium ${isVerticle && "text-center"}`}>
        {title}
      </div>
      <div
        className={`flex w-full rounded-2xl bg-white px-3 py-1 dark:bg-zinc-600 
                    ${items.length > 1 ? "justify-evenly" : "justify-center"}
                    `}
      >
        {items.map((item) =>
          item.url === null ? (
            <span key={item.value}>{item.value}</span>
          ) : (
            <span
              key={item.value}
              className="hover:underline"
              onClick={() => {
                setDetailPanelUrl(item.url as string);
                setCounter(counter + 1);
              }}
            >
              {item.value}
            </span>
          ),
        )}
      </div>
    </div>
  );
};

type BasicInfoBoxProps = {
  pokemonFullData: PokemonFullData;
};

export const BasicInfoBox = ({ pokemonFullData }: BasicInfoBoxProps) => {
  const [loading, setLoading] = useState(true);
  const [formatedName, setFormatedName] = useState<string>(
    pokemonFullData.simpleData.name,
  );
  const [types, setTypes] = useState<string[]>([]);
  const [abilities, setAbilities] = useState<DataLink[]>([]);
  const [heldItems, setHeldItems] = useState<DataLink[]>([]);
  const [evYield, setEvYield] = useState<DataLink[]>([]);
  const [weight, setWeight] = useState<DataLink[]>([]);
  const [height, setHeight] = useState<DataLink[]>([]);
  const [baseExp, setBaseExp] = useState<DataLink[]>([]);
  const [entry, setEntry] = useState<DataLink[]>([]);

  useEffect(() => {
    setTypes(pokemonFullData.simpleData.types);
    setAbilities(pokemonFullData.pageData.abilities);
    setHeldItems(pokemonFullData.pageData.heldItems);
    setEvYield(pokemonFullData.pageData.evYield);
    setWeight([{ value: pokemonFullData.pageData.weight, url: null }]);
    setHeight([{ value: pokemonFullData.pageData.height, url: null }]);
    setBaseExp([{ value: pokemonFullData.pageData.baseExp, url: null }]);
    setFormatedName(pokemonFullData.pageData.formatedName);
    setEntry([{ value: pokemonFullData.pageData.pokedexEntry, url: null }]);
    setLoading(false);
  }, []);

  if (!pokemonFullData || loading) {
    return (
      <div className="flex h-[400px] w-full items-center">
        <PrimarySpinner className="m-auto" />
      </div>
    );
  }

  return (
    <div className="mb-4 flex w-full flex-col items-center gap-4">
      {/* Pokmeon Name */}
      <p className="-mb-2 text-2xl font-semibold">{formatedName}</p>
      {/* Pokemon types */}
      <PokemonTypeBoxes types={types} size="lg" />
      <div
        className="flex w-full max-w-lg flex-col rounded-2xl p-[2px]"
        style={{
          backgroundColor: getPokemonTypeColor(types[0]),
        }}
      >
        <div className="rounded-2xl bg-default-200 p-2">
          <BasicInfoBoxItem title="Abilities:" items={abilities} isVerticle />
          <div className="grid grid-cols-2">
            <BasicInfoBoxItem title="Weight:" items={weight} />
            <BasicInfoBoxItem title="Height:" items={height} />
          </div>
          <BasicInfoBoxItem title="Base Experience:" items={baseExp} />
          <BasicInfoBoxItem title="Held Items:" items={heldItems} />
          <BasicInfoBoxItem title="EV yield:" items={evYield} />
          <BasicInfoBoxItem title="Pokedex Entry:" items={entry} />
        </div>
      </div>
    </div>
  );
};
