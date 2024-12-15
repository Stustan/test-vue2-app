<template>
  <div>
    <v-container>
      <v-file-input
        v-model="file"
        label="Выберите файл"
        outlined
        dense
        show-size
      />

      <v-btn
        v-if="file"
        color="primary"
        @click="uploadFile"
        class="mt-3"
      >
        Отправить
      </v-btn>

      <v-btn
        v-if="uploadedFileUrl"
        color="success"
        @click="downloadFile"
        class="mt-3"
      >
        Скачать
      </v-btn>

      <v-snackbar v-model="successSnackbar.visible" :timeout="successSnackbar.timeout" color="green">
        {{ successSnackbar.message }}
      </v-snackbar>
      <v-snackbar v-model="errorSnackbar.visible" :timeout="errorSnackbar.timeout" color="error">
        {{ errorSnackbar.message }}
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "TabTwo",
  data() {
    return {
      file: null, 
      uploadedFileUrl: null, 
      successSnackbar: {
        visible: false,
        message: "",
        timeout: 3000,
      },
      errorSnackbar: {
        visible: false,
        message: "",
        timeout: 3000,
      },
    };
  },
  methods: {
    async uploadFile() {
      if (!this.file) {
        this.errorSnackbar.message = "Файл не выбран!";
        this.errorSnackbar.visible = true;
        return;
      }

      try {
        const formData = new FormData();
        formData.append("file", this.file);

        const response = await fetch("https://api.escuelajs.co/api/v1/files/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Ошибка при загрузке файла.");
        }

        const result = await response.json();
        this.uploadedFileUrl = result.location; 

        this.successSnackbar.message = "Файл успешно отправлен!";
        this.successSnackbar.visible = true;
      } catch (error) {
        this.errorSnackbar.message = error.message || "Ошибка при загрузке файла.";
        this.errorSnackbar.visible = true;
      }
    },
    downloadFile() {
      if (!this.uploadedFileUrl) {
        this.errorSnackbar.message = "Файл не найден для скачивания!";
        this.errorSnackbar.visible = true;
        return;
      }

      const link = document.createElement("a");
      link.href = this.uploadedFileUrl;
      link.download = this.file.name; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>

<style scoped>
.mt-3 {
  margin-top: 16px;
}
</style>
