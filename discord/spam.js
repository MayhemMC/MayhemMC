let number = 1;

client.setInterval(async function() {

	const guild = await client.guilds.fetch("708050277957238784");
	//guild.member("728653111748460586").send(`Counting to 1 million: #${number}. Also <:ez:784417888395853844>`);
	//guild.member("390651109431050240").send(`Counting to 1 million: #${number}. Also <:ez:784417888395853844>`);
	//guild.member("444651464867184640").send(`Counting to 1 million: #${number} - Never a good idea to piss off people who program ;)`);
	number ++;

}, 1000);
