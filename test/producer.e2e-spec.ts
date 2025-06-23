import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ProducerIntervalResponseDto } from "./../src/modules/producers/dto/producer-interval-response.dto";


describe('ProducersController (e2e)', () => {
  let app: INestApplication;

  // Cria a instância para iniciar o teste
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // Fecha a instância no final do ciclo de vida do teste
  afterEach(async () => {
    await app.close();
  });

  // Testa se a rota /producers/intervals retorna os intervalos mínimos e máximos de produção de filmes
  it('/producers/intervals (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/producers/intervals').expect(200);

    // Testa se tem o corpo da resposta definida
    expect(response.body).toBeDefined();

    // Testa se o corpo da resposta é um objeto
    expect(typeof response.body).toBe('object');

    // Testa se o objeto tem as propriedades min e max
    expect(response.body).toHaveProperty('min');
    expect(response.body).toHaveProperty('max');

    // Testa se as propriedades min e max são arrays
    expect(Array.isArray(response.body.min)).toBe(true);
    expect(Array.isArray(response.body.max)).toBe(true);

    // Testa se há pelo menos 1 intervalo mínimo
    if ((response.body as ProducerIntervalResponseDto).min.length > 0) {

        // Teste com o primeiro intervalo mínimo
        const minInterval = (response.body as ProducerIntervalResponseDto).min[0];

        // Testa se o objeto tem as propriedades producer, interval, previousWin e followingWin
        expect(minInterval).toHaveProperty('producer');
        expect(minInterval).toHaveProperty('interval');
        expect(minInterval).toHaveProperty('previousWin');
        expect(minInterval).toHaveProperty('followingWin');

        // Testa os tipos de valores das propriedades
        expect(typeof minInterval.producer).toBe('string');
        expect(typeof minInterval.interval).toBe('number');
        expect(typeof minInterval.previousWin).toBe('number');
        expect(typeof minInterval.followingWin).toBe('number');
    }

    // Testa se há pelo menos 1 intervalo máximo
    if ((response.body as ProducerIntervalResponseDto).max.length > 0) {

        // Teste com o primeiro intervalo máximo
        const maxInterval = (response.body as ProducerIntervalResponseDto).max[0];

        // Testa se o objeto tem as propriedades producer, interval, previousWin e followingWin
        expect(maxInterval).toHaveProperty('producer');
        expect(maxInterval).toHaveProperty('interval');
        expect(maxInterval).toHaveProperty('previousWin');
        expect(maxInterval).toHaveProperty('followingWin');

        // Testa os tipos de valores das propriedades
        expect(typeof maxInterval.producer).toBe('string');
        expect(typeof maxInterval.interval).toBe('number');
        expect(typeof maxInterval.previousWin).toBe('number');
        expect(typeof maxInterval.followingWin).toBe('number');
    }
  });
});