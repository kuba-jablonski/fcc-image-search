const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Search} = require('./../models/search');
const {seedSearch} = require('./seed');

beforeEach((done) => {
    Search.remove({}).then(() => {
        Search.insertMany(seedSearch);
    }).then(() => done());
});

describe('GET /imagesearch/:searchquery', () => {
    it('should send search result and save query to database', (done) => {
        let term = 'slavs squatting';

        request(app)
            .get(`/imagesearch/${term}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.length).toBe(10);
            })
            .end((e) => {
                if (e) return done(e);

                Search.find({term}).then((docs) => {
                    expect(docs.length).toBe(1);
                    expect(docs[0].term).toBe(term);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /latest/imagesearch', () => {
    it('should get 10 latest searches', (done) => {
        request(app)
            .get('/latest/imagesearch')
            .expect(200)
            .expect((res) => {
                expect(res.body[0].term).toBe('test term 100');
                expect(res.body[1].term).toBe('test term 99');
                expect(res.body.length).toBe(10);
            })
            .end(done);
    });
});




