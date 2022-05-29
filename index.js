// TODO: break into multiple files

const {api} = require("./api");
const PORT = process.env.PORT || 3000;

api.listen(PORT, () => console.log(`Fishfry Tours API is now listening on port ${PORT}!`))