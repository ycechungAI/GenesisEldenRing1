module.exports = {
  GoogleGenerativeAI: jest.fn().mockImplementation(() => {
    return {
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: jest.fn().mockResolvedValue({
          response: {
            text: () => 'test',
          },
        }),
      }),
    };
  }),
};
