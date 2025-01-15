"use server";

type UpdateData = {
  file: Uint8Array;
};

export async function uploadFile(data: UpdateData) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      message: `File with ${data.file.length} bytes uploaded successfully`,
    };
  } catch (e: unknown) {
    throw new Error(`Server action failed: ${e}`);
  }
}
