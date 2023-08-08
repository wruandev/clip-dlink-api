// Import Nanoid
const customAlphabet = async (alphabet: string, defaultSize: number | undefined) => {
  const { customAlphabet } = await import('nanoid');
  return customAlphabet(alphabet, defaultSize);
};

export { customAlphabet };
