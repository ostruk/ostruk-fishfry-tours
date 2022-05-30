class DB{
    // IN MEM DATABASE, TODO: REPLACE WITH ACTUAL DB
    constructor(){
        this.boats = [
            {
                "name":"Serendipity",
                "status":"Docked"
            },
            {
                "name":"Imagination",
                "status":"Outbound to Sea"
            },
            {
                "name":"Liberty",
                "status":"Maintenance"
            },
            {
                "name":"Wanderlust",
                "status":"Docked"
            },
            {
                "name":"Gale",
                "status":"Outbound to Sea"
            },
            {
                "name":"Zephyr",
                "status":"Inbound to Harbor"
            },
            {
                "name":"Sapphire",
                "status":"Docked"
            },
            {
                "name":"Amazonite",
                "status":"Outbound to Sea"
            },
            {
                "name":"Atlantis",
                "status":"Maintenance"
            },
            {
                "name":"Leviathan",
                "status":"Maintenance"
            },
            {
                "name":"Wayfarer",
                "status":"Outbound to Sea"
            },
            {
                "name":"Neptune",
                "status":"Inbound to Harbor"
            },
        ];
    }

    setBoats(boatsIn){
        this.boats = boatsIn;
    }

    boatExists(name){
        let found = false;
        for (let b of this.boats) {
            if (b.name === name) {
                found = true;
            }
        }
        return found;
    }
}


module.exports = DB;