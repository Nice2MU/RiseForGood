import { Activity } from "../types/Activity";

interface Props {
  activity: Activity;
  onSelect?: () => void;
}

const ActivityCard = ({ activity, onSelect }: Props) => {
  const statusLabel =
    activity.status === "open" ? "เปิดรับสมัคร" : "ปิดรับสมัคร";

  const statusClass =
    activity.status === "open" ? "badge-success" : "badge-error";

  return (
    <div
      className="card bg-base-100 shadow-md border border-primary/10 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onSelect}
    >
      {activity.imageUrl && (
        <figure className="h-36 overflow-hidden">
          <img
            src={activity.imageUrl}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
        </figure>
      )}
      <div className="card-body p-4">
        <div className="flex justify-between items-start gap-2">
          <h2 className="card-title text-primary text-base line-clamp-2">
            {activity.title}
          </h2>
          <span className={`badge text-[10px] border-none ${statusClass}`}>
            {statusLabel}
          </span>
        </div>
        <p className="text-xs mt-1 line-clamp-3">{activity.description}</p>
        <p className="text-[11px] text-gray-600 mt-1">
          วันเวลา: {activity.date} • {activity.time}
        </p>
        <p className="text-[11px] text-gray-600">
          สถานที่: {activity.location} ({activity.province})
        </p>
      </div>
    </div>
  );
};

export default ActivityCard;
