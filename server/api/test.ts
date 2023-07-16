export default defineEventHandler((event) => {
  const apiRes = {
    result: true,
    message: 'テスト用API',
  };
  return apiRes;
});
