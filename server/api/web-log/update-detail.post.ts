import dayjs from 'dayjs';
import { serverSupabaseUser } from '#supabase/server';
// ----------------------------------------------------------------------------
// [ type > api ]
import * as Get from '@/com-api/web-log-get';
import * as Update from '@/com-api/web-log-update';
// ----------------------------------------------------------------------------
export default defineEventHandler(async (event) => {
  const apiRes: Update.ApiRes = Update.InitRes();
  const ts = dayjs().toDate();
  try {
    const user = await serverSupabaseUser(event);
    if (user === null) {
      apiRes.message = 'ログインが必要です';
      console.log('login!');
      return apiRes;
    }
    const uuid = user.id;
    const apiReq: Update.ApiReq = await readBody(event);
    const id = IntNullable(apiReq.pk.id);
    const validList = Update.CheckValid(apiReq);
    if (validList.length !== 0) {
      apiRes.result = false;
      apiRes.message = '入力値を見直してください。' + validList.join('\n');
      return;
    }
    const checkKeysResult = checkKeys(apiReq);
    if (checkKeysResult.length !== 0) {
      apiRes.result = false;
      apiRes.message = '入力値を見直してください。' + checkKeysResult.join('\n');
      return;
    }
    if (id === null) {
      return await insertData(apiReq, apiRes, ts, uuid);
    } else {
      return await updateData(apiReq, apiRes, ts, uuid);
    }
  } catch (error: any) {
    apiRes.result = false;
    apiRes.message = '不明なエラー' + error.message;
  }
  return apiRes;
});

const checkKeys = (apiReq: Update.ApiReq) => {
  const origin = Get.InitDetail();
  const keysOrigin = Object.keys(origin.edit);
  const keysReq = Object.keys(apiReq.edit);
  const ret: string[] = [];
  // オリジナルが網羅されているか？
  keysOrigin.forEach((key) => {
    if (!(key in apiReq.edit)) {
      ret.push(`・必須プロパティ未送信:[${key}]`);
    }
  });
  // 不要なプロパティが含まれていないか？
  keysReq.forEach((key) => {
    if (!(key in origin.edit)) {
      ret.push(`・不要プロパティ送信:[${key}]`);
    }
  });
  return ret;
};

const insertData = async (apiReq: Update.ApiReq, apiRes: Update.ApiRes, ts: Date, uuid: string) => {
  await prisma.$transaction(
    async (tx) => {
      const webLog = await prisma.webLog.create({
        data: {
          uuid: uuid,
          webLogTitle: apiReq.edit.webLogTitle,
          webLogContent: apiReq.edit.webLogContent,
          image: apiReq.edit.image,
          updatedAt: ts,
          createdAt: ts,
        },
      });
      console.log(webLog);
      if (webLog === null) {
        apiRes.result = false;
        apiRes.message = '新規追加エラー';
        return apiRes;
      }
      apiRes.result = true;
      apiRes.detail = Get.SetData(webLog);
    },
    {
      maxWait: 2000, // default: 2000
      timeout: 5000, // default: 5000
    }
  );
  return apiRes;
};

const updateData = async (apiReq: Update.ApiReq, apiRes: Update.ApiRes, ts: Date, uuid: string) => {
  await prisma.$transaction(
    async (tx) => {
      const data = await tx.webLog.findUnique({
        where: {
          id: apiReq.pk.id as number,
        },
      });
      // console.log(brand);
      // console.log(apiReq);
      if (data === null) {
        apiRes.result = false;
        apiRes.message = '該当のデータは見つかりませんでした。';
        return apiRes;
      }
      let updateFlag = false;
      const updateData: any = {};
      ObjectKeys(apiReq.edit).forEach((key) => {
        if ((data as any)[key] !== apiReq.edit[key]) {
          if (Update.DateKeyList.includes(key)) {
            (updateData as any)[key] = dayjs(apiReq.edit[key]).toDate();
          } else {
            (updateData as any)[key] = apiReq.edit[key];
          }
          updateFlag = true;
        }
      });
      if (updateFlag === false) {
        apiRes.result = false;
        apiRes.message = '更新対象のデータがありません。';
        return apiRes;
      }
      const webLog = await prisma.webLog.update({
        where: {
          id: apiReq.pk.id as number,
        },
        data: updateData,
        // include: {
        //   carDbCountry: true,
        // },
      });
      if (webLog === null) {
        apiRes.result = false;
        apiRes.message = '更新エラー';
        return apiRes;
      }
      apiRes.result = true;
      apiRes.detail = Get.SetData(webLog);
      // apiRes.listRow = List.SetData(data);
    },
    {
      maxWait: 2000, // default: 2000
      timeout: 5000, // default: 5000
    }
  );

  return apiRes;
};
