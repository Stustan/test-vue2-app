<template>
    <!-- Your template code -->
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'TabTwo',
    data() {
      return {
        file: null,
        uploadSuccess: false,
        downloadUrl: ''
      };
    },
    methods: {
      onFileChange(event) {
        this.file = event.target.files[0];
      },
      uploadFile() {
        const formData = new FormData();
        formData.append('file', this.file);
  
        axios.post('https://api.escuelajs.co/api/v1/files/upload', formData)
          .then(response => {
            this.uploadSuccess = true;
            this.downloadUrl = response.data.location; // Adjust based on API response
            this.$vuetify.toast('File uploaded successfully');
          })
          .catch(() => {
            this.$vuetify.toast('Error uploading file');
          });
      },
      downloadFile() {
        window.open(this.downloadUrl, '_blank');
      }
    }
  };
  </script>
  