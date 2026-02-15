import dayjs from "dayjs";
import "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.locale("vi");
dayjs.extend(relativeTime);

class Day {
  // Format ngày tháng năm (VD: 20/11/2023)
  formatDate(dateString: string) {
    return dayjs(dateString).format("DD/MM/YYYY");
  }

  // Format đầy đủ ngày giờ (VD: 14:30 - 20/11/2023)
  formatDateTime(dateString: string) {
    return dayjs(dateString).format("HH:mm - DD/MM/YYYY");
  }

  // Tính thời gian tương đối (VD: "vài giây trước", "3 ngày trước")
  timeAgo(dateString: string) {
    return dayjs(dateString).fromNow();
  }
}

export default new Day();
