export default defineEventHandler(async (event) => {
  const apiRes: any = {
    result: false,
    message: '',
    users: null,
    req: null,
  };
  try {
    // const req = await readBody(event);
    // apiRes.req = req;
    apiRes.users = await prisma.accountUser.findMany();
  } catch (error: any) {
    apiRes.message = '不明なエラー' + error.message;
  }
  return apiRes;
});
