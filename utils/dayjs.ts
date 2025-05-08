import dayjs from "dayjs";
import dayjs_relativeTime from "dayjs/plugin/relativeTime";
import dayjs_weekOfYear from "dayjs/plugin/weekOfYear";
import "dayjs/locale/de";
import "dayjs/locale/nl";

dayjs.extend(dayjs_weekOfYear);
dayjs.extend(dayjs_relativeTime);

export default dayjs;
