import path from "path";
import { promises as fs } from "fs";
import YAML from "yaml";

export default req => new Promise(async function(resolve, reject) {

	resolve({ ...(await discordStat()) })

});
