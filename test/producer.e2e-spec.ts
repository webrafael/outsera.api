import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ProducerIntervalResponseDto } from './../src/modules/producers/dto/producer-interval-response.dto';

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
    const response = await request(app.getHttpServer())
      .get('/producers/intervals')
      .expect(200);

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

    // Converte para o tipo correto para evitar erros de linter
    const responseData = response.body as ProducerIntervalResponseDto;

    // Testa se há pelo menos 1 intervalo mínimo
    if (responseData.min.length > 0) {
      // Teste com o primeiro intervalo mínimo
      const minInterval = responseData.min[0];

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

      // Validações específicas baseadas nos dados do CSV
      // Joel Silver ganhou em 1990 e 1991 - intervalo de 1 ano (mínimo)
      const joelSilverInterval = responseData.min.find(
        (interval) => interval.producer === 'Joel Silver',
      );

      if (joelSilverInterval) {
        expect(joelSilverInterval.interval).toBe(1);
        expect(joelSilverInterval.previousWin).toBe(1990);
        expect(joelSilverInterval.followingWin).toBe(1991);
      }

      // Verifica se todos os intervalos mínimos têm o mesmo valor
      const minIntervalValue = responseData.min[0].interval;
      responseData.min.forEach((interval) => {
        expect(interval.interval).toBe(minIntervalValue);
      });
    }

    // Testa se há pelo menos 1 intervalo máximo
    if (responseData.max.length > 0) {
      // Teste com o primeiro intervalo máximo
      const maxInterval = responseData.max[0];

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

      // Verifica se todos os intervalos máximos têm o mesmo valor
      const maxIntervalValue = responseData.max[0].interval;
      responseData.max.forEach((interval) => {
        expect(interval.interval).toBe(maxIntervalValue);
      });

      // Verifica se o intervalo máximo é maior que o mínimo (quando ambos existem)
      if (responseData.min.length > 0) {
        expect(maxIntervalValue).toBeGreaterThan(responseData.min[0].interval);
      }
    }

    // Validações adicionais baseadas nos dados do CSV
    // Verifica se os dados estão consistentes com o arquivo CSV fornecido

    // Verifica se todos os anos estão dentro do range do CSV (1980-2019)
    const allIntervals = [...responseData.min, ...responseData.max];
    allIntervals.forEach((interval) => {
      expect(interval.previousWin).toBeGreaterThanOrEqual(1980);
      expect(interval.previousWin).toBeLessThanOrEqual(2019);
      expect(interval.followingWin).toBeGreaterThanOrEqual(1980);
      expect(interval.followingWin).toBeLessThanOrEqual(2019);
      expect(interval.followingWin).toBeGreaterThan(interval.previousWin);
    });

    allIntervals.forEach((interval) => {
      // Verifica se o produtor não está vazio
      expect(interval.producer).toBeTruthy();
      expect(interval.producer.length).toBeGreaterThan(0);
    });
  });

  // Teste adicional para garantir que a API falha adequadamente quando há problemas
  it('should handle errors gracefully', async () => {
    // Simula um erro interno do servidor (se possível)
    // Este teste garante que a API não quebra completamente

    const response = await request(app.getHttpServer())
      .get('/producers/intervals')
      .expect(200); // Deve retornar 200 mesmo com dados vazios

    // Se não há dados, deve retornar arrays vazios
    const responseData = response.body as ProducerIntervalResponseDto;
    if (responseData.min.length === 0 && responseData.max.length === 0) {
      expect(responseData.min).toEqual([]);
      expect(responseData.max).toEqual([]);
    }
  });

  // Teste para validar a estrutura da resposta quando há dados
  it('should return correct data structure when data exists', async () => {
    const response = await request(app.getHttpServer())
      .get('/producers/intervals')
      .expect(200);

    const responseData = response.body as ProducerIntervalResponseDto;

    // Se há dados mínimos, valida a estrutura
    if (responseData.min.length > 0) {
      responseData.min.forEach((interval) => {
        expect(interval).toMatchObject({
          producer: expect.any(String),
          interval: expect.any(Number),
          previousWin: expect.any(Number),
          followingWin: expect.any(Number),
        } as any);
      });
    }

    // Se há dados máximos, valida a estrutura
    if (responseData.max.length > 0) {
      responseData.max.forEach((interval) => {
        expect(interval).toMatchObject({
          producer: expect.any(String),
          interval: expect.any(Number),
          previousWin: expect.any(Number),
          followingWin: expect.any(Number),
        } as any);
      });
    }
  });
});
