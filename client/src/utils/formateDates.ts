import { format } from "date-fns";

export const formatDate = (dateString: Date) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Unknown date";
    }
  };