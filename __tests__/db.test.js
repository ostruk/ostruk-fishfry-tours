const {api,db} = require('../src/api'); // import API, db instance

describe('In memory db tests - check boatExists function', () => {
    // In memory db tests
    test("returns true if boat exists", () => {
        expect(db.boatExists("Imagination")).toBe(true);
    });
    
    test("returns false if boat exists", () => {
        expect(db.boatExists("DNE")).toBe(false);
    });
})