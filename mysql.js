const db = require("mysql-promise")();

module.exports = async function() {

	const params = YAML.parse(await fs.readFile(path.join(__dirname, "config.yml"), "utf8")).mysql;
	db.configure(params, require("mysql2"));
	return db;

}
