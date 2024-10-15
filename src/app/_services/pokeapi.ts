import { PokeApiWrapperInterface } from "./pokeapi.interface";
import Pokedex, { Move, PokemonSpecies } from "pokedex-promise-v2";
import { PokemonSimpleData } from "./models/PokemonSimpleData";
import {
  DataLink,
  PokemonFullData,
  PokemonPageData,
} from "./models/PokemonFullData";
import { EvolutionChain } from "./models/EvolutionChain";
import pokemonSimpleDataDatabase from "./databases/pokemonSimpleDataDatabase";
import evolutionChainDatabase from "./databases/evolutionChainDatabase";
import { statNameMap } from "../_utils/stats";
import {
  extractIdFromUrl,
  extractResourceAndId,
  formatName,
} from "../_utils/format";
import { DetailPanelData, DetailType } from "./models/DetailPanelData";
import { Albert_Sans } from "next/font/google";

class PokeApiWrapper implements PokeApiWrapperInterface {
  private pokedex: Pokedex;
  private pokemonSimpleDataDatabase: PokemonSimpleData[];

  constructor() {
    this.pokedex = new Pokedex({
      protocol: "https",
      versionPath: "/api/v2/",
      cacheLimit: 100 * 1000, // 100s
      timeout: 10 * 1000, // 10s
    });

    this.pokemonSimpleDataDatabase = pokemonSimpleDataDatabase;
  }

  getPokemonSimpleDataById(id: number): PokemonSimpleData {
    return (
      this.pokemonSimpleDataDatabase.find((item) => item.pokeapiId == id) ||
      this.pokemonSimpleDataDatabase[0]
    );
  }

  getEvolutionChainById(chainId: number): EvolutionChain {
    const defaultChain: EvolutionChain = {
      id: -1,
      evolutionTrees: [],
    };
    return (
      evolutionChainDatabase.find((item) => item.id == chainId) || defaultChain
    );
  }

  getAllPokemonSimpleData(): PokemonSimpleData[] {
    return this.pokemonSimpleDataDatabase;
  }

  getMoveByName(nameOrId: string | number): Promise<Move> {
    return this.pokedex.getMoveByName(nameOrId);
  }

  getSpeciesByName(nameOrId: string | number): Promise<PokemonSpecies> {
    return this.pokedex.getPokemonSpeciesByName(nameOrId);
  }

  // TODO: add all data proccesing here instead of in components
  async getPokemonFullDataById(
    pokemonId: string | number,
  ): Promise<PokemonFullData> {
    const simpleData = this.getPokemonSimpleDataById(pokemonId as number);
    const pokemon = await this.pokedex.getPokemonByName(pokemonId);
    const speciesId = extractIdFromUrl(pokemon.species.url);
    const species = await this.pokedex.getPokemonSpeciesByName(speciesId);
    const form = await this.pokedex.getPokemonFormByName(pokemon.forms[0].name);

    // Format data for pokemon page:

    // Navigation Taps indexes
    var prevPokeapiId = 0;
    var nextPokeapiId = 0;
    const endIndex = this.pokemonSimpleDataDatabase.length;
    for (let i = 0; i < endIndex; i++) {
      if (
        this.pokemonSimpleDataDatabase[i].pokeapiId == (pokemonId as number)
      ) {
        if (i === 0) {
          prevPokeapiId =
            this.pokemonSimpleDataDatabase[endIndex - 1].pokeapiId;
          nextPokeapiId = this.pokemonSimpleDataDatabase[i + 1].pokeapiId;
        } else if (i === endIndex - 1) {
          prevPokeapiId = this.pokemonSimpleDataDatabase[i - 1].pokeapiId;
          nextPokeapiId = this.pokemonSimpleDataDatabase[0].pokeapiId;
        } else {
          prevPokeapiId = this.pokemonSimpleDataDatabase[i - 1].pokeapiId;
          nextPokeapiId = this.pokemonSimpleDataDatabase[i + 1].pokeapiId;
        }
      }
    }

    const abilities: DataLink[] = pokemon.abilities.map((ability) => {
      {
        return {
          value: formatName(ability.ability.name),
          url: ability.ability.url,
        };
      }
    });

    const heldItems: DataLink[] =
      pokemon.held_items.length > 0
        ? pokemon.held_items.map((item) => {
            return {
              value: formatName(item.item.name),
              url: item.item.url,
            };
          })
        : [{ value: "None", url: null }];

    const evYield: DataLink[] = pokemon.stats
      .filter((stat) => stat.effort > 0)
      .map((stat) => {
        return {
          value: stat.effort + " " + statNameMap[stat.stat.name],
          url: null,
        };
      });
    const nameObj = species.names.find(
      (nameObj) => nameObj.language.name === "en",
    );
    const formName = form.names.find((item) => item.language.name === "en");
    const formatedName: string = formName?.name || nameObj?.name || "Unknown";

    const weight: string = pokemon.weight / 10 + "kg";
    const height: string = pokemon.height / 10 + "m";
    const baseExp: number = pokemon?.base_experience || 0;
    const pokedexEntry: string =
      species?.flavor_text_entries
        .slice()
        .reverse()
        .find((entry) => entry.language && entry.language.name === "en")
        ?.flavor_text || "";

    const pageData: PokemonPageData = {
      prevPokeapiId,
      nextPokeapiId,
      formatedName,
      abilities,
      weight,
      height,
      baseExp,
      heldItems,
      evYield,
      pokedexEntry,
    };

    const pokemonFullData: PokemonFullData = {
      simpleData,
      pokemon,
      species,
      form,
      pageData,
      evolutionChain: this.getEvolutionChainById(simpleData.evolutionChainId),
    };

    return pokemonFullData;
  }

  async getDetailPanelDataByUrl(url: string): Promise<DetailPanelData> {
    let [type, id] = extractResourceAndId(url);
    type = type as DetailType;

    let detailPanelData: DetailPanelData = {
      type: DetailType.UNKNOWN,
      friendlyName: "unknown",
      detail: "unknown item",
    };

    switch (type) {
      case DetailType.ABILITY:
        const ability = await this.pokedex.getAbilityByName(id);
        detailPanelData.type = DetailType.ABILITY;

        const friendlyName = ability.names.find(
          (item) => item.language.name == "en",
        )?.name;
        if (friendlyName) detailPanelData.friendlyName = friendlyName;
        
        const detail = ability.effect_entries.find(
          (item) => item.language.name == "en",
        )?.effect;
        if (detail) detailPanelData.detail = detail;
      case DetailType.ITEM:
        break;
      case DetailType.MOVE:
        break;
    }

    return detailPanelData;
  }
}

const myPokedex = new PokeApiWrapper();

export default myPokedex;
