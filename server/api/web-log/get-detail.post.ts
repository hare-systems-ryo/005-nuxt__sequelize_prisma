// [ nac ]
import { serverSupabaseUser } from '#supabase/server';
// ----------------------------------------------------------------------------
// [ type > api ]
import * as Get from '@/com-api/web-log-get';
// ----------------------------------------------------------------------------

export default defineEventHandler(async (event) => {
  const apiRes: Get.ApiRes = Get.InitRes();
  try {
    const user = await serverSupabaseUser(event);
    if (user === null) {
      apiRes.message = 'ログインが必要です';
      console.log('login!');
      return apiRes;
    }
    // console.log('user', user);
    const apiReq: Get.ApiReq = await readBody(event);
    const id = IntNullable(apiReq.id);
    if (id === null) {
      apiRes.message = 'IDが正しく設定されていません。';
      return apiRes;
    }
    const webLog = await prisma.webLog.findUnique({
      where: {
        id: id,
      },
    });
    // -------------------------------------------------------
    if (webLog === null) {
      apiRes.message = '該当のデータは見つかりませんでした。';
      return apiRes;
    }
    apiRes.result = true;
    apiRes.detail = Get.SetData(webLog);
  } catch (error: any) {
    apiRes.message = '不明なエラー' + error.message;
  }
  return apiRes;
});
