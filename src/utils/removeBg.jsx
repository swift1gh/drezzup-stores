import axios from "axios";

const removeBg = async (imageFile) => {
  const formData = new FormData();
  formData.append("image_file", imageFile);
  formData.append("size", "auto");

  try {
    const response = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      formData,
      {
        headers: {
          "X-Api-Key": import.meta.env.VITE_REMOVE_BG_API_KEY,
        },
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], { type: "image/png" });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error removing background:", error.message);
    throw error;
  }
};

export default removeBg;
