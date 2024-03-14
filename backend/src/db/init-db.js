import * as dotenv from 'dotenv';

dotenv.config();

import mongoose from 'mongoose';
import axios from "axios";
import Species from "./species-schema.js";

async function main() {
  console.log("Connected to database!");
  await mongoose.connect(process.env.DB_URL);

  await clearDatabase();
  console.log("");
  await populateSpecies();
  // Disconnect when complete
  await mongoose.disconnect();
  console.log("Disconnected from database!");
}
main();
/**
 * Deletes all data in all collections, using a schema-agnostic approach.
 */
async function clearDatabase() {
  console.log("Clearing entire database...");
  const collections = await mongoose.connection.db.collections();
  for (const c of collections) {
    await c.deleteMany({});
  }
  console.log("cleared database");
}

async function populateSpecies() {
  console.log("Fetching species list...");
  const responsePoke = await axios.get(
    "https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0"
  );
  const responseSpecies = await axios.get(
    "https://pokeapi.co/api/v2/pokemon-species?limit=1025&offset=0"
  );
  const speciesList = responseSpecies.data.results;
  const pokeList = responsePoke.data.results;
  console.log(`${speciesList.length} species found!`);
  console.log(`${pokeList.length} pokemon found!`);
  for (let i = 0; i < pokeList.length; i++) {
    let cleanedText = "";
    const pokeData = await axios.get(pokeList[i].url);
    const speciesData = await axios.get(speciesList[i].url);
    if (speciesData.data.flavor_text_entries.length > 0) {
      const flavorTextEntry = speciesData.data.flavor_text_entries.find(
        (entry) => entry.language.name === "en"
      );
      const flavorText = flavorTextEntry.flavor_text;

      //parsing flavour text - https://github.com/veekun/pokedex/issues/218#issuecomment-339841781
      cleanedText = flavorText
        .replace(/\f/g, "\n")
        .replace(/\u00ad\n/g, "")
        .replace(/\u00ad/g, "")
        .replace(/ -\n/g, " - ")
        .replace(/-\n/g, "-")
        .replace(/\n/g, " ");
    }

    const types = [...pokeData.data.types.map((type) => type.type.name)];

    const species = new Species({
      dexNumber: pokeData.data.id,
      dexEntry: cleanedText,
      name: pokeData.data.name,
      types: types,
      height: pokeData.data.height,
      weight: pokeData.data.weight,
      isLegendary:
        speciesData.data.is_legendary || speciesData.data.is_mythical,
      image: {
        normal: pokeData.data.sprites.other["official-artwork"].front_default,
        shiny: pokeData.data.sprites.other["official-artwork"].front_shiny,
      },
    });
    await species.save();
    console.log(`${i + 1}/${pokeList.length} Processed`);
  }
  console.log("Finished saving pokemon species");
}