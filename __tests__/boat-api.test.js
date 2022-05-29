const utils = require("../utils");
const {api,setBoats} = require('../api');
const supertest = require('supertest');
const requestWithSupertest = supertest(api);

// Unit tests for utilities
test("fails on missing name", () => {
  expect(utils.boatValid({"status":"Docked"})).toBe(false);
});

test("fails on missing status", () => {
  expect(utils.boatValid({"name":"Boaty"})).toBe(false);
});

test("fails on invalid status", () => {
  expect(utils.boatValid({"name":"Boaty","status":"In the sky"})).toBe(false);
});

test("passes on correct boat data", () => {
  expect(utils.boatValid({"name":"Boaty","status":"Docked"})).toBe(true);
});



describe('User Endpoints', () => {

  beforeEach(() => {
    setBoats([
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

  it('GET /boats should show all boats', async () => {
    const res = await requestWithSupertest.get('/boats');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveLength(12);
    // expect(res.body).toHaveProperty('users')
  });

  it('POST /boat should create new boat', async () => {
    const res = await requestWithSupertest.post('/boat').send({"name":"Newboat","status":"Docked"});
    expect(res.status).toEqual(200);
    const res2 = await requestWithSupertest.get('/boats');
    expect(res2.body).toHaveLength(13);
    // expect(res.body).toHaveProperty('users')
  });

  it('POST /boat should not add boat with existing name', async () => {
    const res = await requestWithSupertest.post('/boat').send({"name":"Gale","status":"Docked"});
    expect(res.status).toEqual(500);
    const res2 = await requestWithSupertest.get('/boats');
    expect(res2.body).toHaveLength(12);
    // expect(res.body).toHaveProperty('users')
  });

  it('POST /boat should not add boat with invalid status', async () => {
    const res = await requestWithSupertest.post('/boat').send({"name":"Newboat","status":"BadStatus"});
    expect(res.status).toEqual(500);
    const res2 = await requestWithSupertest.get('/boats');
    expect(res2.body).toHaveLength(12);
    // expect(res.body).toHaveProperty('users')
  });

  it('GET /boat should get boat by name', async () => {
    const res = await requestWithSupertest.get('/boat/Gale');
    expect(res.status).toEqual(200);
    expect(res.body).toStrictEqual({
        "name": "Gale",
        "status": "Outbound to Sea"
    });
  });

  it('GET /boat should 404 with non existant boat', async () => {
    const res = await requestWithSupertest.get('/boat/DNE');
    expect(res.status).toEqual(404);
  });

  it('DEL /boat should delete boat', async () => {
    const res = await requestWithSupertest.delete('/boat/Gale');
    expect(res.status).toEqual(200);
    const res2 = await requestWithSupertest.get('/boats');
    expect(res2.body).toHaveLength(11);
  });

  it('DEL /boat should 404 for non-existant boat', async () => {
    const res = await requestWithSupertest.delete('/boat/DNE');
    expect(res.status).toEqual(404);
  });

  it('PATCH /boat should update status', async () => {
    const res = await requestWithSupertest.patch('/boat/Gale').send({'status':'Docked'});
    expect(res.status).toEqual(200);
    const res2 = await requestWithSupertest.get('/boat/Gale');
    expect(res2.status).toEqual(200);
    expect(res2.body).toStrictEqual({
        "name": "Gale",
        "status": "Docked"
    });
  });

  it('PATCH /boat should update name', async () => {
    const res = await requestWithSupertest.patch('/boat/Gale').send({'newName':'Newboat'});
    expect(res.status).toEqual(200);
    const res2 = await requestWithSupertest.get('/boat/Newboat');
    expect(res2.status).toEqual(200);
    expect(res2.body).toStrictEqual({
        "name": "Newboat",
        "status": "Outbound to Sea"
    });
  });

  it('PATCH /boat should 404 on non existant boat', async () => {
    const res = await requestWithSupertest.patch('/boat/DNE').send({'newName':'Newboat'});
    expect(res.status).toEqual(404);
  });

  it('PATCH /boat should not update existing name', async () => {
    const res = await requestWithSupertest.patch('/boat/Gale').send({'newName':'Wanderlust'});
    expect(res.status).toEqual(500);
  });

  it('PATCH /boat should not set invalid status', async () => {
    const res = await requestWithSupertest.patch('/boat/Gale').send({'status':'Invalid'});
    expect(res.status).toEqual(500);
  });

  it('POST /boat should update boat', async () => {
    const res = await requestWithSupertest.post('/boat/Gale').send({'name':'Newboat','status':'Docked'});
    expect(res.status).toEqual(200);
    const res2 = await requestWithSupertest.get('/boat/Newboat');
    expect(res2.status).toEqual(200);
    expect(res2.body).toStrictEqual({
        "name": "Newboat",
        "status": "Docked"
    });
  });

  it('POST /boat should 404 on non-existant boat', async () => {
    const res = await requestWithSupertest.post('/boat/DNE').send({'name':'Newboat','status':'Docked'});
    console.log(res.body);
    expect(res.status).toEqual(404);
  });

  it('POST /boat should not update invalid status', async () => {
    const res = await requestWithSupertest.post('/boat/Gale').send({'name':'Newboat','status':'Invalid'});
    expect(res.status).toEqual(500);
  });

  it('POST /boat should not update if that name already exists', async () => {
    const res = await requestWithSupertest.post('/boat/Gale').send({'name':'Wanderlust','status':'Docked'});
    expect(res.status).toEqual(500);
  });

});