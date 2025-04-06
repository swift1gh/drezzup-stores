import axios from "axios";

const removeBackground = async (imageFile) => {
  const formData = new FormData();
  formData.append("image_file", imageFile);
  formData.append("size", "auto");

  try {
    const response = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      formData,
      {
        headers: {
          "X-Api-Key": "VUy1DkdTDjTTZtySzv1RCeB5",
        },
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], { type: "image/png" });
    console.log(blob);
    return blob;
  } catch (error) {
    console.error("Error removing background:", error.message);
    throw error;
  }
};

export default removeBackground;
