// [ node_modules ]
import dayjs from 'dayjs';
// [ prisma ]
import type { WebLog } from '@prisma/client';
// [ ApiUrl ]
export const ApiUrl = `/api/web-log/get-detail`;
// ----------------------------------------------------------------------------
/**
 * 編集画面で使用するデータ型
 *  - 更新時もこのデータ型を使用する
 */
export interface Detail {
  pk: {
    id: number | null;
  };
  edit: {
    webLogTitle: string;
    webLogContent: string;
    image: string | null;
  };
  readonly: {
    uuid: string | null;
    updatedAt: string | null;
    createdAt: string | null;
  };
}

/**
 * Prismaで取得したデータ型を変換編集画面で使用するデータ型に変換
 */
export const SetData = (row: WebLog): Detail => {
  return {
    pk: {
      id: row.id,
    },
    edit: {
      webLogTitle: row.webLogTitle,
      webLogContent: row.webLogContent,
      image: row.image,
    },
    readonly: {
      uuid: row.webLogTitle,
      updatedAt: dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss.SSS'),
      createdAt: dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss.SSS'),
    },
  };
};

export const InitDetail = (): Detail => {
  return {
    pk: {
      id: null,
    },
    edit: {
      webLogTitle: 'たいとる',
      webLogContent: '記事の内容',
      image: null,
    },
    readonly: {
      uuid: null,
      updatedAt: null,
      createdAt: null,
    },
  };
};

// ----------------------------------------------------------------------------
// [ ApiRes ]
export interface ApiReq {
  id: number;
}

// ----------------------------------------------------------------------------
// [ ApiRes ]
export type ApiRes = {
  result: boolean;
  message: string;
  detail: Detail;
};

export const InitRes = (): ApiRes => {
  return {
    result: false,
    message: '',
    detail: InitDetail(),
  };
};
