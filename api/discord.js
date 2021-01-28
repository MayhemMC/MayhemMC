export default () => new Promise(async function(resolve) {

	resolve({ ...(await discordStat()) })

});
