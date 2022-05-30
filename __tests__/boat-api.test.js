// RUN TESTS ON API USING SUPERTEST LIBRARY
// https://www.npmjs.com/package/supertest

const {api,db} = require('../src/api'); // import API, db instance
const supertest = require('supertest');   // import supertest library
const requestWithSupertest = supertest(api); // provide http abstraction to our API

describe('API endpoint tests', () => {
  // Tests for API endpoints using supertest library

  // before each test, re-set in-memory "database" to default configuration
  beforeEach(() => {
    // initial state of the "database"
    db.setBoats([
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
    ]); 
  });

  // START TESTS
  it('GET /boats should show all boats', async () => {
    const res = await requestWithSupertest.get('/api/boats');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveLength(12); // there should be 12 boats initially
  });

  it('POST /boat should create new boat', async () => {
    const res = await requestWithSupertest.post('/api/boat').send({"name":"Newboat","status":"Docked"});
    expect(res.status).toEqual(200);
    const res2 = await requestWithSupertest.get('/api/boats');
    expect(res2.body).toHaveLength(13); // 13 means a boat has been added
  });

  it('POST /boat should not add boat with existing name', async () => {
    const res = await requestWithSupertest.post('/api/boat').send({"name":"Gale","status":"Docked"});
    expect(res.status).toEqual(500);
    const res2 = await requestWithSupertest.get('/api/boats');
    expect(res2.body).toHaveLength(12); // responded with 500 and boats stayed the same
  });

  it('POST /boat should not add boat with invalid status', async () => {
    const res = await requestWithSupertest.post('/api/boat').send({"name":"Newboat","status":"BadStatus"});
    expect(res.status).toEqual(500);
    const res2 = await requestWithSupertest.get('/api/boats');
    expect(res2.body).toHaveLength(12); // responded with 500 and boats stayed the same
  });

  it('GET /boat should get boat by name', async () => {
    const res = await requestWithSupertest.get('/api/boat/Gale');
    expect(res.status).toEqual(200);
    expect(res.body).toStrictEqual({ // retreived correct boat
        "name": "Gale",
        "status": "Outbound to Sea"
    });
  });

  it('GET /boat should 404 with non existant boat', async () => {
    const res = await requestWithSupertest.get('/api/boat/DNE');
    expect(res.status).toEqual(404); // boat does not exist
  });

  it('DEL /boat should delete boat', async () => {
    const res = await requestWithSupertest.delete('/api/boat/Gale');
    expect(res.status).toEqual(200);
    const res2 = await requestWithSupertest.get('/api/boats');
    expect(res2.body).toHaveLength(11); // 11 means boat was removed (initially 12)
  });

  it('DEL /boat should 404 for non-existant boat', async () => {
    const res = await requestWithSupertest.delete('/api/boat/DNE');
    expect(res.status).toEqual(404);
  });

  it('PATCH /boat should update status', async () => {
    const res = await requestWithSupertest.patch('/api/boat/Gale').send({'status':'Docked'});
    expect(res.status).toEqual(200);
    const res2 = await requestWithSupertest.get('/api/boat/Gale');
    expect(res2.status).toEqual(200);
    expect(res2.body).toStrictEqual({ // status changed from "Outbound to Sea" to "Docked"
        "name": "Gale",
        "status": "Docked"
    });
  });

  it('PATCH /boat should update name', async () => {
    const res = await requestWithSupertest.patch('/api/boat/Gale').send({'newName':'Newboat'});
    expect(res.status).toEqual(200);
    const res2 = await requestWithSupertest.get('/api/boat/Newboat');
    expect(res2.status).toEqual(200);
    expect(res2.body).toStrictEqual({ // Now have "Newboat" instead of "Gale"
        "name": "Newboat",
        "status": "Outbound to Sea"
    });
  });

  it('PATCH /boat should 404 on non existant boat', async () => {
    const res = await requestWithSupertest.patch('/api/boat/DNE').send({'newName':'Newboat'});
    expect(res.status).toEqual(404);
  });

  it('PATCH /boat should not update existing name', async () => {
    const res = await requestWithSupertest.patch('/api/boat/Gale').send({'newName':'Wanderlust'});
    expect(res.status).toEqual(500);
  });

  it('PATCH /boat should not set invalid status', async () => {
    const res = await requestWithSupertest.patch('/api/boat/Gale').send({'status':'Invalid'});
    expect(res.status).toEqual(500);
  });

  it('POST /boat should update boat', async () => {
    const res = await requestWithSupertest.post('/api/boat/Gale').send({'name':'Newboat','status':'Docked'});
    expect(res.status).toEqual(200);
    const res2 = await requestWithSupertest.get('/api/boat/Newboat');
    expect(res2.status).toEqual(200);
    expect(res2.body).toStrictEqual({ // Changed both name and status
        "name": "Newboat",
        "status": "Docked"
    });
  });

  it('POST /boat should 404 on non-existant boat', async () => {
    const res = await requestWithSupertest.post('/api/boat/DNE').send({'name':'Newboat','status':'Docked'});
    expect(res.status).toEqual(404);
  });

  it('POST /boat should not update invalid status', async () => {
    const res = await requestWithSupertest.post('/api/boat/Gale').send({'name':'Newboat','status':'Invalid'});
    expect(res.status).toEqual(500);
  });

  it('POST /boat should not update if that name already exists', async () => {
    const res = await requestWithSupertest.post('/api/boat/Gale').send({'name':'Wanderlust','status':'Docked'});
    expect(res.status).toEqual(500);
  });

});