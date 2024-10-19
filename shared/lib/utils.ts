import { type ClassValue, clsx } from "clsx"
import dayjs from "dayjs"
import isToday from "dayjs/plugin/isToday"
import isYesterday from "dayjs/plugin/isYesterday"
import localizedFormat from "dayjs/plugin/localizedFormat"
import relativeTime from "dayjs/plugin/relativeTime"
import { twMerge } from "tailwind-merge"

// Add the plugins you need
dayjs.extend(relativeTime)
dayjs.extend(isToday)
dayjs.extend(isYesterday)
dayjs.extend(localizedFormat)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const normalizeTimestamp = (date: Date) => {
  return dayjs(date).format("MMMM D, YYYY")
}

export const normalizeCommentDate = (date: Date) => {
  const dayjsDate = dayjs(date)
  const now = dayjs()

  const hoursDiff = now.diff(dayjsDate, "hour")
  const daysDiff = now.diff(dayjsDate, "day")

  if (hoursDiff < 24) {
    return dayjsDate.fromNow() // e.g., "2h ago"
  } else if (hoursDiff >= 24 && hoursDiff < 48) {
    return `Yesterday, ${dayjsDate.format("h:mm A")}` // e.g., "Yesterday, 11:38 PM"
  } else if (daysDiff >= 2 && daysDiff < 7) {
    return dayjsDate.format("ddd, h:mm A") // e.g., "Tue, 11:38 PM"
  }
  return dayjsDate.format("MM/DD/YYYY h:mm A") // e.g., "11/03/2022 11:38 PM"
}

export const sluggify = (str: string) => {
  return str.toLowerCase().split(" ").join("-")
}

export const mb = (mbs: number) => {
  return mbs * 1024 * 1024
}

export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    // Event listener for successful file read
    reader.onloadend = () => {
      resolve(reader.result as string) // `reader.result` contains the Data URL
    }

    // Event listener for errors
    reader.onerror = () => {
      reject(new Error("Error loading the image"))
    }

    // Initiates reading the file as a Data URL
    reader.readAsDataURL(file)
  })
}

export async function urlToFile(url: string) {
  // Fetch the image data from the URL
  const response = await fetch(url)

  // Convert the response to a Blob
  const blob = await response.blob()

  // Create a File object from the Blob with mimeType set to 'image/png'
  return new File([blob], "file.png", { type: "image/png" })
}
