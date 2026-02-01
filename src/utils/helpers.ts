
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: string[]) => {
  return twMerge(clsx(inputs));
};


export const getIconColor = (
  type: "SUCCESS" | "ERROR" | "INFO" | undefined
) => {
  switch (type) {
    case "SUCCESS":
      return "text-semantic-green2";
    case "ERROR":
      return "text-semantic-red1";
    case "INFO":
      return "text-primary-main";
    default:
      return "text-neutral-black";
  }
};


interface formatDate {
  date: Date | string | null;
  isValue?: boolean;
}

export const formatDate = ({ date, isValue = false }: formatDate) => {
  if (!date) return "";

  if (typeof date === "string") {
    date = new Date(date);
  }

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const res =
    isValue === false ? `${dd}-${mm}-${yyyy} ` : `${yyyy}-${mm}-${dd} `;
  return res;
};


export const formatFilterDate = (dateString?: Date | string) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "-";

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

export const createURLParams = (
  params: Record<string, string | number | string[] | null | undefined>
) => {
  const keys = Object.keys(params);
  if (!keys.length) return "";

  const queryParams = new URLSearchParams();

  keys.forEach((key) => {
    const param = params[key];
    if (param === undefined || param === null || param === "") return;

    if (Array.isArray(param)) {
      queryParams.set(key, param.join(","));
    } else {
      queryParams.set(key, String(param));
    }
  });

  return `?${queryParams.toString()}`;
};
