// [ type > api]
import { Detail } from '@/com-api/web-log-get';
import * as Get from '@/com-api/web-log-get';
// ----------------------------------------------------------------------------
// [ ApiUrl ]
export const ApiUrl = `/api/web-log/update-detail`;

// ----------------------------------------------------------------------------
// [ ApiReq ]
export type ApiReq = Detail;
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// [ ApiRes ]
export type ApiRes = {
  result: boolean;
  message: string;
  detail: Detail;
  listRow: null;
};

export const InitRes = (): ApiRes => {
  return {
    result: false,
    message: '',
    detail: Get.InitDetail(),
    listRow: null,
  };
};

// ----------------------------------------------------------------------------

/**
 * 日付型のプロパティはここに指定しておく
 */
export const DateKeyList: (keyof Detail['edit'])[] = [
  //
];

/**
 * データ入力チェック
 */
export const CheckValid = (req: ApiReq) => {
  const ret: string[] = [];
  if (!req.edit.webLogTitle) {
    ret.push('・webLogTitleを入力してください。');
  }
  if (!req.edit.webLogContent) {
    ret.push('・webLogContentを入力してください。');
  }
  return ret;
};
