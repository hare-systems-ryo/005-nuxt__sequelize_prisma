/* ----------------------------------------------------------------------------
server\api\template\detail-get.post.ts
---------------------------------------------------------------------------- */

// [ node_modules ]
// import dayjs from 'dayjs';
// [ nac ]
// import { prisma } from 'server/utils/prisma';
import { serverSupabaseUser } from '#supabase/server';
// ----------------------------------------------------------------------------
// [ type > api ]
import * as List from '@/com-api/web-log-search';
// ----------------------------------------------------------------------------
export default defineEventHandler(async (event) => {
  const apiRes: List.ApiRes = List.InitRes();
  try {
    const user = await serverSupabaseUser(event);
    if (user === null) {
      apiRes.message = 'ログインが必要です';
      console.log('login!');
      return apiRes;
    }
    // const apiReq: List.ApiReq = await readBody(event);
    const list = await prisma.webLog.findMany({
      where: {
        uuid: user.id,
      },
      orderBy: [
        {
          updatedAt: 'asc',
        },
      ],
    });
    apiRes.result = true;
    apiRes.list = list.map((row) => List.SetData(row));
  } catch (err: any) {
    apiRes.result = false;
    apiRes.message = '不明なエラー' + err.message;
  }
  return apiRes;
});
