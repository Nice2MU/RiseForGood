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

  const categoryEmoji: { [key: string]: string } = {
    environment: "🌱",
    education: "📚",
    health: "❤️",
    community: "🤝",
    others: "✨"
  };

  return (
    <div
      className="card bg-base-100 shadow-md border border-primary/10 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group"
      onClick={onSelect}
    >
      {activity.imageUrl && (
        <figure className="h-40 overflow-hidden bg-base-200 group-hover:scale-105 transition-transform">
          <img
            src={activity.imageUrl}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
        </figure>
      )}
      <div className="card-body p-4">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <h2 className="card-title text-primary text-base line-clamp-2 group-hover:text-primary/80 transition-colors">
              {activity.title}
            </h2>
          </div>
          <span className={`badge text-[10px] border-none flex-shrink-0 ${statusClass}`}>
            {statusLabel}
          </span>
        </div>
        
        <p className="text-xs mt-2 line-clamp-3 text-gray-600">
          {activity.description}
        </p>
        
        <div className="divider my-2"></div>
        
        <div className="space-y-1 text-[11px] text-gray-700">
          <p className="flex items-center gap-1">
            <span>🕐</span> {activity.date} • {activity.time}
          </p>
          <p className="flex items-center gap-1">
            <span>📍</span> {activity.location} ({activity.province})
          </p>
          <p className="flex items-center gap-1">
            <span>👥</span> {activity.currentVolunteers}/{activity.maxVolunteers} คน
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {activity.category && (
            <span className="badge badge-lg badge-outline text-xs">
              {categoryEmoji[activity.category as keyof typeof categoryEmoji]} {activity.category}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
