import Image, { type ImageProps } from "next/image"

const shimmer = (w: number, h: number) => {
  const width = String(w)
  const height = String(h)

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#333" offset="20%" />
          <stop stop-color="#222" offset="50%" />
          <stop stop-color="#333" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="#333" />
      <rect id="r" width="${width}" height="${height}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${width}" to="${width}" dur="1s" repeatCount="indefinite"  />
    </svg>
  `
}

const toBase64 = (str: string) =>
  typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str)

export function ShimmerImage({ src, alt, style, ...props }: ImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(Number(props.width), Number(props.height)))}`}
      layout="responsive"
      style={{
        maxWidth: "100%",
        height: "auto",
        ...(style ? style : {}),
      }}
      {...props}
    />
  )
}
