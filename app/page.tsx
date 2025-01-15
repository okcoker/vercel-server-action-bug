"use client";
import clsx from "clsx";
import { uploadFile } from "./actions/uploadFile";
import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [imageBytes, setImageBytes] = useState<ArrayBuffer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.currentTarget.files?.[0];
    if (!file) {
      setError("No file found. try again");
      return;
    }
    const imageBytes = await readFileAsBytes(file);
    setImageBytes(imageBytes);
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (!imageBytes) {
        throw new Error("No file selected");
      }

      const { message } = await uploadFile({
        file: new Uint8Array(imageBytes),
      });
      setError(null);
      setSuccessMessage(message);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";

      setError(message);
      setSuccessMessage(null);
    }
    setIsLoading(false);
  }

  let buttonText = "Upload";
  if (isLoading) {
    buttonText = "Uploading…";
  } else if (imageBytes) {
    buttonText = `Upload ${imageBytes.byteLength} bytes`;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Vercel function bug</h1>
        <h3 className="text-xl font-bold">Choose file</h3>
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <input type="file" name="file" onChange={handleFileChange} />
          <button
            type="submit"
            disabled={imageBytes === null}
            className={clsx("rounded-md p-2", {
              "bg-slate-400": !isLoading && imageBytes === null,
              "bg-green-800 hover:bg-green-700": imageBytes !== null,
              "opacity-50": isLoading || imageBytes === null,
            })}
          >
            {buttonText}
          </button>
          {error && <p>Error message: {error}</p>}
          {successMessage && <p>Success message: {successMessage}</p>}
        </form>
      </main>
    </div>
  );
}

function readFileAsBytes(file: File | Blob) {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        if (!(reader.result instanceof ArrayBuffer)) {
          reject("Failed to read file bytes");
          return;
        }
        resolve(reader.result);
      },
      false
    );
    reader.readAsArrayBuffer(file);
  });
}
