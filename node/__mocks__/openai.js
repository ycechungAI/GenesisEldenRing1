module.exports = jest.fn().mockImplementation(() => {
  return {
    apiKey: 'test',
    completions: {
      create: jest.fn().mockResolvedValue({
        choices: [
          {
            text: 'test',
          },
        ],
      }),
    },
  };
});
