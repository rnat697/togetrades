export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function objectToQueryString(obj) {
  const queryParams = [];
  for (const [key, value] of Object.entries(obj)) {
    queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  }
  return queryParams.join("&");
}