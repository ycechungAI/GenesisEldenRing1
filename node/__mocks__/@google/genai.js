module.exports = {
  GoogleGenAI: jest.fn().mockImplementation(() => {
    return {
      models: {
        generateContent: jest.fn().mockResolvedValue({
          text: 'test',
        }),
      },
    };
  }),
};
