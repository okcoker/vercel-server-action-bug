"use client";
import clsx from "clsx";
import { uploadFile } from "./actions/uploadFile";
import { useRef, useState } from "react";

type Status = "idle" | "uploading" | "reading";

export default function Home() {
  const [imageBytes, setImageBytes] = useState<ArrayBuffer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setStatus("reading");
    const file = e.currentTarget.files?.[0];
    if (!file) {
      setError("No file found. try again");
      return;
    }
    const imageBytes = await readFileAsBytes(file);
    setImageBytes(imageBytes);
    setStatus("idle");
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setStatus("uploading");
      if (!imageBytes) {
        throw new Error("No file selected");
      }

      const result = await uploadFile({
        file: new Uint8Array(imageBytes),
      });

      setError(null);
      // result should always be an object, but with next v14, the function
      // hosted on vercel resolves to undefined
      setSuccessMessage(`${result ? JSON.stringify(result) : typeof result}`);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setImageBytes(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";

      setError(message);
      setSuccessMessage(null);
    }
    setStatus("idle");
  }

  let buttonText = "Upload";
  if (status === "reading") {
    buttonText = "Reading file…";
  } else if (status === "uploading") {
    buttonText = "Uploading…";
  } else if (imageBytes) {
    buttonText = `Upload ${imageBytes.byteLength} bytes`;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <header>
          <h1 className="text-2xl font-bold">Vercel function bug</h1>
          <p>
            Nothing is actually stored from your upload. See the{" "}
            <a
              className="text-blue-500"
              href="https://github.com/okcoker/vercel-server-action-bug"
            >
              github repo
            </a>
          </p>
        </header>
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            ref={inputRef}
          />
          <button
            type="submit"
            disabled={imageBytes === null}
            className={clsx("rounded-md p-2", {
              "bg-slate-400": !(status === "uploading") && imageBytes === null,
              "bg-green-800 hover:bg-green-700": imageBytes !== null,
              "opacity-50":
                status === "uploading" ||
                status === "reading" ||
                imageBytes === null,
            })}
          >
            {buttonText}
          </button>
          {error && <p className="text-red-500">Error: {error}</p>}
          {successMessage && (
            <p className="text-green-500">Success: {successMessage}</p>
          )}
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
