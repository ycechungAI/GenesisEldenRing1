import { createMocks } from 'node-mocks-http';
import handle from '../pages/api/generate';

describe('/api/generate', () => {
  describe('when using OpenAI', () => {
    beforeEach(() => {
      process.env.API_PROVIDER = 'openai';
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

    test('returns an error when the word is too long', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          word: 'a'.repeat(101),
        },
      });

      await handle(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toHaveProperty('error');
      expect(JSON.parse(res._getData()).error.message).toBe("Input must not exceed 100 characters.");
    });

    test('returns an error when the word is not a string', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          word: 123,
        },
      });

      await handle(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toHaveProperty('error');
      expect(JSON.parse(res._getData()).error.message).toBe("Input must be a string.");
    });
  });

  describe('when using Gemini', () => {
    beforeEach(() => {
      process.env.API_PROVIDER = 'gemini';
      process.env.GEMINI_API_KEY = 'test';
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
