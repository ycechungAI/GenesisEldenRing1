import { createMocks } from 'node-mocks-http';
import handle from '../pages/api/generate';

describe('/api/generate', () => {
  describe('when using OpenAI', () => {
    beforeEach(() => {
      process.env.USE_GEMINI = 'false';
    });

    test('returns a result when a word is provided', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          word: 'test',
        },
      });

      await handle(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toHaveProperty('result');
    });

    test('returns an error when no word is provided', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          word: '',
        },
      });

      await handle(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toHaveProperty('error');
    });
  });

  describe('when using Gemini', () => {
    beforeEach(() => {
      process.env.USE_GEMINI = 'true';
    });

    test('returns a result when a word is provided', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          word: 'test',
        },
      });

      await handle(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toHaveProperty('result');
    });

    test('returns an error when no word is provided', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          word: '',
        },
      });

      await handle(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toHaveProperty('error');
    });
  });
});
