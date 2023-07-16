// [ node_modules ]
import dayjs from 'dayjs';
// [ prisma ]
import type { WebLog } from '@prisma/client';
// [ ApiUrl ]
export const ApiUrl = `/api/web-log/search`;
// ----------------------------------------------------------------------------

/**
 * テーブルに表示するデータ型
 *  - ソート機能実装が複雑になるのでネストしない
 */
export interface ListRow {
  id: number;
  webLogTitle: string;
  webLogContent: string;
  image: string | null;
  updatedAt: string | null;
  createdAt: string | null;
}

/**
 * Prismaで取得したデータ型をテーブルに表示するデータ型に変換
 */
export const SetData = (row: WebLog): ListRow => {
  return {
    id: row.id,
    webLogTitle: row.webLogTitle,
    webLogContent: row.webLogContent,
    image: row.image,
    updatedAt: dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss.SSS'),
    createdAt: dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss.SSS'),
  };
};

// ----------------------------------------------------------------------------
// [ ApiReq ]
export interface ApiReq {
  // text: string;
  // value: number | null;
}

export const InitReq = (): ApiReq => {
  return {
    // text: '',
    // value: null,
  };
};

// ----------------------------------------------------------------------------
// [ ApiRes ]
export interface ApiRes {
  result: boolean;
  message: string;
  list: ListRow[];
}

export const InitRes = (): ApiRes => {
  return {
    result: true,
    message: '',
    list: [],
  };
};
// ----------------------------------------------------------------------------
