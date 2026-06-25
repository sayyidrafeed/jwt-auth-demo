export function getDeviceInfo(request: Request): { deviceName: string; ipAddress: string } {
  const ua = request.headers.get("user-agent") || "Unknown";
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "Unknown";
  return { deviceName: ua, ipAddress: ip };
}

export function parseUserAgent(ua: string): string {
  if (ua === "Unknown") return "Unknown Device";
  const browser = ua.includes("Firefox/")
    ? "Firefox"
    : ua.includes("Edg/")
      ? "Edge"
      : ua.includes("Chrome/")
        ? "Chrome"
        : ua.includes("Safari/") && !ua.includes("Chrome/")
          ? "Safari"
          : "Browser";
  const os = ua.includes("Windows")
    ? "Windows"
    : ua.includes("Mac OS")
      ? "macOS"
      : ua.includes("Linux") || ua.includes("Android")
        ? "Linux/Android"
        : ua.includes("iPhone") || ua.includes("iPad")
          ? "iOS"
          : "Unknown OS";
  return `${browser} on ${os}`;
}
