import { clsx, type ClassValue } from "clsx"
import dayjs from "dayjs"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const normalizeTimestamp = (timestamp: number) => {
  return dayjs(timestamp).format("MMMM D, YYYY")
}
