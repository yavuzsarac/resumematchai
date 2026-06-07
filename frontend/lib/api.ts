import { clearToken, getToken } from "@/lib/auth";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function localizeApiMessage(message: string): string {
  if (typeof window === "undefined" || window.localStorage.getItem("resumematch_locale") !== "tr") {
    return message;
  }
  const translations: Record<string, string> = {
    "The request took too long. Please try again.": "İstek çok uzun sürdü. Lütfen tekrar deneyin.",
    "Something went wrong. Please try again.": "Bir sorun oluştu. Lütfen tekrar deneyin.",
    "Invalid email or password.": "E-posta veya şifre hatalı.",
    "An account with this email already exists.": "Bu e-posta adresiyle kayıtlı bir hesap zaten var.",
    "Could not validate credentials.": "Oturum doğrulanamadı. Lütfen tekrar giriş yapın.",
    "Unsupported file type. Please upload a PDF, DOCX, or TXT file.": "Desteklenmeyen dosya türü. Lütfen PDF, DOCX veya TXT yükleyin.",
    "The uploaded resume is empty.": "Yüklenen özgeçmiş dosyası boş.",
    "The job description is too short to analyze.": "İş ilanı analiz için çok kısa.",
    "Analysis not found.": "Analiz bulunamadı.",
    "Not found.": "Bulunamadı.",
  };
  return translations[message] || message;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const timeoutController = new AbortController();
  const timeout = window.setTimeout(() => timeoutController.abort(), 120_000);
  const externalSignal = options.signal;
  const abortFromExternalSignal = () => timeoutController.abort();
  externalSignal?.addEventListener("abort", abortFromExternalSignal);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      signal: timeoutController.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(
        408,
        localizeApiMessage("The request took too long. Please try again."),
      );
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
    externalSignal?.removeEventListener("abort", abortFromExternalSignal);
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401) clearToken();
    const detail =
      typeof data?.detail === "string"
        ? data.detail
        : "Something went wrong. Please try again.";
    throw new ApiError(response.status, localizeApiMessage(detail));
  }
  return data as T;
}
