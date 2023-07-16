<script setup lang="ts">
// [ com-api ]
import * as Get from '@/com-api/web-log-get';
import * as Update from '@/com-api/web-log-update';
import * as List from '@/com-api/web-log-search';
// ----------------------------------------------------------------------------

const storeApp = useStoreApp();
definePageMeta({
  layout: 'app',
  middleware: ['app', 'app-check-login'],
});
useHead({
  title: 'WebLog',
});
// ----------------------------------------------------------------------------
const list = ref<List.ApiRes['list']>([]);
const getList = async () => {
  const { data, error } = await useFetch(List.ApiUrl, {
    method: 'post',
    headers: useRequestHeaders(['cookie']),
  });
  if (error.value || !data.value) {
    return storeApp.err('getList : Error >> ' + error.value);
  }
  const res = data.value;
  if (res.result !== true) {
    return storeApp.err('getList : Error >> ' + data.value.message);
  }
  list.value = res.list;
  storeApp.log('getList : Completed!');
};

const detailShow = ref(false);
const selectFile = ref<File[]>([]);

const showDetail = async (id: null | number) => {
  if (id) {
    await getDetail(id);
  } else {
    resetData();
  }
  nextTick();
  detailShow.value = true;
};
watch(detailShow, (flag) => {
  if (!flag) selectFile.value = [];
});

// ----------------------------------------------------------------------------
const detail = ref<Get.Detail>(Get.InitDetail());
const isDetailLoading = ref(false);

const resetData = () => {
  detail.value = Get.InitDetail();
};

const getDetail = async (id: number) => {
  if (isDetailLoading.value) return;
  try {
    resetData();
    const req: Get.ApiReq = {
      id: id,
    };
    const { data, error } = await useFetch(Get.ApiUrl, {
      method: 'post',
      headers: useRequestHeaders(['cookie']),
      body: req,
    });
    if (error.value || !data.value) {
      return storeApp.err('getDetail : Error >> ' + error.value);
    }
    const res = data.value;
    if (res.result !== true) {
      return storeApp.err('getDetail : Error >> ' + data.value.message);
    }
    detail.value = res.detail;
    storeApp.log('getDetail : Completed!');
  } catch (err: any) {
    storeApp.err('getDetail : Error >> ' + err.message);
  } finally {
    isDetailLoading.value = false;
  }
};

const updateDetail = async () => {
  if (isDetailLoading.value) return;
  try {
    isDetailLoading.value = true;
    const req: Update.ApiReq = ObjectCopy(detail.value);
    if (selectImage.value !== null) {
      req.edit.image = selectImage.value;
    }
    const validList = Update.CheckValid(req);
    if (validList.length !== 0) {
      return storeApp.err('updateDetail : Error >> ' + '入力値を見直してください。\n' + validList.join('\n'));
    }
    const { data, error } = await useFetch(Update.ApiUrl, {
      method: 'post',
      headers: useRequestHeaders(['cookie']),
      body: req,
      server: false,
    });
    if (error.value || !data.value) {
      return storeApp.err('updateDetail : Error >> ' + error.value);
    }
    const res = data.value;
    if (res.result !== true) {
      return storeApp.err('updateDetail : Error >> ' + data.value.message);
    }
    detail.value = res.detail;
    storeApp.log('updateDetail : Completed!');
    getList();
    detailShow.value = false;
  } catch (err: any) {
    storeApp.err('updateDetail : Error >> ' + err.message);
  } finally {
    selectFile.value = [];
    selectImage.value = null;
    isDetailLoading.value = false;
  }
};

// ----------------------------------------------------------------------------

const selectImage = ref<null | string>(null);
watch(selectFile, async (file) => {
  if (file === null || file.length === 0) {
    selectImage.value = null;
  } else {
    selectImage.value = await ConvertBlobToDataUrl(selectFile.value[0]);
  }
});
/**
 *   Blob | File からDataUrlへの変換
 */
const ConvertBlobToDataUrl = (data: Blob | File) => {
  return new Promise<string>((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(String(reader.result));
      };
      reader.onerror = (error) => {
        reject(new Error(`ファイルの読み込みに失敗しました。:エラー\n${error}`));
      };
      reader.readAsDataURL(data);
    } catch (err: any) {
      storeApp.err('updateDetail : Error >> ' + err.message);
      const errorMessage = `ConvertBlobToDataUrl:エラー\n${err}`;
      reject(errorMessage);
    }
  });
};

// ----------------------------------------------------------------------------
onMounted(() => {
  setTimeout(() => {
    getList();
  }, 0);
});
</script>
<template>
  <div class="">
    <v-container class="bg-white mt-3">
      <div class="" style="display: flex">
        <v-btn color="primary" to="/">Home</v-btn>
      </div>
    </v-container>
    <!-- ---------------------------------------- -->
    <!-- List -->
    <v-container class="bg-white mt-3">
      <div class="mb-2" style="display: flex; align-items: center">
        WebLog List
        <v-btn color="primary" class="ms-auto" @click="getList">更新</v-btn>
      </div>
      <template v-for="(row, index) in list" :key="index">
        <v-card variant="outlined" class="mb-2">
          <v-card-title>{{ row.webLogTitle }}</v-card-title>
          <v-card-text class="pb-0">
            <div class="" style="white-space: pre-wrap">
              {{ row.webLogContent }}
            </div>
            <div v-if="row.image">
              <v-img :width="300" aspect-ratio="16/9" cover :src="row.image"></v-img>
            </div>
            <div class="d-flex">
              <div class="me-3">投稿日時{{ row.createdAt }}</div>
              <div class="">更新日時{{ row.createdAt }}</div>
            </div>
          </v-card-text>
          <v-card-actions class="pt-0">
            <v-btn variant="outlined" color="primary" @click="showDetail(row.id)"> Edit </v-btn>
          </v-card-actions>
        </v-card>
      </template>
      <v-btn color="primary" class="ms-auto" @click="showDetail(null)"> 新規データ </v-btn>
    </v-container>
    <!-- ---------------------------------------- -->
    <!-- Edit -->
    <client-only>
      <v-overlay v-model="detailShow">
        <div style="position: absolute; inset: 0 0 0 0; width: 100vw; height: 100vh; padding: 10px 30px 10px 10px">
          <!-- <v-container class="bg-white mt-3"> -->
          <div class="" style="width: 100%; height: 100%; overflow-y: auto">
            <v-card variant="outlined" class="mb-2 bg-white">
              <v-card-title>
                <div style="display: flex; align-items: center">
                  <div class="" style="display: flex; align-items: center">WebLog Edit</div>
                  <v-btn color="primary" class="ms-auto" @click="detailShow = false">Close</v-btn>
                </div>
              </v-card-title>
              <v-card-text class="pb-0">
                <v-text-field v-model="detail.edit.webLogTitle" label="Title"></v-text-field>
                <v-textarea
                  v-model="detail.edit.webLogContent"
                  name="input-7-1"
                  variant="filled"
                  label="記事"
                  auto-grow
                ></v-textarea>
                <v-file-input v-model="selectFile" label="画像" :multiple="false"></v-file-input>
                <div class="" style="display: flex">
                  <div class="aspect-container" style="width: 50%; margin-right: 10px">
                    <div
                      class=""
                      style="
                        border: solid 2px rgb(19, 18, 61);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      "
                    >
                      <v-img
                        v-if="detail.edit.image"
                        :src="detail.edit.image"
                        contain
                        class="bg-blue-grey-darken-1"
                      ></v-img>
                    </div>
                  </div>
                  <div class="aspect-container" style="width: 50%; margin-left: 10px">
                    <div
                      class=""
                      style="
                        border: solid 2px rgb(19, 18, 61);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      "
                    >
                      <v-img v-if="selectImage" :src="selectImage" contain class="bg-blue-grey-darken-1"></v-img>
                    </div>
                  </div>
                </div>
              </v-card-text>
              <v-card-actions class="pt-0 mt-10">
                <div class="d-flex">
                  <div class="me-3">投稿日時{{ detail.readonly.createdAt }}</div>
                  <div class="">更新日時{{ detail.readonly.createdAt }}</div>
                </div>
                <v-btn variant="flat" color="primary" class="ms-auto" @click="updateDetail">Update</v-btn>
              </v-card-actions>
            </v-card>
          </div>
          <!-- </v-container> -->
        </div>
      </v-overlay>
    </client-only>

    <div class="py-10"></div>
    <div class="py-10"></div>
    <div class="py-10"></div>
    <div class="py-10"></div>
  </div>
</template>

<style lang="scss" scoped>
.aspect-container {
  position: relative;
  &::before {
    content: '';
    display: block;
    position: relative;
    padding-top: 66.66%;
  }
  > * {
    position: absolute;
    inset: 0 0 0 0;
  }
}
</style>
utils/com
